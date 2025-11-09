import pandas as pd
from experta import *

class UserInput(Fact):
    """Fact for user data."""
    pass

class UniversityCourseExpertSystem(KnowledgeEngine):
    def __init__(self, csv_path):
        super().__init__()
        self.df = pd.read_csv(csv_path)
        print("CSV columns:", list(self.df.columns))
        self.df.columns = [col.strip().lower() for col in self.df.columns]  # Normalize headers
        self.LowestPossibleRecommendations = []
        self.HighestPossibleRecommendations = []

    @DefFacts()
    def _initial_action(self):
        yield Fact(started=True)

    @Rule(Fact(started=True),
          AS.ui << UserInput(stream=MATCH.stream, district=MATCH.district, zscore=MATCH.zscore))
    def recommend_courses(self, ui, stream, district, zscore):
        df_filtered = self.df[
            self.df['stream'].str.lower().str.contains(stream.lower().strip()) &
            (self.df['district'].str.lower() == district.lower())
        ]
        for _, row in df_filtered.iterrows():
            cutoff_raw = row['z_score']
            # Handle 'NQC' rows
            if isinstance(cutoff_raw, str) and cutoff_raw.strip().upper() == 'NQC':
                continue
            try:
                cutoff = float(cutoff_raw)
            except Exception:
                continue
            confidence = self.calculate_confidence(zscore, cutoff)
            if zscore <= cutoff:
                self.LowestPossibleRecommendations.append({
                    'Course': row['course_name'],
                    'University': row['university'],
                    'Z_Cutoff': cutoff,
                    'Confidence': confidence
                })
            else:
                self.HighestPossibleRecommendations.append({
                    'Course': row['course_name'],
                    'University': row['university'],
                    'Z_Cutoff': cutoff,
                    'Confidence': confidence
                })

    def calculate_confidence(self, user_zscore, cutoff):
        margin = user_zscore - cutoff
        base = 60.0
        if margin >= 0.5:
            bonus = 30
        elif margin >= 0.3:
            bonus = 25
        elif margin >= 0.2:
            bonus = 20
        elif margin >= 0.1:
            bonus = 15
        elif margin >= 0.05:
            bonus = 10
        elif margin >= 0.0:
            bonus = 5
        else:
            bonus = 0
        confidence = base + bonus
        return min(confidence, 100.0)
    
    # This method is for FastAPI: returns list of top recommendations
    def get_top_recommendations(self, topn=10):
        return sorted(self.HighestPossibleRecommendations, key=lambda x: -x['Z_Cutoff'])[:topn]
