const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');

// ============================================================
// app/portal/section-selection/page.tsx
// ============================================================
const sectionSelectionPage = `'use client';
import { useEffect, useRef, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import PortalHeader from '@/components/PortalHeader';
import PortalSidebar from '@/components/PortalSidebar';
import CountdownTimer from '@/components/CountdownTimer';
import SectionModal from '@/components/SectionModal';
import { useSimStore } from '@/store/simStore';

const COUNTDOWN_SECONDS = 10;

export default function SectionSelectionPage() {
  const router = useRouter();
  const {
    difficulty,
    windowOpen,
    openWindow,
    initSeats,
    selectedSection,
    resetRound,
    missedWindow,
  } = useSimStore();

  const [semester, setSemester] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);
  const [failedPopupVisible, setFailedPopupVisible] = useState(false);
  const missedRef = useRef(false);

  // Init seats when page loads
  useEffect(() => {
    resetRound();
    initSeats();
    missedRef.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When window opens, show modal
  useEffect(() => {
    if (windowOpen) {
      setModalVisible(true);
      missedRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [windowOpen]);

  // Watch for section claim and navigate
  useEffect(() => {
    if (selectedSection && !missedRef.current) {
      setModalVisible(false);
      router.push('/result');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSection]);

  const handleCountdownComplete = useCallback(() => {
    openWindow();
  }, [openWindow]);

  const handleModalMissed = useCallback(() => {
    missedRef.current = true;
    missedWindow();
    setModalVisible(false);
    setFailedPopupVisible(true);
  }, [missedWindow]);

  const handlePopupOk = () => {
    setFailedPopupVisible(false);
    router.push('/result');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#e8eef3]" style={{ fontFamily: 'Arial, sans-serif', fontSize: 12 }}>
      <PortalHeader activePage="section-selection" />

      <div className="flex flex-1 overflow-hidden">
        <PortalSidebar activePage="/portal/section-selection" />

        {/* Main content */}
        <main className="flex-1 bg-[#f2f5f7] p-6 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            {/* Page title */}
            <div className="mb-4">
              <h2 className="text-base font-bold text-[#003366] mb-1">Subject wise Faculty / Section Selection</h2>
              <p className="text-xs text-gray-600">Select Faculty / Section for Subjects</p>
            </div>

            {/* Step 1: Semester selection */}
            {!semester && (
              <div className="bg-white border border-gray-300 rounded-sm p-6 mb-6 shadow-sm">
                <p className="text-sm font-bold text-[#003366] mb-4">Select your Semester to continue:</p>
                <div className="flex gap-4">
                  {['3rd', '5th'].map((sem) => (
                    <button
                      key={sem}
                      onClick={() => setSemester(sem)}
                      className="px-6 py-2 text-sm font-bold border border-[#3f688e] text-[#003366] transition rounded-sm"
                      style={{ background: 'linear-gradient(to bottom, #ffffff, #d6e4f0)' }}
                    >
                      {sem} Semester
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Countdown (after semester selected) */}
            {semester && !windowOpen && (
              <div className="bg-white border border-gray-300 rounded-sm p-8 mb-6 flex flex-col items-center shadow-sm">
                <p className="text-sm font-bold text-[#003366] mb-1">
                  Semester: <span className="text-[#3f688e]">{semester}</span>
                </p>
                <p className="text-xs text-gray-600 mb-5">Section selection window opens in:</p>
                <CountdownTimer
                  key={\`countdown-\${difficulty}\`}
                  seconds={COUNTDOWN_SECONDS}
                  onComplete={handleCountdownComplete}
                />
              </div>
            )}

            {/* Instructions */}
            {semester && (
              <div className="bg-white border border-gray-300 rounded-sm p-4 text-xs text-gray-700 space-y-1 shadow-sm">
                <p className="font-bold text-[#003366] mb-2" style={{ fontSize: 11 }}>Instructions:</p>
                <p>1. Wait for the countdown to finish — the section selection window will open automatically.</p>
                <p>2. Select your preferred section from the list and click Submit.</p>
                <p>3. Once submitted, the response cannot be edited.</p>
                <p>4. If no section is selected within the allotted time, a section will be randomly assigned.</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Section Modal */}
      <AnimatePresence>
        {modalVisible && windowOpen && (
          <SectionModal semester={semester} onClose={() => setModalVisible(false)} onMissed={handleModalMissed} />
        )}
      </AnimatePresence>

      {/* Failure popup overlay */}
      {failedPopupVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40">
          <div
            className="bg-white border border-gray-400 shadow-xl rounded-sm max-w-sm w-full mx-4"
            style={{ fontFamily: 'Tahoma, Arial, sans-serif' }}
          >
            {/* Popup header */}
            <div
              className="px-3 py-1.5 flex items-center gap-2 text-white text-xs font-bold"
              style={{ background: 'linear-gradient(to bottom, #10638e, #0d4d70)' }}
            >
              <span>Information</span>
            </div>
            {/* Popup body */}
            <div className="p-5">
              <p className="text-sm text-gray-800 leading-relaxed mb-5">
                You have failed to choose any section within allotted time. You will receive a random section allotted to your name.
              </p>
              <div className="flex justify-center">
                <button
                  onClick={handlePopupOk}
                  className="px-6 py-1 text-sm font-bold border border-[#aaa] transition rounded-sm"
                  style={{ background: 'linear-gradient(to bottom, #ffffff, #e0e0e0)' }}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
`;
fs.writeFileSync(path.join(root, 'app', 'portal', 'section-selection', 'page.tsx'), sectionSelectionPage);
console.log('✓ app/portal/section-selection/page.tsx');

