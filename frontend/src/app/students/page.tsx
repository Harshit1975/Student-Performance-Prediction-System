"use client";

import { useEffect, useRef } from "react";
import axios from "axios";
import { Users, AlertTriangle, CheckCircle, Clock, Zap, Shield, BarChart3 } from "lucide-react";
import { useGlobalContext, StudentData } from "../../context/GlobalContext";

const firstNames = ["James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen"];
const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"];

const generateRandomStudent = (): StudentData => {
  const effort = Math.random() * 2 - 1; // -1 to 1
  return {
    id: `STU_${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
    name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
    prior_gpa: Math.min(4.0, Math.max(1.0, 2.5 + effort + Math.random() * 0.5)),
    attendance_pct: Math.min(100, Math.max(0, 70 + effort * 20 + Math.random() * 10)),
    quiz_avg: Math.min(100, Math.max(0, 65 + effort * 25 + Math.random() * 10)),
    assign_avg: Math.min(100, Math.max(0, 70 + effort * 20 + Math.random() * 10)),
    midterm: Math.min(100, Math.max(0, 60 + effort * 30 + Math.random() * 10)),
    study_hours_wk: Math.max(0, 10 + effort * 5 + Math.random() * 5),
    on_time_submit_pct: Math.min(100, Math.max(0, 75 + effort * 15 + Math.random() * 10)),
    lms_logins_wk: Math.max(0, Math.floor(4 + effort * 2 + Math.random() * 2)),
    forum_posts: Math.max(0, Math.floor(2 + effort + Math.random() * 2)),
    commute_min: Math.floor(Math.random() * 60 + 10),
    gender: Math.random() > 0.5 ? "Female" : "Male",
    school_type: Math.random() > 0.7 ? "Private" : "Public",
    parent_edu: Math.random() > 0.5 ? "High School" : "Undergrad",
  };
};

export default function StudentsSimulation() {
  const { students, addStudent, isRunning, setIsRunning, settings } = useGlobalContext();
  const feedRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to top when new students arrive
  useEffect(() => {
    if (settings.autoScrollFeed && isRunning && feedRef.current) {
      feedRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [students.length, settings.autoScrollFeed, isRunning]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    // Map speed 1-5 to milliseconds (5000ms down to 500ms)
    const speedMap: Record<number, number> = {
      1: 5000,
      2: 3000,
      3: 1500,
      4: 800,
      5: 400
    };

    const intervalMs = speedMap[settings.simulationSpeed] || 3000;

    if (isRunning) {
      interval = setInterval(async () => {
        const newStudent = generateRandomStudent();
        
        try {
          const res = await axios.post("http://localhost:8000/predict", newStudent);
          
          // Apply custom threshold if settings are defined
          const risk_score = res.data.risk_score;
          const custom_at_risk = risk_score * 100 > settings.threshold;
          
          newStudent.prediction = {
            ...res.data,
            at_risk: custom_at_risk
          };
          
          addStudent(newStudent);
        } catch (error) {
          console.error("Prediction failed", error);
        }
      }, intervalMs);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, settings.threshold, settings.simulationSpeed, addStudent]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Real-Time Simulation Feed</h1>
          <p className="text-slate-400">Live stream of incoming student data and AI predictions</p>
        </div>
        <button 
          onClick={() => setIsRunning(!isRunning)}
          className={`px-6 py-2 rounded-lg font-medium transition shadow-lg flex items-center gap-2 ${
            isRunning 
              ? "bg-red-500 hover:bg-red-600 text-white shadow-red-500/20" 
              : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/40 animate-glow"
          }`}
        >
          {isRunning ? "Stop Simulation" : "Start Live Feed"}
        </button>
      </div>

      <div className="glass-panel rounded-xl p-6 min-h-[60vh] flex flex-col">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
          <div className="flex gap-4">
            <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs flex items-center gap-1.5">
              <Zap className="w-3 h-3" />
              {isRunning ? 'Simulation Live' : 'Simulation Paused'}
            </div>
            <div className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs flex items-center gap-1.5">
              <Shield className="w-3 h-3" />
              {settings.anonymizeData ? 'Privacy Mode Active' : 'Public Mode'}
            </div>
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <BarChart3 className="w-3 h-3" />
            Session Total: {students.length}
          </div>
        </div>

        <div 
          ref={feedRef}
          className="flex-1 overflow-y-auto max-h-[70vh] pr-2 custom-scrollbar"
        >
        {!isRunning && students.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500 gap-4">
            <Clock className="w-12 h-12 opacity-50" />
            <p className="text-lg">Simulation is paused. Click "Start Live Feed" to begin.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {students.slice(0, 50).map((student, i) => (
              <div key={student.id + i} className="flex flex-col md:flex-row items-center justify-between p-4 bg-slate-800/40 border border-white/5 rounded-lg hover:bg-slate-800/60 transition">
                <div className="flex items-center gap-4 w-full md:w-1/3 mb-4 md:mb-0">
                  <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-slate-300" />
                  </div>
                  <div>
                    <h3 className={`font-semibold text-white transition-all ${settings.anonymizeData ? 'blur-sm select-none' : ''}`}>
                      {settings.anonymizeData ? "Student Name Hidden" : student.name}
                    </h3>
                    <p className={`text-xs text-slate-400 transition-all ${settings.anonymizeData ? 'blur-[2px] select-none' : ''}`}>
                      ID: {settings.anonymizeData ? "STU_XXXX" : student.id}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-6 w-full md:w-1/3 justify-center mb-4 md:mb-0 text-sm">
                  <div className="flex flex-col items-center">
                    <span className="text-slate-400 text-xs">GPA</span>
                    <span className="font-medium text-slate-200">{student.prior_gpa.toFixed(2)}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-slate-400 text-xs">Attendance</span>
                    <span className="font-medium text-slate-200">{student.attendance_pct.toFixed(0)}%</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-slate-400 text-xs">Midterm</span>
                    <span className="font-medium text-slate-200">{student.midterm.toFixed(0)}</span>
                  </div>
                </div>

                <div className="w-full md:w-1/3 flex justify-end">
                  {student.prediction && (
                    <div className={`px-4 py-2 rounded-lg flex items-center gap-3 border w-full max-w-xs ${
                      student.prediction.at_risk 
                        ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                        : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                    }`}>
                      {student.prediction.at_risk ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                      <div className="flex flex-col">
                        <span className="font-bold">{(student.prediction.risk_score * 100).toFixed(1)}% Risk</span>
                        <span className="text-xs opacity-80">{student.prediction.predicted_status}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
