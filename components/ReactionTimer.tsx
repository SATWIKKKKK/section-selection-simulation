'use client';
import { useEffect, useRef, useState } from 'react';

interface ReactionTimerProps {
  windowStartTime: number | null;
}

export default function ReactionTimer({ windowStartTime }: ReactionTimerProps) {
  const [elapsed, setElapsed] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!windowStartTime) return;
    const update = () => {
      setElapsed(Date.now() - windowStartTime);
      rafRef.current = requestAnimationFrame(update);
    };
    rafRef.current = requestAnimationFrame(update);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [windowStartTime]);

  const secs = elapsed / 1000;
  const color = secs < 10 ? '#22c55e' : secs < 20 ? '#f59e0b' : '#ef4444';

  return (
    <span
      className="font-mono text-[10px] font-bold px-1 rounded"
      style={{ color, backgroundColor: 'rgba(0,0,0,0.2)' }}
    >
      {secs.toFixed(1)}s
    </span>
  );
}
