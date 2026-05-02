"use client";

import { Save, Bell, Eye, Database, HelpCircle, Mail, MessageSquare, User, Shield, FileOutput, Globe, Clock, ChevronRight, Camera } from "lucide-react";
import { useGlobalContext } from "../../context/GlobalContext";
import { useState } from "react";

export default function Settings() {
  const { settings, updateSettings } = useGlobalContext();
  const [localSettings, setLocalSettings] = useState(settings);
  const [supportForm, setSupportForm] = useState({
    email: "",
    category: "Model Accuracy",
    description: ""
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profile, setProfile] = useState({
    name: "Harshit Shah",
    role: "Head of Department • Data Science"
  });

  const handleClearCache = () => {
    if (confirm("Are you sure you want to clear the system cache? This will reset simulation data.")) {
      localStorage.clear();
      alert("System cache cleared successfully!");
      window.location.reload();
    }
  };

  const handleSupportSubmit = () => {
    const subject = encodeURIComponent(`[NexusEdu Support] ${supportForm.category}`);
    const body = encodeURIComponent(
      `Issue Report from: ${supportForm.email}\n\n` +
      `Category: ${supportForm.category}\n` +
      `Description: ${supportForm.description}\n\n` +
      `-- Sent via NexusEdu Platform Settings`
    );
    
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=shahharshitv@gmail.com&su=${subject}&body=${body}`;
    window.open(gmailUrl, "_blank");
  };

  const handleSave = () => {
    updateSettings(localSettings);
    alert("Settings saved successfully!");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* 2. User Profile Identity Panel */}
      <div className="glass-panel p-6 rounded-2xl mb-8 flex flex-col md:flex-row items-center gap-6 border-l-4 border-l-blue-500">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-3xl font-bold text-white shadow-xl shadow-blue-500/20">
            SH
          </div>
          <button className="absolute bottom-0 right-0 p-2 bg-slate-800 rounded-full border border-white/10 hover:bg-slate-700 transition">
            <Camera className="w-4 h-4 text-blue-400" />
          </button>
        </div>
        <div className="flex-1 text-center md:text-left">
          {isEditingProfile ? (
            <div className="space-y-2">
              <input 
                type="text" 
                value={profile.name} 
                onChange={(e) => setProfile({...profile, name: e.target.value})}
                className="bg-slate-800 border border-blue-500/30 rounded px-2 py-1 text-white w-full max-w-xs"
              />
              <input 
                type="text" 
                value={profile.role} 
                onChange={(e) => setProfile({...profile, role: e.target.value})}
                className="bg-slate-800 border border-blue-500/30 rounded px-2 py-1 text-blue-400 text-sm w-full max-w-xs"
              />
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-white">{profile.name}</h1>
              <p className="text-blue-400 font-medium">{profile.role}</p>
            </>
          )}
          <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-3">
            <span className="text-xs bg-slate-800/50 text-slate-400 px-3 py-1 rounded-full border border-white/5 flex items-center gap-1.5">
              <Mail className="w-3 h-3" /> shahharshitv@gmail.com
            </span>
            <span className="text-xs bg-slate-800/50 text-slate-400 px-3 py-1 rounded-full border border-white/5 flex items-center gap-1.5">
              <Shield className="w-3 h-3" /> Admin Access
            </span>
          </div>
        </div>
        <button 
          onClick={() => setIsEditingProfile(!isEditingProfile)}
          className={`px-4 py-2 text-sm rounded-lg transition border ${isEditingProfile ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 hover:bg-white/10 text-white border-white/10'}`}
        >
          {isEditingProfile ? "Save Profile" : "Edit Profile"}
        </button>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 4. Regional Settings (Language & Date Format) */}
          <div className="glass-panel p-6 rounded-xl">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Globe className="w-5 h-5 text-indigo-400" />
              Regional & Language
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Interface Language</label>
                <select className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
                  <option>English (US)</option>
                  <option>Hindi (भारत)</option>
                  <option>Spanish (ES)</option>
                  <option>French (FR)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Date Format</label>
                <select className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
                  <option>DD/MM/YYYY</option>
                  <option>MM/DD/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
              </div>
            </div>
          </div>

          {/* 3. Export & Cloud Sync (CSV/PDF, Backup) */}
          <div className="glass-panel p-6 rounded-xl">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <FileOutput className="w-5 h-5 text-emerald-400" />
              Data Export & Sync
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Default Export Format</label>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 bg-slate-800 border border-emerald-500/30 text-emerald-400 text-xs rounded-lg font-bold">CSV</button>
                  <button className="flex-1 py-2 bg-slate-800 border border-white/5 text-slate-500 text-xs rounded-lg">Excel</button>
                  <button className="flex-1 py-2 bg-slate-800 border border-white/5 text-slate-500 text-xs rounded-lg">PDF</button>
                </div>
              </div>
              <label className="flex items-center justify-between p-3 bg-slate-800/40 rounded-lg border border-white/5 cursor-pointer">
                <div>
                  <p className="text-sm font-medium text-slate-200">Cloud Auto-Backup</p>
                  <p className="text-[10px] text-slate-500 text-emerald-500/80 font-bold">Synced 2m ago</p>
                </div>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Security & Access (Part of Feature 2) */}
        <div className="glass-panel p-6 rounded-xl">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-rose-400" />
            Security & Login History
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-500/10 rounded-lg"><Clock className="w-4 h-4 text-rose-400" /></div>
                <div>
                  <p className="text-sm font-medium text-slate-200">Current Session (Windows • Chrome)</p>
                  <p className="text-[10px] text-slate-500">192.168.1.1 • Active Now</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-white/5 opacity-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-700 rounded-lg"><Clock className="w-4 h-4 text-slate-500" /></div>
                <div>
                  <p className="text-sm font-medium text-slate-200">Previous Session (Android • Chrome)</p>
                  <p className="text-[10px] text-slate-500">2h ago • Mumbai, India</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </div>
          </div>
        </div>

        {/* Previous Settings (Compact) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel p-6 rounded-xl">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Eye className="w-5 h-5 text-purple-400" />
              Privacy & Notifications
            </h2>
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-slate-300">Anonymize Data</span>
                <input 
                  type="checkbox" 
                  checked={localSettings.anonymizeData}
                  onChange={(e) => setLocalSettings({...localSettings, anonymizeData: e.target.checked})}
                  className="w-4 h-4 accent-purple-500"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-slate-300">Email Advisors</span>
                <input 
                  type="checkbox" 
                  checked={localSettings.emailAdvisors}
                  onChange={(e) => setLocalSettings({...localSettings, emailAdvisors: e.target.checked})}
                  className="w-4 h-4 accent-blue-500"
                />
              </label>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-xl">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-400" />
              System Cache
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-300">Current Storage</span>
                <span className="text-xs text-slate-500 font-mono">1.2 MB / 5 MB</span>
              </div>
              <button 
                onClick={handleClearCache}
                className="w-full py-2 bg-slate-800 border border-rose-500/30 text-rose-400 text-xs rounded-lg hover:bg-rose-500/10 transition"
              >
                Clear Local Cache & Data
              </button>
            </div>
          </div>
        </div>

        {/* Help & Support */}
        <div className="glass-panel p-6 rounded-xl">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-400" />
            Help & Support
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400">Your Contact Email</label>
                <input 
                  type="email" 
                  placeholder="teacher@nexus.edu"
                  value={supportForm.email}
                  onChange={(e) => setSupportForm({...supportForm, email: e.target.value})}
                  className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-slate-200 focus:outline-none" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400">Category</label>
                <select 
                  value={supportForm.category}
                  onChange={(e) => setSupportForm({...supportForm, category: e.target.value})}
                  className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-slate-200"
                >
                  <option>Model Accuracy</option>
                  <option>UI/UX Feedback</option>
                  <option>System Bug</option>
                </select>
              </div>
            </div>
            <textarea 
              rows={3}
              placeholder="Provide details about the issue..."
              value={supportForm.description}
              onChange={(e) => setSupportForm({...supportForm, description: e.target.value})}
              className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-slate-200 focus:outline-none"
            ></textarea>
            <button 
              onClick={handleSupportSubmit}
              className="w-full py-2.5 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Submit Ticket (Gmail)
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8 pb-10">
          <button 
            onClick={() => setLocalSettings(settings)}
            className="px-6 py-2 rounded-lg text-slate-300 hover:text-white transition"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-500 transition shadow-[0_0_15px_rgba(37,99,235,0.4)] flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
