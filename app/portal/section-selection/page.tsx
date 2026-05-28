'use client';
import { useEffect, useRef, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import PortalHeader from '@/components/PortalHeader';
import PortalSidebar from '@/components/PortalSidebar';
import CountdownTimer from '@/components/CountdownTimer';
import SimulationSettingsControls from '@/components/SimulationSettingsControls';
import dynamic from 'next/dynamic';
const SectionModal = dynamic(() => import('@/components/SectionModal'), { ssr: false });
import { getWindowDuration, useSimStore } from '@/store/simStore';

const COUNTDOWN_SECONDS = 10;

export default function SectionSelectionPage() {
  const router = useRouter();
  const {
    difficulty,
    customWindowTime,
    windowOpen,
    openWindow,
    initSeats,
    selectedSection,
    resetRound,
    missedWindow,
  } = useSimStore();
  const selectionWindowSeconds = getWindowDuration(difficulty, customWindowTime);

  const [semester, setSemester] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);
  const [failedPopupVisible, setFailedPopupVisible] = useState(false);
  const missedRef = useRef(false);
  // Only true after openWindow() fires during THIS session — prevents stale
  // selectedSection from a previous round triggering a false /result redirect
  const sessionActiveRef = useRef(false);

  // Init seats when page loads
  useEffect(() => {
    resetRound();
    initSeats();
    missedRef.current = false;
    sessionActiveRef.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When window opens, show modal
  useEffect(() => {
    if (windowOpen) {
      sessionActiveRef.current = true;
      setModalVisible(true);
      missedRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [windowOpen]);

  // Watch for section claim and navigate — only acts when the window
  // genuinely opened this session (sessionActiveRef guards against stale state)
  useEffect(() => {
    if (selectedSection && sessionActiveRef.current && !missedRef.current) {
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
        <main className="flex-1 bg-[#f2f5f7] p-3 md:p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {/* Page title */}
            <div className="mb-4">
              <h2 className="text-base font-bold text-[#003366] mb-1">Subject wise Faculty / Section Selection</h2>
              <p className="text-xs text-gray-600">Select Faculty / Section for Subjects</p>
            </div>

            {!semester && (
              <div className="mb-6">
                <SimulationSettingsControls
                  description="Use the same difficulty and custom timing controls here before choosing 3rd or 5th semester."
                />
              </div>
            )}

            {/* Step 1: Semester selection */}
            {!semester && (
              <div className="bg-white border border-gray-300 rounded-sm p-6 mb-6 shadow-sm">
                <p className="text-sm font-bold text-[#003366] mb-4">Select your Semester to continue:</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  {['3rd', '5th'].map((sem) => (
                    <button
                      key={sem}
                      onClick={() => setSemester(sem)}
                      className="w-full sm:w-auto px-6 py-3 text-sm font-bold border border-[#3f688e] text-[#003366] transition rounded-sm"
                      style={{ background: 'linear-gradient(to bottom, #ffffff, #d6e4f0)' }}
                    >
                      {sem} Semester
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Countdown (after semester selected, before window opens or round ends) */}
            {semester && !windowOpen && !selectedSection && !failedPopupVisible && (
              <div className="bg-white border border-gray-300 rounded-sm p-8 mb-6 flex flex-col items-center shadow-sm">
                <p className="text-sm font-bold text-[#003366] mb-1">
                  Semester: <span className="text-[#3f688e]">{semester}</span>
                </p>
                <p className="text-xs text-gray-600 mb-1">
                  Difficulty: <span className="font-bold capitalize text-[#3f688e]">{difficulty}</span>
                  {' '}· Selection window: <span className="font-bold text-[#3f688e]">{selectionWindowSeconds}s</span>
                </p>
                <p className="text-xs text-gray-600 mb-5">Section selection window opens in:</p>
                <CountdownTimer
                  key={`countdown-${semester}`}
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
                <p>2. Your selected difficulty gives you {selectionWindowSeconds}s to submit after the window opens.</p>
                <p>3. Select your preferred section from the list and click Submit.</p>
                <p>4. Once submitted, the response cannot be edited.</p>
                <p>5. If no section is selected within the allotted time, a section will be randomly assigned.</p>
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
