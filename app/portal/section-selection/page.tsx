'use client';
import { useEffect, useRef, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import PortalHeader from '@/components/PortalHeader';
import PortalSidebar from '@/components/PortalSidebar';
import CountdownTimer from '@/components/CountdownTimer';
import SectionModal from '@/components/SectionModal';
import { useSimStore } from '@/store/simStore';

const DIFFICULTY_SECONDS: Record<string, number> = {
  easy: 60,
  normal: 30,
  hard: 20,
};

export default function SectionSelectionPage() {
  const router = useRouter();
  const {
    difficulty,
    windowOpen,
    openWindow,
    initSeats,
    selectedSection,
    resetRound,
    attempts,
  } = useSimStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [windowDuration] = useState(DIFFICULTY_SECONDS[difficulty] || 30);
  const windowTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const missedRef = useRef(false);

  // Init seats when page loads
  useEffect(() => {
    resetRound();
    initSeats();
    missedRef.current = false;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When window opens, show modal and start close timer
  useEffect(() => {
    if (windowOpen) {
      setModalVisible(true);
      missedRef.current = false;
      windowTimerRef.current = setTimeout(() => {
        if (!useSimStore.getState().selectedSection) {
          missedRef.current = true;
          useSimStore.getState().missedWindow();
          setModalVisible(false);
          router.push('/result');
        }
      }, windowDuration * 1000);
    }
    return () => {
      if (windowTimerRef.current) clearTimeout(windowTimerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [windowOpen]);

  // Watch for section claim and navigate
  useEffect(() => {
    if (selectedSection && !missedRef.current) {
      if (windowTimerRef.current) clearTimeout(windowTimerRef.current);
      setModalVisible(false);
      router.push('/result');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSection]);

  const handleCountdownComplete = useCallback(() => {
    openWindow();
  }, [openWindow]);

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const lastAttempt = attempts.length > 0 ? attempts[attempts.length - 1] : null;

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

            {/* Countdown / status card */}
            {!windowOpen && (
              <div className="bg-white border border-gray-300 rounded-lg p-8 mb-6 flex flex-col items-center shadow-sm">
                <p className="text-sm font-bold text-gray-700 mb-6">
                  Window opens in:
                </p>
                <CountdownTimer
                  key={`countdown-${difficulty}`}
                  seconds={windowDuration}
                  onComplete={handleCountdownComplete}
                />
                <div className="mt-6 flex items-center gap-2 text-xs text-blue-600 bg-blue-50 border border-blue-200 px-4 py-2 rounded">
                  <span>🎯</span>
                  <span>Practice mode: window simulated — wait for countdown</span>
                </div>
                <div className="mt-3 text-xs text-gray-500">
                  Mode: <span className="font-bold capitalize text-blue-700">{difficulty}</span>
                  {' · '}Window duration: <span className="font-bold">{windowDuration}s</span>
                </div>
              </div>
            )}

            {/* Subject table */}
            <div className="bg-white border border-gray-300 rounded-sm shadow-sm overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-[#3f688e] text-white">
                    <th className="px-3 py-2 text-left font-bold">Subject Code</th>
                    <th className="px-3 py-2 text-left font-bold">Subject Description</th>
                    <th className="px-3 py-2 text-left font-bold">Faculty</th>
                    <th className="px-3 py-2 text-left font-bold">Section</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-[#fff8dc] border-b border-gray-200">
                    <td className="px-3 py-2 font-bold text-[#003366]">CS20001</td>
                    <td className="px-3 py-2">Core Subject Section</td>
                    <td className="px-3 py-2 text-gray-500">—</td>
                    <td className="px-3 py-2">
                      {selectedSection ? (
                        <span className="text-green-700 font-bold">{selectedSection} ✓</span>
                      ) : (
                        <button
                          onClick={() => windowOpen && setModalVisible(true)}
                          disabled={!windowOpen}
                          className={`px-3 py-1 text-xs border rounded-sm transition ${
                            windowOpen
                              ? 'bg-gradient-to-b from-white to-[#e3e3e3] border-[#a5a5a5] text-[#333] hover:from-white hover:to-[#eee] cursor-pointer'
                              : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {windowOpen ? 'Select Section' : '⏳ Waiting...'}
                        </button>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Last attempt result pill */}
            {lastAttempt && (
              <div className="mt-4 flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded text-xs">
                <span className="text-blue-700 font-bold">Last attempt:</span>
                {lastAttempt.section ? (
                  <span className="text-green-700">
                    {lastAttempt.section} — {(lastAttempt.reactionMs / 1000).toFixed(2)}s — Grade: {lastAttempt.grade}
                  </span>
                ) : (
                  <span className="text-red-600">Missed</span>
                )}
              </div>
            )}

            {/* Instructions */}
            <div className="mt-6 bg-[#fff8e1] border border-yellow-300 rounded p-4 text-xs text-gray-700 space-y-1">
              <p className="font-bold text-yellow-800 mb-2">Instructions:</p>
              <p>1. Wait for the countdown to finish — the section selection window will open automatically.</p>
              <p>2. Select your preferred section from the list and click Submit.</p>
              <p>3. Once submitted, the response cannot be edited.</p>
              <p>4. Your reaction time will be graded: S (&lt;5s) · A+ (&lt;10s) · A (&lt;20s) · B (&lt;30s) · C (30s+)</p>
            </div>
          </div>
        </main>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalVisible && windowOpen && (
          <SectionModal onClose={handleModalClose} />
        )}
      </AnimatePresence>
    </div>
  );
}
