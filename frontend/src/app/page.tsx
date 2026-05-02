"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { 
  Activity, BookOpen, Clock, Users, GraduationCap, 
  AlertTriangle, CheckCircle, TrendingUp, AlertCircle,
  Download, Sparkles, Wand2, Search
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";
import { useGlobalContext } from "../context/GlobalContext";
import SystemHealth from "./components/SystemHealth";
import LiveActivityFeed from "./components/LiveActivityFeed";
import { motion, AnimatePresence } from "framer-motion";

// Helper for dynamic avatars
const StudentAvatar = ({ name, size = "md" }: { name: string, size?: "sm" | "md" | "lg" }) => {
  const seed = encodeURIComponent(name);
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16"
  };
  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden border-2 border-slate-700 shadow-xl bg-slate-800`}>
      <img 
        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`} 
        alt={name} 
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default function Dashboard() {
  const { addStudent, settings, addLog } = useGlobalContext();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [historyData, setHistoryData] = useState<any[]>([]);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "Alex Johnson",
    prior_gpa: 2.8,
    attendance_pct: 75,
    quiz_avg: 65,
    assign_avg: 70,
    midterm: 60,
    study_hours_wk: 8,
    on_time_submit_pct: 80,
    lms_logins_wk: 3,
    forum_posts: 1,
    commute_min: 45,
    gender: "Female",
    school_type: "Public",
    parent_edu: "High School"
  });

  useEffect(() => {
    // Generate dynamic history data based on current form inputs
    const baseScore = formData.prior_gpa * 20;
    const endScore = (formData.midterm + formData.quiz_avg + formData.assign_avg) / 3;
    
    const data = Array.from({ length: 8 }, (_, i) => {
      const score = baseScore + ((endScore - baseScore) * (i / 7));
      const noise = ((i % 3) - 1) * (100 - formData.attendance_pct) / 10;
      return {
        week: `W${i + 1}`,
        score: Math.round(Math.min(100, Math.max(0, score + noise)))
      };
    });
    setHistoryData(data);
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ["name", "gender", "school_type", "parent_edu"].includes(name) ? value : Number(value)
    }));
  };

  const generateAIInsight = (data: any, input: any) => {
    const risk = data.risk_score * 100;
    let insight = "";
    
    if (risk > 70) {
      insight = `URGENT: ${input.name} shows high risk due to ${input.attendance_pct}% attendance and ${input.midterm} midterm score. The model suggests immediate intervention.`;
    } else if (risk > 40) {
      insight = `${input.name} is in the warning zone. Improving study hours (currently ${input.study_hours_wk}h/wk) could shift them to 'On Track' status.`;
    } else {
      insight = `${input.name} is performing exceptionally well. Maintaining current LMS engagement (${input.lms_logins_wk} logins/wk) is key to sustained success.`;
    }
    setAiInsight(insight);
  };

  const handlePredict = async () => {
    setLoading(true);
    addLog(`Initiating AI analysis for ${formData.name}...`, 'info');
    try {
      const res = await axios.post("http://localhost:8000/predict", formData);
      
      const risk_score = res.data.risk_score;
      const custom_at_risk = risk_score * 100 > settings.threshold;
      
      const predictionData = {
        ...res.data,
        at_risk: custom_at_risk
      };
      
      setResult(predictionData);
      generateAIInsight(predictionData, formData);

      addStudent({
        id: `STU_MNL_${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        ...formData,
        prediction: predictionData
      });
      
    } catch (error: any) {
      console.error(error);
      addLog(`Prediction failed for ${formData.name}`, 'error');
      alert("Error connecting to prediction server. Ensure FastAPI is running on port 8000.");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    addLog(`Generating academic report for ${formData.name}...`, 'info');
    setTimeout(() => {
      const reportContent = `
=========================================
      NEXUSEDU ACADEMIC ANALYTICS
=========================================
Student Name: ${formData.name}
Date: ${new Date().toLocaleDateString()}
-----------------------------------------
ACADEMIC PROFILE:
- Prior GPA: ${formData.prior_gpa}
- Attendance: ${formData.attendance_pct}%
- Midterm Score: ${formData.midterm}
- Study Hours: ${formData.study_hours_wk}h/wk

AI PREDICTION RESULTS:
- Risk Level: ${result ? (result.at_risk ? 'HIGH RISK' : 'ON TRACK') : 'N/A'}
- Risk Score: ${result ? (result.risk_score * 100).toFixed(1) : 'N/A'}%
- Pass Probability: ${result ? (result.pass_probability * 100).toFixed(1) : 'N/A'}%
- Predicted Outcome: ${result ? result.predicted_status : 'N/A'}

AI COPILOT INSIGHT:
"${aiInsight || 'No insight generated yet.'}"

RECOMMENDED INTERVENTIONS:
${result?.recommended_interventions?.map((action: string) => `- ${action}`).join('\n') || 'None'}
-----------------------------------------
Generated by: Student Performance Prediction System (v2.4.1)
=========================================
      `;

      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Report_${formData.name.replace(/\s+/g, '_')}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      addLog(`Report for ${formData.name} downloaded successfully`, 'success');
    }, 1200);
  };

  const radarData = [
    { subject: 'Grades', A: (formData.midterm + formData.quiz_avg + formData.assign_avg) / 3, fullMark: 100 },
    { subject: 'Attendance', A: formData.attendance_pct, fullMark: 100 },
    { subject: 'Engagement', A: formData.lms_logins_wk * 10, fullMark: 100 },
    { subject: 'Study', A: formData.study_hours_wk * 4, fullMark: 100 },
    { subject: 'GPA', A: formData.prior_gpa * 25, fullMark: 100 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto px-4 lg:px-8 py-8 w-full"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Student Analytics Platform</h1>
          <div className="flex items-center gap-4">
            <p className="text-slate-400">Predictive modeling & intervention dashboard</p>
            <SystemHealth />
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleExport}
            className="px-4 py-2 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 transition flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Report
          </button>
          <button 
            onClick={handlePredict}
            disabled={loading}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-500 transition shadow-[0_0_15px_rgba(37,99,235,0.4)] disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : <Activity className="w-4 h-4" />}
            {loading ? "Analyzing..." : "Run Prediction"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column: Inputs & Charts */}
        <div className="xl:col-span-2 space-y-6">
          <motion.div layout className="glass-panel rounded-xl p-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                Student Profile Data
              </h2>
              <StudentAvatar name={formData.name} size="lg" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="md:col-span-2 lg:col-span-3 space-y-2">
                <label className="text-sm font-medium text-slate-300">Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full input-field rounded-lg px-4 py-2.5" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Prior GPA</label>
                <input type="number" name="prior_gpa" value={formData.prior_gpa} onChange={handleChange} step="0.1" className="w-full input-field rounded-lg px-4 py-2.5" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Attendance (%)</label>
                <input type="number" name="attendance_pct" value={formData.attendance_pct} onChange={handleChange} className="w-full input-field rounded-lg px-4 py-2.5" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Midterm Score</label>
                <input type="number" name="midterm" value={formData.midterm} onChange={handleChange} className="w-full input-field rounded-lg px-4 py-2.5" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Quiz Average</label>
                <input type="number" name="quiz_avg" value={formData.quiz_avg} onChange={handleChange} className="w-full input-field rounded-lg px-4 py-2.5" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Assignment Avg</label>
                <input type="number" name="assign_avg" value={formData.assign_avg} onChange={handleChange} className="w-full input-field rounded-lg px-4 py-2.5" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Study Hours/Wk</label>
                <input type="number" name="study_hours_wk" value={formData.study_hours_wk} onChange={handleChange} className="w-full input-field rounded-lg px-4 py-2.5" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">LMS Logins/Wk</label>
                <input type="number" name="lms_logins_wk" value={formData.lms_logins_wk} onChange={handleChange} className="w-full input-field rounded-lg px-4 py-2.5" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">On-Time Submissions (%)</label>
                <input type="number" name="on_time_submit_pct" value={formData.on_time_submit_pct} onChange={handleChange} className="w-full input-field rounded-lg px-4 py-2.5" />
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel rounded-xl p-6 h-64">
              <h3 className="text-sm font-medium text-slate-400 mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Performance Trend
              </h3>
              <ResponsiveContainer width="100%" height="80%">
                <AreaChart data={historyData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="week" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="score" stroke="#3b82f6" fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="glass-panel rounded-xl p-6 h-64">
              <h3 className="text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Capability Radar
              </h3>
              <ResponsiveContainer width="100%" height="90%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={10} />
                  <Radar name="Student" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column: Results & Activity */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-panel rounded-xl p-6 relative overflow-hidden"
              >
                <div className={`absolute -top-20 -right-20 w-48 h-48 rounded-full opacity-20 blur-3xl ${result.at_risk ? 'bg-red-500' : 'bg-emerald-500'}`} />
                <h2 className="text-xl font-semibold mb-6 flex items-center justify-between">
                  Prediction Results
                  <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                </h2>
                
                <div className="space-y-6">
                  {aiInsight && (
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-2">
                      <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                        <Sparkles className="w-3 h-3" />
                        AI Copilot
                      </h4>
                      <p className="text-sm text-slate-200 italic leading-relaxed">"{aiInsight}"</p>
                    </div>
                  )}

                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-400 mb-1">Risk Score</p>
                      <span className={`text-4xl font-bold ${result.at_risk ? 'text-red-400' : 'text-emerald-400'}`}>
                        {(result.risk_score * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold border ${result.at_risk ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                      {result.at_risk ? 'HIGH RISK' : 'ON TRACK'}
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-slate-400">Outcome</span><span>{result.predicted_status}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Pass Prob.</span><span>{(result.pass_probability * 100).toFixed(1)}%</span></div>
                    <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden mt-2">
                      <div className={`h-full ${result.at_risk ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${result.risk_score * 100}%` }} />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5">
                    <h3 className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-2"><AlertCircle className="w-3 h-3 text-amber-400" /> INTERVENTIONS</h3>
                    <ul className="space-y-2">
                      {result.recommended_interventions?.map((action: string, i: number) => (
                        <li key={i} className="text-xs bg-slate-800/50 p-2 rounded border border-white/5 text-slate-300 flex gap-2">
                          <div className="w-1 h-1 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                          {action}
                        </li>
                      )) || <li className="text-xs text-slate-500">None required.</li>}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel rounded-xl p-10 flex flex-col items-center justify-center text-slate-500 gap-4 text-center">
                <Wand2 className="w-12 h-12 opacity-30" />
                <p>Enter student data and run <br/> prediction for AI insights</p>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="h-64">
            <LiveActivityFeed />
          </div>

          <div className="glass-panel rounded-xl p-4 text-[10px] text-slate-500 space-y-1">
            <div className="flex justify-between"><span>Algorithm</span><span className="text-slate-400">XGBoost Classifier</span></div>
            <div className="flex justify-between"><span>Calibration</span><span className="text-slate-400">Isotonic Regression</span></div>
            <div className="flex justify-between"><span>Version</span><span className="text-slate-400">v2.4.1 (Stable)</span></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
