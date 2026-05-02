"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, BarChart3, Settings, GraduationCap } from "lucide-react";
import clsx from "clsx";

export default function NavBar() {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Simulation Feed", href: "/students", icon: Users },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <>
      {/* Top Header (Desktop & Mobile) */}
      <header className="border-b border-white/10 glass-panel sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center animate-glow">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Harshit <span className="text-blue-400">Edu</span></span>
          </Link>
          
          {/* Desktop Links */}
          <nav className="hidden md:flex gap-2">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className={clsx(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive 
                      ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" 
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600 shadow-lg">
              <span className="text-xs font-medium text-white">AD</span>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation (Only visible on Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-white/10 px-6 py-3 flex justify-between items-center bg-slate-950/80 backdrop-blur-xl">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link 
              key={link.name} 
              href={link.href}
              className={clsx(
                "flex flex-col items-center gap-1 transition-all duration-200",
                isActive ? "text-blue-400 scale-110" : "text-slate-500 hover:text-slate-300"
              )}
            >
              <Icon className={clsx("w-6 h-6", isActive && "drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]")} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{link.name.split(' ')[0]}</span>
            </Link>
          );
        })}
      </nav>
      
      {/* Spacer to prevent content from being hidden behind the bottom bar on mobile */}
      <div className="md:hidden h-20" />
    </>
  );
}
