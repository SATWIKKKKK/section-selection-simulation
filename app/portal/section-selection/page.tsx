'use client';
import { useEffect, useRef, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import PortalHeader from '@/components/PortalHeader';
import PortalSidebar from '@/components/PortalSidebar';
import CountdownTimer from '@/components/CountdownTimer';
import dynamic from 'next/dynamic';
const SectionModal = dynamic(() => import('@/components/SectionModal'), { ssr: false });
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
                  key={`countdown-${difficulty}`}
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
