from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from engine import UserInput, UniversityCourseExpertSystem

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for local dev; restrict in prod
    allow_methods=["*"],
    allow_headers=["*"],
)


class UserInputModel(BaseModel):
    stream: str
    district: str
    zscore: float

@app.post("/recommendations/")
def post_recommendations(user: UserInputModel):
    engine = UniversityCourseExpertSystem('cleaned_cutoff.csv')
    engine.reset()
    engine.declare(UserInput(stream=user.stream, district=user.district, zscore=user.zscore))
    engine.run()
    
    # Collect results from internal state
    recommendations = engine.HighestPossibleRecommendations
    
    if not recommendations:
        raise HTTPException(status_code=404, detail="No courses found matching inputs.")
    # Optionally return only top 10
    return {
        "recommendations": sorted(recommendations, key=lambda x: -x['Z_Cutoff'])[:10]
    }

@app.post("/alternatives/")
def get_alternatives(user: UserInputModel):
    engine = UniversityCourseExpertSystem('cleaned_cutoff.csv')
    engine.reset()
    
    # First run the main recommendation logic
    engine.declare(UserInput(stream=user.stream, district=user.district, zscore=user.zscore))
    engine.run()
    
    # Get alternative recommendations using your existing method
    alternatives = engine.AlternativeRecommendations()
    
    if not alternatives:
        raise HTTPException(status_code=404, detail="No alternative solutions found.")
    
    return {
        "alternatives": alternatives
    }