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
      setTimeout(() => setStage(1), 200),
      setTimeout(() => setStage(2), 600),
      setTimeout(() => {
        onComplete();
      }, 1200),
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
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black"
        >
          {/* Fade to black */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-gray-950 via-black to-gray-900"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          />

          {/* Workshop text reveal */}
          <motion.div
            className="relative z-10 text-center space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: stage >= 1 ? 1 : 0,
              y: stage >= 1 ? 0 : 20
            }}
            transition={{ duration: 0.4 }}
          >
            <div className="text-6xl mb-4">⚡</div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 bg-clip-text text-transparent">
              THE WORKSHOP
            </h1>
            <p className="text-gray-500 text-sm tracking-wider">
              ENTERING PRIVATE MODE
            </p>
          </motion.div>

          {/* Subtle pulse effect */}
          {stage >= 1 && (
            <motion.div
              className="absolute inset-0 bg-yellow-400/5"
              animate={{
                opacity: [0, 0.3, 0],
              }}
              transition={{
                duration: 1,
                repeat: 1,
              }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
