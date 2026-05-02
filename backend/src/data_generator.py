import pandas as pd
import numpy as np
import os

def generate_realistic_student_data(n_students=5000):
    np.random.seed(42)
    
    # 1. Demographics & Background
    student_id = [f"STU_{i:05d}" for i in range(1, n_students + 1)]
    gender = np.random.choice(["Male", "Female", "Other"], size=n_students, p=[0.48, 0.48, 0.04])
    school_type = np.random.choice(["Public", "Private"], size=n_students, p=[0.7, 0.3])
    parent_edu = np.random.choice(["High School", "Undergrad", "Postgrad"], size=n_students, p=[0.5, 0.35, 0.15])
    commute_min = np.clip(np.random.normal(30, 15, size=n_students), 5, 120)
    
    # Base aptitude factor (hidden variable to create realistic correlations)
    # Aptitude slightly influenced by parent_edu
    aptitude_base = np.zeros(n_students)
    aptitude_base += np.where(parent_edu == "Postgrad", 0.5, 0)
    aptitude_base += np.where(parent_edu == "Undergrad", 0.2, 0)
    aptitude = np.random.normal(aptitude_base, 1.0)
    
    # 2. Academic History & Effort
    prior_gpa = np.clip(np.random.normal(2.5 + 0.3 * aptitude, 0.5), 1.0, 4.0)
    
    # Effort factor correlated with aptitude but has its own variance
    effort = np.random.normal(0.5 * aptitude, 1.0)
    
    study_hours_wk = np.clip(np.random.normal(10 + 3 * effort, 5), 0, 40)
    attendance_pct = np.clip(np.random.normal(75 + 10 * effort, 15), 0, 100)
    lms_logins_wk = np.clip(np.random.normal(4 + 1.5 * effort, 2), 0, 15).astype(int)
    forum_posts = np.clip(np.random.normal(2 + 1 * effort, 3), 0, 20).astype(int)
    on_time_submit_pct = np.clip(np.random.normal(70 + 15 * effort, 20), 0, 100)
    
    # 3. Current Semester Performance (Correlated with prior gpa, attendance, study hours)
    performance_score = (
        0.3 * (prior_gpa / 4.0) +
        0.2 * (attendance_pct / 100.0) +
        0.2 * (study_hours_wk / 40.0) +
        0.15 * (on_time_submit_pct / 100.0) +
        0.15 * np.random.normal(0.5, 0.1, size=n_students) # random noise
    )
    
    quiz_avg = np.clip(performance_score * 100 + np.random.normal(0, 5, size=n_students), 0, 100)
    assign_avg = np.clip(performance_score * 100 + np.random.normal(0, 5, size=n_students), 0, 100)
    midterm = np.clip(performance_score * 100 + np.random.normal(0, 8, size=n_students), 0, 100)
    
    # 4. Final Outcomes
    # Final score combines midterm, quizzes, and a final push (influenced by effort)
    final_score = np.clip((0.3 * midterm) + (0.3 * quiz_avg) + (0.2 * assign_avg) + (0.2 * np.clip(np.random.normal(performance_score * 100, 10), 0, 100)), 0, 100)
    
    # Calculate Grade Band
    conditions = [
        (final_score >= 90),
        (final_score >= 80),
        (final_score >= 70),
        (final_score >= 60)
    ]
    choices = ['A', 'B', 'C', 'D']
    final_grade_band = np.select(conditions, choices, default='F')
    
    passed = (final_score >= 60).astype(int)
    
    df = pd.DataFrame({
        "student_id": student_id,
        "gender": gender,
        "school_type": school_type,
        "prior_gpa": np.round(prior_gpa, 2),
        "attendance_pct": np.round(attendance_pct, 1),
        "quiz_avg": np.round(quiz_avg, 1),
        "assign_avg": np.round(assign_avg, 1),
        "midterm": np.round(midterm, 1),
        "study_hours_wk": np.round(study_hours_wk, 1),
        "on_time_submit_pct": np.round(on_time_submit_pct, 1),
        "lms_logins_wk": lms_logins_wk,
        "forum_posts": forum_posts,
        "parent_edu": parent_edu,
        "commute_min": np.round(commute_min, 0),
        "final_score": np.round(final_score, 1),
        "final_grade_band": final_grade_band,
        "passed": passed
    })
    
    # Ensure directory exists
    os.makedirs(os.path.dirname("../data/students.csv"), exist_ok=True)
    
    df.to_csv("../data/students.csv", index=False)
    print(f"Dataset generated successfully with {n_students} records.")
    print("Class Balance:")
    print(df['passed'].value_counts(normalize=True))

if __name__ == "__main__":
    generate_realistic_student_data()
