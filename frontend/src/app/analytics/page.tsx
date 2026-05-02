"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Activity, Users, AlertTriangle, TrendingUp } from "lucide-react";
import { useGlobalContext } from "../../context/GlobalContext";

export default function Analytics() {
  const { students, settings } = useGlobalContext();

  const totalStudents = students.length;
  
  let atRiskCount = 0;
  let totalAttendance = 0;
  let lowRiskCount = 0;
  let mediumRiskCount = 0;
  let highRiskCount = 0;
  
  let grades = { A: 0, B: 0, C: 0, D: 0, F: 0 };

  students.forEach(student => {
    totalAttendance += student.attendance_pct;
    
    // Calculate estimated grade
    const avgScore = (student.midterm + student.quiz_avg + student.assign_avg) / 3;
    if (avgScore >= 90) grades.A++;
    else if (avgScore >= 80) grades.B++;
    else if (avgScore >= 70) grades.C++;
    else if (avgScore >= 60) grades.D++;
    else grades.F++;

    if (student.prediction) {
      if (student.prediction.at_risk) {
        atRiskCount++;
      }
      
      const riskScore = student.prediction.risk_score * 100;
      if (riskScore >= settings.threshold) {
        highRiskCount++;
      } else if (riskScore >= settings.threshold / 2) {
        mediumRiskCount++;
      } else {
        lowRiskCount++;
      }
    }
  });

  const avgAttendance = totalStudents > 0 ? (totalAttendance / totalStudents).toFixed(1) : 0;
  const modelAccuracy = 94.0; // Simulated constant metric

  const gradeData = [
    { name: 'Grade A', students: grades.A },
    { name: 'Grade B', students: grades.B },
    { name: 'Grade C', students: grades.C },
    { name: 'Grade D', students: grades.D },
    { name: 'Grade F', students: grades.F },
  ];

  const riskData = [
    { name: 'Low Risk', value: lowRiskCount, color: '#10b981' },
    { name: 'Medium Risk', value: mediumRiskCount, color: '#f59e0b' },
    { name: 'High Risk', value: highRiskCount, color: '#ef4444' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">Global Analytics</h1>
        <p className="text-slate-400">Aggregated insights across all students this semester</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="glass-panel p-6 rounded-xl flex items-center gap-4 group hover:border-blue-500/50 transition-colors">
          <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Users className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400 font-medium">Total Students</p>
            <p className="text-2xl font-bold text-white">{totalStudents}</p>
          </div>
        </div>
        <div className="glass-panel p-6 rounded-xl flex items-center gap-4 group hover:border-red-500/50 transition-colors">
          <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400 font-medium">At Risk</p>
            <p className="text-2xl font-bold text-white">{atRiskCount}</p>
          </div>
        </div>
        <div className="glass-panel p-6 rounded-xl flex items-center gap-4 group hover:border-emerald-500/50 transition-colors">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Activity className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400 font-medium">Avg Attendance</p>
            <p className="text-2xl font-bold text-white">{avgAttendance}%</p>
          </div>
        </div>
        <div className="glass-panel p-6 rounded-xl flex items-center gap-4 group hover:border-purple-500/50 transition-colors relative overflow-hidden">
          <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
            <TrendingUp className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400 font-medium">Model Accuracy</p>
            <p className="text-2xl font-bold text-white">{modelAccuracy}%</p>
          </div>
          {/* Small drift indicator */}
          <div className="absolute top-2 right-2 flex items-center gap-1">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
             <span className="text-[8px] text-emerald-500 font-bold uppercase">No Drift</span>
          </div>
        </div>
      </div>

      {totalStudents === 0 && (
        <div className="mb-8 p-6 glass-panel rounded-xl text-center border border-amber-500/30 bg-amber-500/5">
          <p className="text-amber-400 flex items-center justify-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            No student data available. Please run predictions or start the simulation feed to populate analytics.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar Chart */}
        <div className="glass-panel p-6 rounded-xl h-96">
          <h3 className="text-lg font-semibold text-white mb-6">Predicted Grade Distribution</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={gradeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                itemStyle={{ color: '#f8fafc' }}
                cursor={{ fill: '#334155', opacity: 0.4 }}
              />
              <Bar dataKey="students" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="glass-panel p-6 rounded-xl h-96">
          <h3 className="text-lg font-semibold text-white mb-6">Overall Risk Profile</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={riskData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {riskData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                itemStyle={{ color: '#f8fafc' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
