"use client";

import { useMode } from "./providers/ModeProvider";
import { WorkshopTransition } from "@/components/transitions/WorkshopTransition";
import { useState, useEffect } from "react";

export function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const { mode, isLoading } = useMode();
  const [showTransition, setShowTransition] = useState(false);
  const [previousMode, setPreviousMode] = useState<string | null>(null);
  const [transitionComplete, setTransitionComplete] = useState(false);

  useEffect(() => {
    if (mode && previousMode && mode !== previousMode && mode === "private") {
      setShowTransition(true);
      setTransitionComplete(false);
    }
    if (mode) {
      setPreviousMode(mode);
    }
  }, [mode, previousMode]);

  const handleTransitionComplete = () => {
    setShowTransition(false);
    setTransitionComplete(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-white/10 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <WorkshopTransition show={showTransition} onComplete={handleTransitionComplete} />
      <div className="min-h-screen">
        {children}
      </div>
    </>
  );
}
