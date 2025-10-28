"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export function FocusTimer() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const createFocusSession = useMutation(api.focus.createFocusSession);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            // Timer finished
            setIsActive(false);
            if (!isBreak) {
              // Save completed focus session
              createFocusSession({ duration: 25 });
              // Start break
              setIsBreak(true);
              setMinutes(5);
              setSeconds(0);
            } else {
              // Break finished, reset to work
              setIsBreak(false);
              setMinutes(25);
              setSeconds(0);
            }
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, minutes, seconds, isBreak]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setMinutes(25);
    setSeconds(0);
  };

  return (
    <div className="flex flex-col items-center space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-block px-4 py-2 bg-white/5 border border-white/10 rounded-full">
          <p className="text-sm text-gray-400">
            {isBreak ? "Break Time" : "Focus Time"}
          </p>
        </div>
        
        {/* Glowing circle timer */}
        <div className="relative flex items-center justify-center">
          {/* Outer glow ring */}
          <div className="absolute w-80 h-80 rounded-full bg-purple-500/5 blur-2xl animate-pulse"></div>
          
          {/* Progress circle background */}
          <svg className="w-80 h-80 -rotate-90 relative z-10">
            {/* Background circle */}
            <circle
              cx="160"
              cy="160"
              r="140"
              stroke="rgba(168, 85, 247, 0.1)"
              strokeWidth="12"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="160"
              cy="160"
              r="140"
              stroke={isBreak ? "#06b6d4" : "#a855f7"}
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 140}`}
              strokeDashoffset={`${2 * Math.PI * 140 * (1 - ((isBreak ? 5 : 25) * 60 - (minutes * 60 + seconds)) / ((isBreak ? 5 : 25) * 60))}`}
              className="transition-all duration-1000"
              style={{
                filter: isActive ? 'drop-shadow(0 0 8px rgba(168, 85, 247, 0.6))' : 'none'
              }}
            />
          </svg>
          
          {/* Timer text in center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-8xl font-light text-white tabular-nums tracking-tight">
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          onClick={toggleTimer}
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8"
        >
          {isActive ? "Pause" : "Start"}
        </Button>
        <Button onClick={resetTimer} size="lg" variant="outline" className="border-white/20 text-gray-400 hover:bg-white/5 px-8">
          Reset
        </Button>
      </div>

      <div className="text-center space-y-2 pt-4">
        <p className="text-sm text-gray-500">
          25 minutes of focus, 5 minutes of rest
        </p>
        <p className="text-xs text-gray-600">
          Pomodoro technique for maximum productivity
        </p>
      </div>
    </div>
  );
}
