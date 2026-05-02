"use client";

import { useGlobalContext } from "@/context/GlobalContext";
import { Info, CheckCircle, AlertTriangle, XCircle, Clock } from "lucide-react";

export default function LiveActivityFeed() {
  const { logs } = useGlobalContext();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />;
      case 'warning': return <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
      case 'error': return <XCircle className="w-3.5 h-3.5 text-red-400" />;
      default: return <Info className="w-3.5 h-3.5 text-blue-400" />;
    }
  };

  return (
    <div className="glass-panel rounded-xl flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400" />
          System Activity
        </h3>
        <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full font-bold uppercase">Live</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {logs.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs italic">
            Waiting for system events...
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex gap-3 items-start animate-in fade-in slide-in-from-right-2 duration-300">
              <div className="mt-0.5 shrink-0">
                {getIcon(log.type)}
              </div>
              <div className="space-y-0.5 min-w-0">
                <p className="text-xs text-slate-300 leading-tight break-words">{log.message}</p>
                <p className="text-[10px] text-slate-500 font-medium">{log.timestamp}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
