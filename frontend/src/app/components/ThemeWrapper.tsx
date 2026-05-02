"use client";

import { useGlobalContext } from "../../context/GlobalContext";
import { ReactNode } from "react";

export default function ThemeWrapper({ children }: { children: ReactNode }) {
  const { settings } = useGlobalContext();
  
  return (
    <div className={`flex-1 flex flex-col ${settings.highContrastMode ? 'high-contrast' : ''}`}>
      {children}
    </div>
  );
}
