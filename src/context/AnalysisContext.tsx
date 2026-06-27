"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { AssociationRule } from "@/types";

export interface MineSummary {
  totalItemsets: number;
  totalRules: number;
  executionTimeMs: number;
  minSupport: number;
  minConfidence: number;
  maxLen: number;
}

interface AnalysisContextType {
  rules: AssociationRule[];
  summary: MineSummary | null;
  isMined: boolean;
  setAnalysisResults: (rules: AssociationRule[], summary: MineSummary) => void;
  resetAnalysis: () => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export function AnalysisProvider({ children }: { children: React.ReactNode }) {
  const [rules, setRules] = useState<AssociationRule[]>([]);
  const [summary, setSummary] = useState<MineSummary | null>(null);
  const [isMined, setIsMined] = useState(false);

  // Ambil data dari localStorage jika ada saat client-side hydration
  useEffect(() => {
    const savedRules = localStorage.getItem("mba_rules");
    const savedSummary = localStorage.getItem("mba_summary");
    if (savedRules && savedSummary) {
      try {
        setRules(JSON.parse(savedRules));
        setSummary(JSON.parse(savedSummary));
        setIsMined(true);
      } catch (e) {
        console.error("Gagal merestore hasil analisis terdahulu:", e);
      }
    }
  }, []);

  const setAnalysisResults = (newRules: AssociationRule[], newSummary: MineSummary) => {
    setRules(newRules);
    setSummary(newSummary);
    setIsMined(true);
    localStorage.setItem("mba_rules", JSON.stringify(newRules));
    localStorage.setItem("mba_summary", JSON.stringify(newSummary));
  };

  const resetAnalysis = () => {
    setRules([]);
    setSummary(null);
    setIsMined(false);
    localStorage.removeItem("mba_rules");
    localStorage.removeItem("mba_summary");
  };

  return (
    <AnalysisContext.Provider value={{ rules, summary, isMined, setAnalysisResults, resetAnalysis }}>
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error("useAnalysis must be used within an AnalysisProvider");
  }
  return context;
}
