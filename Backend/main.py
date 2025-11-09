from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from engine import UserInput, UniversityCourseExpertSystem
import openai
import os
from typing import List, Optional
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = FastAPI()

# Initialize OpenAI client
openai.api_key = os.getenv("OPENAI_API_KEY")

# # Debug: Print if API key is loaded (first few characters only for security)
# if openai.api_key:
#     print(f"OpenAI API key loaded: {openai.api_key[:10]}...")
# else:
#     print("OpenAI API key not found!")

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

class CourseDetailRequest(BaseModel):
    course_name: str
    university: str
    stream: str

class CourseQuestionRequest(BaseModel):
    course_name: str
    university: str
    stream: str
    question: str
    chat_history: Optional[List[dict]] = []

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

@app.post("/course-details/")
async def get_course_details(request: CourseDetailRequest):
    try:
        prompt = f"""
        Provide a comprehensive overview of the {request.course_name} program at {request.university} in Sri Lanka.
        This is a {request.stream} stream course.
        
        Please include the following information:
        1. Course Overview (2-3 sentences)
        2. Key subjects/modules covered
        3. Duration and degree type
        4. Career opportunities after graduation
        5. Skills you'll develop
        6. Entry requirements or prerequisites
        7. Why this course is valuable in today's job market
        
        Keep the response informative but concise (around 200-300 words).
        Focus on information relevant to Sri Lankan students and job market.
        """
        
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an expert academic advisor specializing in Sri Lankan university programs. Provide accurate, helpful information about courses and career guidance."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=500,
            temperature=0.7
        )
        
        return {
            "course_details": response.choices[0].message.content.strip(),
            "course_name": request.course_name,
            "university": request.university
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating course details: {str(e)}")

@app.post("/course-question/")
async def ask_course_question(request: CourseQuestionRequest):
    try:
        # Build context from chat history
        messages = [
            {"role": "system", "content": f"You are an expert academic advisor specializing in {request.course_name} at {request.university} in Sri Lanka. Answer questions about this specific course, career prospects, curriculum, requirements, and related academic guidance. Keep responses helpful and concise."}
        ]
        
        # Add chat history
        for chat in request.chat_history:
            messages.append({"role": chat["role"], "content": chat["content"]})
        
        # Add current question
        messages.append({"role": "user", "content": request.question})
        
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages,
            max_tokens=300,
            temperature=0.7
        )
        
        return {
            "answer": response.choices[0].message.content.strip(),
            "question": request.question
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing question: {str(e)}")