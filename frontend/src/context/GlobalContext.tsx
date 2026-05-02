"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type StudentData = {
  id: string;
  name: string;
  prior_gpa: number;
  attendance_pct: number;
  quiz_avg: number;
  assign_avg: number;
  midterm: number;
  study_hours_wk: number;
  on_time_submit_pct: number;
  lms_logins_wk: number;
  forum_posts: number;
  commute_min: number;
  gender: string;
  school_type: string;
  parent_edu: string;
  prediction?: any;
};

export type LogEntry = {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
};

export type SettingsData = {
  threshold: number;
  enableAutomatedInterventions: boolean;
  emailAdvisors: boolean;
  driftDetection: boolean;
  simulationSpeed: number; // 1 to 5
  autoScrollFeed: boolean;
  anonymizeData: boolean;
  highContrastMode: boolean;
  autoSaveInterval: number; // minutes
  maxStoredStudents: number;
};

interface GlobalContextProps {
  students: StudentData[];
  addStudent: (student: StudentData) => void;
  settings: SettingsData;
  updateSettings: (newSettings: Partial<SettingsData>) => void;
  isRunning: boolean;
  setIsRunning: (running: boolean) => void;
  logs: LogEntry[];
  addLog: (message: string, type?: LogEntry['type']) => void;
}

const GlobalContext = createContext<GlobalContextProps | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [students, setStudents] = useState<StudentData[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [settings, setSettings] = useState<SettingsData>({
    threshold: 50,
    enableAutomatedInterventions: true,
    emailAdvisors: true,
    driftDetection: true,
    simulationSpeed: 2,
    autoScrollFeed: true,
    anonymizeData: false,
    highContrastMode: false,
    autoSaveInterval: 5,
    maxStoredStudents: 500,
  });
  const [isRunning, setIsRunning] = useState(false);

  const addStudent = (student: StudentData) => {
    setStudents((prev) => {
      const exists = prev.find(s => s.id === student.id);
      if (exists) {
        return prev.map(s => s.id === student.id ? student : s);
      }
      return [student, ...prev].slice(0, settings.maxStoredStudents);
    });
    
    addLog(`Processed prediction for student: ${student.name}`, student.prediction?.at_risk ? 'warning' : 'success');
  };

  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      message,
      type
    };
    setLogs(prev => [newLog, ...prev].slice(0, 50)); // Keep last 50 logs
  };

  const updateSettings = (newSettings: Partial<SettingsData>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    addLog(`System settings updated`, 'info');
  };

  return (
    <GlobalContext.Provider
      value={{ 
        students, 
        addStudent, 
        settings, 
        updateSettings, 
        isRunning, 
        setIsRunning,
        logs,
        addLog
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};
