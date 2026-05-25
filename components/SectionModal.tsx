'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSimStore } from '@/store/simStore';
import { SECTIONS } from '@/lib/sections';
import ReactionTimer from './ReactionTimer';

interface SectionModalProps {
  onClose: () => void;
}

export default function SectionModal({ onClose }: SectionModalProps) {
  const { seatCounts, claimSection, windowOpen, windowStartTime, drainSeat, botRushEnabled, difficulty } = useSimStore();
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const drainRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [shakeSections, setShakeSections] = useState<Set<string>>(new Set());

  // Bot drain logic
  useEffect(() => {
    if (!windowOpen || !botRushEnabled) return;

    drainRef.current = setInterval(() => {
      const store = useSimStore.getState();
      if (store.selectedSection) {
        clearInterval(drainRef.current!);
        return;
      }
      const numSections = Math.ceil(54 * 0.15);
      const shuffled = [...SECTIONS].sort(() => Math.random() - 0.5).slice(0, numSections);
      const newShake = new Set<string>();
      shuffled.forEach((sec) => {
        const current = store.seatCounts[sec.code] ?? 0;
        if (current === 0) return;
        let amount = 1;
        if (difficulty === 'normal') amount = Math.floor(Math.random() * 3) + 1;
        if (difficulty === 'hard') amount = Math.floor(Math.random() * 4) + 2;
        drainSeat(sec.code, amount);
        const after = Math.max(0, current - amount);
        if (after === 0 && current > 0) newShake.add(sec.code);
      });
      if (newShake.size > 0) {
        setShakeSections((prev) => {
          const combined = new Set<string>();
          prev.forEach((s) => combined.add(s));
          newShake.forEach((s) => combined.add(s));
          return combined;
        });
        setTimeout(() => {
          setShakeSections((prev) => {
            const next = new Set(prev);
            newShake.forEach((s) => next.delete(s));
            return next;
          });
        }, 400);
      }
    }, 800);

    return () => {
      if (drainRef.current) clearInterval(drainRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [windowOpen, botRushEnabled]);

  const handleSubmit = () => {
    if (!selected || submitted) return;
    setSubmitted(true);
    if (drainRef.current) clearInterval(drainRef.current);
    claimSection(selected);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
      style={{ fontFamily: 'Tahoma, Arial, sans-serif' }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-sm flex flex-col shadow-lg"
        style={{
          backgroundColor: '#e6ebf5',
          border: '1px solid #8ca5c4',
          boxShadow: '2px 2px 5px rgba(0,0,0,0.3)',
        }}
        role="dialog"
        aria-labelledby="modal-title"
      >
        {/* Window Header */}
        <div
          id="modal-title"
          className="flex justify-between items-center px-2 py-1 font-bold text-white text-xs"
          style={{ background: 'linear-gradient(to bottom, #10638e, #0d4d70)' }}
        >
          <span>Select Faculty / Section</span>
          <div className="flex items-center gap-2">
            <ReactionTimer windowStartTime={windowStartTime} />
            <div className="flex gap-1">
              <button
                aria-label="Minimize"
                className="w-3.5 h-3.5 bg-[#e6ebf5] border border-[#10638e] flex items-center justify-center text-[#10638e] text-[10px] hover:bg-white"
              >_</button>
              <button
                aria-label="Close"
                onClick={onClose}
                className="w-3.5 h-3.5 bg-[#e6ebf5] border border-[#10638e] flex items-center justify-center text-[#10638e] text-[10px] hover:bg-white"
              >X</button>
            </div>
          </div>
        </div>

        {/* Scrollable list */}
        <div
          className="bg-white border-l border-r border-[#8ca5c4]"
          style={{
            height: 320,
            overflowY: 'auto',
            padding: '10px',
            borderBottom: '1px solid #d0d8e8',
          }}
        >
          <form id="section-form">
            <AnimatePresence>
              {SECTIONS.map((sec, i) => {
                const seats = seatCounts[sec.code] ?? 78;
                const isFull = seats === 0;
                const isShaking = shakeSections.has(sec.code);
                return (
                  <motion.label
                    key={sec.code}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{
                      opacity: isFull ? 0.4 : 1,
                      y: 0,
                      x: isShaking ? [0, -3, 3, -3, 0] : 0,
                    }}
                    transition={
                      isShaking
                        ? { duration: 0.3, x: { duration: 0.3 } }
                        : { delay: i * 0.015 }
                    }
                    className={`flex items-center mb-1.5 text-xs cursor-pointer select-none ${
                      isFull ? 'pointer-events-none text-gray-400 line-through' : 'text-[#444] hover:text-black'
                    } ${selected === sec.code ? 'font-bold text-blue-700' : ''}`}
                    style={{ display: 'flex' }}
                  >
                    <input
                      type="radio"
                      name="faculty_section"
                      value={sec.code}
                      disabled={isFull || submitted}
                      checked={selected === sec.code}
                      onChange={() => setSelected(sec.code)}
                      className="mr-2 accent-blue-700"
                    />
                    {sec.code} ( Available seat -{' '}
                    <span className={seats < 10 ? 'text-red-500 font-bold' : ''}>
                      {String(seats).padStart(3, '0')}
                    </span>
                    )
                  </motion.label>
                );
              })}
            </AnimatePresence>
          </form>
        </div>

        {/* Footer */}
        <div
          className="flex flex-col items-center px-3 py-2"
          style={{
            backgroundColor: '#e6ebf5',
            borderLeft: '1px solid #8ca5c4',
            borderRight: '1px solid #8ca5c4',
            borderBottom: '1px solid #8ca5c4',
          }}
        >
          <div className="flex flex-col items-center w-full mb-1">
            <button
              type="button"
              disabled={!selected || submitted}
              onClick={handleSubmit}
              className={`flex items-center gap-1 px-4 py-1 text-xs border rounded-sm mb-1 ${
                selected && !submitted
                  ? 'bg-gradient-to-b from-white to-[#e3e3e3] border-[#a5a5a5] text-[#333] hover:from-white hover:to-[#eee] cursor-pointer'
                  : 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed'
              }`}
            >
              <span className="text-green-600 font-bold">✔</span> Submit
            </button>
            <div
              className="w-full text-center text-[10px] px-1 py-0.5 font-bold"
              style={{ backgroundColor: '#ffcc00', border: '1px solid #e6b800' }}
            >
              (Once Submitted, response can not be edited again)
            </div>
          </div>
          <div className="flex justify-end w-full pt-1" style={{ borderTop: '1px solid #d0d8e8' }}>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-0.5 text-xs cursor-pointer hover:bg-yellow-100"
              style={{ backgroundColor: '#ffeb9c', border: '1px solid #c5a450' }}
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
