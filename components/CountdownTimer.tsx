'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CountdownTimerProps {
  seconds: number;
  onComplete: () => void;
}

export default function CountdownTimer({ seconds, onComplete }: CountdownTimerProps) {
  const [remaining, setRemaining] = useState(seconds);
  const calledRef = useRef(false);

  useEffect(() => {
    setRemaining(seconds);
    calledRef.current = false;
  }, [seconds]);

  useEffect(() => {
    if (remaining <= 0) {
      if (!calledRef.current) {
        calledRef.current = true;
        onComplete();
      }
      return;
    }
    const timer = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(timer);
  }, [remaining, onComplete]);

  const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
  const ss = String(remaining % 60).padStart(2, '0');
  const pct = ((seconds - remaining) / seconds) * 100;

  const barColor = pct < 50 ? '#22c55e' : pct < 75 ? '#f59e0b' : '#ef4444';
  const textColor = remaining <= 5 ? '#ef4444' : remaining <= 15 ? '#f59e0b' : '#1d4ed8';
  const isPulsing = remaining <= 5;

  return (
    <div className="flex flex-col items-center gap-2">
      <AnimatePresence mode="wait">
        <motion.div
          key={remaining}
          animate={
            isPulsing
              ? { scale: [1, 1.05, 1], transition: { duration: 1, repeat: 0 } }
              : { scale: 1 }
          }
          className="font-mono font-bold text-5xl tracking-widest select-none"
          style={{ color: textColor, textShadow: '0 2px 4px rgba(0,0,0,0.15)' }}
        >
          {mm}:{ss}
        </motion.div>
      </AnimatePresence>

      {/* Progress bar */}
      <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: barColor }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'linear' }}
        />
      </div>

      <p className="text-xs text-gray-500">Waiting for window to open...</p>
    </div>
  );
}
