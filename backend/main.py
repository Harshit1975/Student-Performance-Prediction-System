from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd
from pydantic import BaseModel, Field
import os

app = FastAPI(
    title="Student Performance Prediction API",
    description="API for predicting if a student will pass or fail based on semester signals.",
    version="1.0.0"
)

# Enable CORS for the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For production, change to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic model for input validation
class StudentFeatures(BaseModel):
    prior_gpa: float = Field(..., ge=0.0, le=10.0, description="Prior GPA (0.0 to 10.0)")
    attendance_pct: float = Field(..., ge=0.0, le=100.0, description="Attendance percentage (0-100)")
    quiz_avg: float = Field(..., ge=0.0, le=100.0, description="Average quiz score (0-100)")
    assign_avg: float = Field(..., ge=0.0, le=100.0, description="Average assignment score (0-100)")
    midterm: float = Field(..., ge=0.0, le=100.0, description="Midterm exam score (0-100)")
    study_hours_wk: float = Field(..., ge=0.0, description="Study hours per week")
    on_time_submit_pct: float = Field(..., ge=0.0, le=100.0, description="Percentage of assignments submitted on time")
    lms_logins_wk: int = Field(..., ge=0, description="Number of LMS logins per week")
    forum_posts: int = Field(..., ge=0, description="Number of forum posts")
    commute_min: float = Field(..., ge=0.0, description="Commute time in minutes")
    gender: str = Field(..., description="Gender (Male, Female, Other)")
    school_type: str = Field(..., description="School Type (Public, Private)")
    parent_edu: str = Field(..., description="Parent's Education Level (High School, Undergrad, Postgrad)")

# In-memory database to store predicted students for real-time analytics
predicted_students = []

@app.on_event("startup")
def load_model():
    global model
    model_path = os.path.join(os.path.dirname(__file__), "models", "student_perf_calibrated.joblib")
    try:
        model = joblib.load(model_path)
        print("Model loaded successfully.")
    except Exception as e:
        print(f"Error loading model: {e}")
        
@app.get("/")
def read_root():
    return {"status": "online", "message": "Student Performance Prediction API is running."}

@app.post("/predict")
def predict_performance(student: StudentFeatures, risk_threshold: float = 0.5):
    if model is None:
        raise HTTPException(status_code=503, detail="Model is not loaded.")
        
    try:
        data = pd.DataFrame([student.model_dump()])
        proba = float(model.predict_proba(data)[0, 1])
        risk_prob = 1.0 - proba
        
        at_risk = bool(risk_prob >= risk_threshold)
        
        interventions = []
        if student.attendance_pct < 80:
            interventions.append("Attendance is low. Schedule a check-in.")
        if student.quiz_avg < 60:
            interventions.append("Quiz scores are weak. Suggest micro-quizzes.")
        if student.lms_logins_wk < 3:
            interventions.append("Low LMS activity. Send automated nudges.")
            
        if not interventions and at_risk:
            interventions.append("General risk identified. Schedule advising session.")
            
        result = {
            "pass_probability": proba,
            "risk_score": risk_prob,
            "at_risk": at_risk,
            "predicted_status": "Pass" if proba >= 0.5 else "Fail",
            "recommended_interventions": interventions
        }
        
        # Save to memory for global analytics
        predicted_students.append({
            "risk_score": risk_prob,
            "at_risk": at_risk,
            "pass_probability": proba,
            "attendance": student.attendance_pct
        })
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.get("/analytics")
def get_analytics(risk_threshold: float = 0.5):
    # Base data from CSV (Simulating historical DB)
    data_path = os.path.join(os.path.dirname(__file__), "data", "students.csv")
    try:
        df = pd.read_csv(data_path)
        # Combine historical with newly predicted
        total_students = len(df) + len(predicted_students)
        
        # Simplified metrics for dashboard
        # Using the memory buffer + CSV to generate dynamic stats
        
        # Calculate current average attendance (historical + new)
        avg_att = (df["attendance_pct"].sum() + sum(s["attendance"] for s in predicted_students)) / total_students
        
        # Risk distribution
        # Historical risks (based on final_score < 60)
        hist_high = len(df[df["final_score"] < 60])
        hist_low = len(df[df["final_score"] >= 60])
        
        new_high = sum(1 for s in predicted_students if s["risk_score"] >= risk_threshold)
        new_low = sum(1 for s in predicted_students if s["risk_score"] < risk_threshold)
        
        # Grade Distribution (mocking update based on recent pass probs)
        grade_dist = [
            {"name": "Grade A", "students": len(df[df["final_grade_band"] == 'A'])},
            {"name": "Grade B", "students": len(df[df["final_grade_band"] == 'B'])},
            {"name": "Grade C", "students": len(df[df["final_grade_band"] == 'C'])},
            {"name": "Grade D", "students": len(df[df["final_grade_band"] == 'D']) + new_low}, # Assigning new low risk to D
            {"name": "Grade F", "students": len(df[df["final_grade_band"] == 'F']) + new_high}  # Assigning new high risk to F
        ]
        
        risk_dist = [
            {"name": "Low Risk", "value": hist_low + new_low, "color": "#10b981"},
            {"name": "High Risk", "value": hist_high + new_high, "color": "#ef4444"}
        ]
        
        return {
            "total_students": total_students,
            "at_risk_count": hist_high + new_high,
            "avg_attendance": round(avg_att, 1),
            "grade_distribution": grade_dist,
            "risk_distribution": risk_dist,
            "model_accuracy": 94.0 # Static for now as it's evaluated separately
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

