'use client';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useSimStore, getWindowDuration } from '@/store/simStore';
import { SECTIONS } from '@/lib/sections';
import ReactionTimer from './ReactionTimer';

interface SectionModalProps {
  semester?: string;
  onClose: () => void;
  onMissed: () => void;
}

export default function SectionModal({ semester, onClose, onMissed }: SectionModalProps) {
  const { seatCounts, claimSection, windowOpen, windowStartTime, difficulty, customWindowTime } = useSimStore();
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const drainRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const modalTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const drainRates = useRef<Record<string, number>>({});

  const windowDuration = getWindowDuration(difficulty, customWindowTime);

  // Assign each section a drain rate based on windowDuration
  useEffect(() => {
    // Want seats to drain 1.5 to 2.5 seconds before window closes
    const drainTime = Math.max(1, windowDuration - 2);
    SECTIONS.forEach((sec) => {
      const seats = sec.seats || 78;
      // Add slight randomness to rates
      drainRates.current[sec.code] = Math.max(1, Math.ceil((seats / drainTime) * (0.8 + Math.random() * 0.4)));
    });
  }, [windowDuration]);

  // Bot drain logic — drain ALL sections each second
  useEffect(() => {
    if (!windowOpen) return;

    drainRef.current = setInterval(() => {
      const store = useSimStore.getState();
      if (store.selectedSection) {
        clearInterval(drainRef.current!);
        return;
      }
      const drainAmounts: Record<string, number> = {};
      SECTIONS.forEach((sec) => {
        const current = store.seatCounts[sec.code] ?? 0;
        if (current > 0) {
          drainAmounts[sec.code] = drainRates.current[sec.code] ?? 8;
        }
      });
      if (Object.keys(drainAmounts).length > 0) {
        useSimStore.getState().drainAllSeats(drainAmounts);
      }
    }, 1000);

    // Hard timer — force all to 0 and trigger missed callback
    modalTimerRef.current = setTimeout(() => {
      clearInterval(drainRef.current!);
      // Force all seats to 0
      const drainAmounts: Record<string, number> = {};
      SECTIONS.forEach((sec) => {
        drainAmounts[sec.code] = 999;
      });
      useSimStore.getState().drainAllSeats(drainAmounts);
      // Small delay so UI shows all-zero before popup
      setTimeout(() => {
        if (!useSimStore.getState().selectedSection) {
          onMissed();
        }
      }, 300);
    }, windowDuration * 1000);

    return () => {
      if (drainRef.current) clearInterval(drainRef.current);
      if (modalTimerRef.current) clearTimeout(modalTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [windowOpen, windowDuration]);

  const handleSubmit = () => {
    if (!selected || submitted) return;
    setSubmitted(true);
    clearInterval(drainRef.current!);
    clearTimeout(modalTimerRef.current!);
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
          <span>Select Faculty / Section{semester ? ` — ${semester} Semester` : ''}</span>
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
            {SECTIONS.map((sec) => {
              const seats = seatCounts[sec.code] ?? 78;
              const isFull = seats === 0;
              if (isFull) return null; // hide sections with 0 seats
              return (
                <label
                  key={sec.code}
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
                </label>
              );
            })}
            {SECTIONS.every((sec) => (seatCounts[sec.code] ?? 0) === 0) && (
              <p className="text-xs text-gray-500 text-center py-4">All sections are full.</p>
            )}
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
              <span className="text-green-600 font-bold">&#x2714;</span> Submit
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