// ============================================================
// components/SectionModal.tsx
// ============================================================
const sectionModal = `'use client';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useSimStore } from '@/store/simStore';
import { SECTIONS } from '@/lib/sections';
import ReactionTimer from './ReactionTimer';

const MODAL_DURATION_SECONDS = 10;

interface SectionModalProps {
  semester?: string;
  onClose: () => void;
  onMissed: () => void;
}

export default function SectionModal({ semester, onClose, onMissed }: SectionModalProps) {
  const { seatCounts, claimSection, windowOpen, windowStartTime, drainSeat } = useSimStore();
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const drainRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const modalTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const drainRates = useRef<Record<string, number>>({});

  // Assign each section a random drain rate once
  useEffect(() => {
    SECTIONS.forEach((sec) => {
      // Rates between 6 and 15 seats/sec — ensures most sections drain within 10s
      drainRates.current[sec.code] = Math.floor(Math.random() * 10) + 6;
    });
  }, []);

  // Bot drain logic — drain ALL sections each second
  useEffect(() => {
    if (!windowOpen) return;

    drainRef.current = setInterval(() => {
      const store = useSimStore.getState();
      if (store.selectedSection) {
        clearInterval(drainRef.current!);
        return;
      }
      SECTIONS.forEach((sec) => {
        const current = store.seatCounts[sec.code] ?? 0;
        if (current > 0) {
          drainSeat(sec.code, drainRates.current[sec.code] ?? 8);
        }
      });
    }, 1000);

    // 10-second hard timer — force all to 0 and trigger missed callback
    modalTimerRef.current = setTimeout(() => {
      clearInterval(drainRef.current!);
      // Force all seats to 0
      SECTIONS.forEach((sec) => {
        drainSeat(sec.code, 999);
      });
      // Small delay so UI shows all-zero before popup
      setTimeout(() => {
        if (!useSimStore.getState().selectedSection) {
          onMissed();
        }
      }, 300);
    }, MODAL_DURATION_SECONDS * 1000);

    return () => {
      if (drainRef.current) clearInterval(drainRef.current);
      if (modalTimerRef.current) clearTimeout(modalTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [windowOpen]);

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
          <span>Select Faculty / Section{semester ? \` — \${semester} Semester\` : ''}</span>
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
                  className={\`flex items-center mb-1.5 text-xs cursor-pointer select-none \${
                    isFull ? 'pointer-events-none text-gray-400 line-through' : 'text-[#444] hover:text-black'
                  } \${selected === sec.code ? 'font-bold text-blue-700' : ''}\`}
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
              className={\`flex items-center gap-1 px-4 py-1 text-xs border rounded-sm mb-1 \${
                selected && !submitted
                  ? 'bg-gradient-to-b from-white to-[#e3e3e3] border-[#a5a5a5] text-[#333] hover:from-white hover:to-[#eee] cursor-pointer'
                  : 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed'
              }\`}
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
`;
fs.writeFileSync(path.join(root, 'components', 'SectionModal.tsx'), sectionModal);
console.log('✓ components/SectionModal.tsx');

console.log('\nComplex section files done. Run update-result.js for result page.');
