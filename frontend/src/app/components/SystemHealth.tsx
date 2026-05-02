"use client";

import { useEffect, useState } from "react";
import { Zap, Server, Database, Globe } from "lucide-react";

export default function SystemHealth() {
  const [metrics, setMetrics] = useState({
    latency: 24,
    load: 12,
    status: "Operational"
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics({
        latency: Math.floor(Math.random() * 15) + 20,
        load: Math.floor(Math.random() * 20) + 5,
        status: "Operational"
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-6 px-4 py-2 bg-slate-900/50 border border-slate-800 rounded-full text-[10px] uppercase tracking-wider font-bold text-slate-400">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="hidden sm:inline">System: {metrics.status}</span>
      </div>
      <div className="flex items-center gap-2 border-l border-slate-800 pl-4">
        <Zap className="w-3 h-3 text-amber-400" />
        <span>Latency: <span className="text-white">{metrics.latency}ms</span></span>
      </div>
      <div className="flex items-center gap-2 border-l border-slate-800 pl-4">
        <Server className="w-3 h-3 text-blue-400" />
        <span>Load: <span className="text-white">{metrics.load}%</span></span>
      </div>
      <div className="hidden lg:flex items-center gap-2 border-l border-slate-800 pl-4">
        <Database className="w-3 h-3 text-purple-400" />
        <span>DB: <span className="text-white">Connected</span></span>
      </div>
    </div>
  );
}
