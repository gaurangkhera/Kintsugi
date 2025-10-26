"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface WorkshopTransitionProps {
  show: boolean;
  onComplete: () => void;
}

export function WorkshopTransition({ show, onComplete }: WorkshopTransitionProps) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (!show) return;

    const timers = [
      setTimeout(() => setStage(1), 300),
      setTimeout(() => setStage(2), 1000),
      setTimeout(() => setStage(3), 1800),
      setTimeout(() => {
        onComplete();
      }, 2500),
    ];

    return () => timers.forEach(clearTimeout);
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
        >
          <motion.div
            className="absolute inset-0 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          />

          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

          <motion.div
            className="relative z-10 text-center space-y-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ 
              opacity: stage >= 1 ? 1 : 0,
              scale: stage >= 1 ? 1 : 0.9
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: stage >= 2 ? 1 : 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                <span className="text-[10px] tracking-[0.3em] text-gray-600 uppercase">System Initializing</span>
              </div>
            </motion.div>

            <motion.h1 
              className="text-6xl font-light tracking-tight text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: stage >= 1 ? 1 : 0,
                y: stage >= 1 ? 0 : 20
              }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              THE WORKSHOP
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: stage >= 2 ? 1 : 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center gap-2"
            >
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400/50"></div>
              <p className="text-gray-500 text-xs tracking-wider uppercase">
                Access Granted
              </p>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-400/50"></div>
            </motion.div>
          </motion.div>

          {stage >= 2 && (
            <motion.div
              className="absolute inset-0 bg-amber-400/5"
              animate={{
                opacity: [0, 0.2, 0],
              }}
              transition={{
                duration: 1.5,
                ease: "easeInOut"
              }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
