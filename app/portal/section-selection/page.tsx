'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import CountdownTimer from '@/components/CountdownTimer';
import PortalHeader from '@/components/PortalHeader';
import PortalSidebar from '@/components/PortalSidebar';
import SimulationSettingsControls from '@/components/SimulationSettingsControls';
import type { SelectionKind } from '@/lib/sections';
import { getWindowDuration, useSimStore } from '@/store/simStore';

const SectionModal = dynamic(() => import('@/components/SectionModal'), { ssr: false });

const COUNTDOWN_SECONDS = 10;

const FIFTH_SEMESTER_ROWS: Array<{
  kind: SelectionKind;
  objectAbbr: string;
  name: string;
}> = [
  {
    kind: 'section',
    objectAbbr: 'SLOT-2_PT-1',
    name: 'Section Selection for SLOT-2_CS_PART-1',
  },
  {
    kind: 'elective1',
    objectAbbr: 'CSE-1_EL-1',
    name: 'Elective 1 Selection SLOT-2_CS_PART-1',
  },
  {
    kind: 'elective2',
    objectAbbr: 'CSE-1_EL-2',
    name: 'Elective 2 Selection SLOT-2_CS_PART-1',
  },
];

const SELECTION_LABELS: Record<SelectionKind, string> = {
  section: 'section selection',
  elective1: 'Elective 1 selection',
  elective2: 'Elective 2 selection',
};

export default function SectionSelectionPage() {
  const router = useRouter();
  const {
    difficulty,
    customWindowTime,
    windowOpen,
    openWindow,
    closeWindow,
    initSeats,
    initSelection,
    selectedSection,
    selectedElective1,
    selectedElective2,
    resetRound,
    missedWindow,
  } = useSimStore();
  const selectionWindowSeconds = getWindowDuration(difficulty, customWindowTime);

  const [semester, setSemester] = useState<string>('');
  const [activeSelection, setActiveSelection] = useState<SelectionKind | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [failedPopupVisible, setFailedPopupVisible] = useState(false);
  const missedRef = useRef(false);
  const sessionActiveRef = useRef(false);

  useEffect(() => {
    resetRound();
    initSeats();
    missedRef.current = false;
    sessionActiveRef.current = false;
  }, [initSeats, resetRound]);

  useEffect(() => {
    setModalVisible(windowOpen);
    if (windowOpen) {
      sessionActiveRef.current = true;
      missedRef.current = false;
    }
  }, [windowOpen]);

  useEffect(() => {
    const thirdSemesterComplete =
      semester === '3rd' && selectedSection && sessionActiveRef.current && !missedRef.current;
    const fifthSemesterComplete =
      semester === '5th' && selectedElective2 && sessionActiveRef.current && !missedRef.current;

    if (thirdSemesterComplete || fifthSemesterComplete) {
      router.push('/result');
    }
  }, [router, selectedElective2, selectedSection, semester]);

  const handleSemesterSelection = (selectedSemester: string) => {
    resetRound();
    initSeats();
    setActiveSelection(null);
    setFailedPopupVisible(false);
    setSemester(selectedSemester);
  };

  const handleCountdownComplete = useCallback(() => {
    setActiveSelection('section');
    initSelection('section');
    openWindow();
  }, [initSelection, openWindow]);

  const isSelectionUnlocked = (kind: SelectionKind) => {
    if (kind === 'section') return true;
    if (kind === 'elective1') return Boolean(selectedSection);
    return Boolean(selectedSection && selectedElective1);
  };

  const handleStartSelection = (kind: SelectionKind) => {
    if (semester !== '5th' || !isSelectionUnlocked(kind) || windowOpen) return;
    setActiveSelection(kind);
    initSelection(kind);
    openWindow();
  };

  const handleModalMissed = useCallback(() => {
    missedRef.current = true;
    setModalVisible(false);
    setFailedPopupVisible(true);

    if (semester === '5th') {
      closeWindow();
      return;
    }

    missedWindow();
  }, [closeWindow, missedWindow, semester]);

  const handleModalClose = () => {
    setModalVisible(false);
    closeWindow();
    setActiveSelection(null);

    if (semester === '3rd') {
      setSemester('');
      sessionActiveRef.current = false;
    }
  };

  const handlePopupOk = () => {
    setFailedPopupVisible(false);

    if (semester === '5th') {
      missedRef.current = false;
      sessionActiveRef.current = false;
      setActiveSelection(null);
      return;
    }

    router.push('/result');
  };

  const selectedValues: Record<SelectionKind, string | null> = {
    section: selectedSection,
    elective1: selectedElective1,
    elective2: selectedElective2,
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#e8eef3]" style={{ fontFamily: 'Arial, sans-serif', fontSize: 12 }}>
      <PortalHeader activePage="section-selection" />

      <div className="flex flex-1 overflow-hidden">
        <PortalSidebar activePage="/portal/section-selection" />

        <main className="flex-1 bg-[#f2f5f7] p-3 md:p-6 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <div className="mb-4">
              <h2 className="text-base font-bold text-[#003366] mb-1">Subject wise Faculty / Section Selection</h2>
              <p className="text-xs text-gray-600">Select Faculty / Section for Subjects</p>
            </div>

            {!semester && (
              <div className="mb-6">
                <SimulationSettingsControls
                  description="Choose the simulation difficulty and duration before selecting your semester. The same time limit applies to every required selection."
                />
              </div>
            )}

            {!semester && (
              <div className="bg-white border border-gray-300 rounded-sm p-6 mb-6 shadow-sm">
                <p className="text-sm font-bold text-[#003366] mb-4">Select your Semester to continue:</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  {['3rd', '5th'].map((sem) => (
                    <button
                      key={sem}
                      type="button"
                      onClick={() => handleSemesterSelection(sem)}
                      className="w-full sm:w-auto px-6 py-3 text-sm font-bold border border-[#3f688e] text-[#003366] transition rounded-sm"
                      style={{ background: 'linear-gradient(to bottom, #ffffff, #d6e4f0)' }}
                    >
                      {sem} Semester
                    </button>
                  ))}
                </div>
              </div>
            )}

            {semester === '3rd' && !windowOpen && !selectedSection && !failedPopupVisible && (
              <div className="bg-white border border-gray-300 rounded-sm p-8 mb-6 flex flex-col items-center shadow-sm">
                <p className="text-sm font-bold text-[#003366] mb-1">
                  Semester: <span className="text-[#3f688e]">3rd</span>
                </p>
                <p className="text-xs text-gray-600 mb-1">
                  Difficulty: <span className="font-bold capitalize text-[#3f688e]">{difficulty}</span>
                  {' '}· Selection window: <span className="font-bold text-[#3f688e]">{selectionWindowSeconds}s</span>
                </p>
                <p className="text-xs text-gray-600 mb-5">Section selection window opens in:</p>
                <CountdownTimer
                  key="countdown-3rd"
                  seconds={COUNTDOWN_SECONDS}
                  onComplete={handleCountdownComplete}
                />
              </div>
            )}

            {semester === '3rd' && (
              <div className="bg-white border border-gray-300 rounded-sm p-4 text-xs text-gray-700 space-y-1 shadow-sm">
                <p className="font-bold text-[#003366] mb-2" style={{ fontSize: 11 }}>Instructions:</p>
                <p>1. Wait for the countdown to finish — the section selection window will open automatically.</p>
                <p>2. Your selected difficulty gives you {selectionWindowSeconds}s to submit after the window opens.</p>
                <p>3. Select your preferred section from the list and click Submit.</p>
                <p>4. Once submitted, the response cannot be edited.</p>
                <p>5. If no section is selected within the allotted time, a section will be randomly assigned.</p>
              </div>
            )}

            {semester === '5th' && (
              <>
                <div className="bg-white border border-gray-300 rounded-sm px-4 py-3 mb-4 shadow-sm flex flex-wrap gap-x-6 gap-y-1 text-xs">
                  <span className="font-bold text-[#003366]">Semester: <span className="text-[#3f688e]">5th</span></span>
                  <span className="text-gray-600">
                    Difficulty: <span className="font-bold capitalize text-[#3f688e]">{difficulty}</span>
                  </span>
                  <span className="text-gray-600">
                    Time for each selection: <span className="font-bold text-[#3f688e]">{selectionWindowSeconds}s</span>
                  </span>
                </div>

                <div className="bg-white border border-gray-300 rounded-sm shadow-sm overflow-hidden mb-4">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[940px] text-xs border-collapse">
                      <thead>
                        <tr className="bg-[#e8edf2] text-[#003366]">
                          <th className="border border-gray-300 px-3 py-2 text-left">Object abbr.</th>
                          <th className="border border-gray-300 px-3 py-2 text-left">Name</th>
                          <th className="border border-gray-300 px-3 py-2 text-left">Acad. Year</th>
                          <th className="border border-gray-300 px-3 py-2 text-left">Acad. Session</th>
                          <th className="border border-gray-300 px-3 py-2 text-left">Status</th>
                          <th className="border border-gray-300 px-3 py-2 text-left">Section Name / Elective Name</th>
                        </tr>
                      </thead>
                      <tbody>
                        {FIFTH_SEMESTER_ROWS.map((row, index) => {
                          const selectedValue = selectedValues[row.kind];
                          const unlocked = isSelectionUnlocked(row.kind);
                          const isLocked = !unlocked && !selectedValue;

                          return (
                            <tr key={row.kind} className={index % 2 === 0 ? 'bg-white' : 'bg-[#f7f9fb]'}>
                              <td className="border border-gray-300 px-3 py-2 font-semibold whitespace-nowrap">{row.objectAbbr}</td>
                              <td className="border border-gray-300 px-3 py-2">{row.name}</td>
                              <td className="border border-gray-300 px-3 py-2 whitespace-nowrap">2026-2027</td>
                              <td className="border border-gray-300 px-3 py-2">Autumn</td>
                              <td className="border border-gray-300 px-3 py-2 whitespace-nowrap">
                                {selectedValue ? (
                                  <span className="font-bold text-green-700">Selected</span>
                                ) : (
                                  <button
                                    type="button"
                                    disabled={isLocked || windowOpen}
                                    onClick={() => handleStartSelection(row.kind)}
                                    title={isLocked ? 'Complete the previous selection first' : `Start ${SELECTION_LABELS[row.kind]}`}
                                    className={`px-3 py-1 border rounded-sm font-bold ${
                                      isLocked || windowOpen
                                        ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                                        : 'border-[#3f688e] text-[#003366] hover:bg-[#e7f0f8]'
                                    }`}
                                  >
                                    {isLocked ? 'Locked' : 'Click Here'}
                                  </button>
                                )}
                              </td>
                              <td className="border border-gray-300 px-3 py-2 font-semibold text-[#003366]">
                                {selectedValue ?? <span className="font-normal text-gray-400">—</span>}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-white border border-gray-300 rounded-sm p-4 text-xs text-gray-700 space-y-1 shadow-sm">
                  <p className="font-bold text-[#003366] mb-2" style={{ fontSize: 11 }}>Instructions:</p>
                  <p>1. Click the first available “Click Here” button to start that selection. Popups do not open automatically.</p>
                  <p>2. Each popup remains open for {selectionWindowSeconds}s, using the duration selected above.</p>
                  <p>3. Elective 1 unlocks after section selection; Elective 2 unlocks after Elective 1.</p>
                  <p>4. The result page opens only after all three selections have been submitted.</p>
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      <AnimatePresence>
        {modalVisible && windowOpen && activeSelection && (
          <SectionModal
            key={`${semester}-${activeSelection}`}
            semester={semester}
            selectionKind={activeSelection}
            onClose={handleModalClose}
            onMissed={handleModalMissed}
          />
        )}
      </AnimatePresence>

      {failedPopupVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40">
          <div
            className="bg-white border border-gray-400 shadow-xl rounded-sm max-w-sm w-full mx-4"
            style={{ fontFamily: 'Tahoma, Arial, sans-serif' }}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="selection-timeout-title"
          >
            <div
              id="selection-timeout-title"
              className="px-3 py-1.5 flex items-center gap-2 text-white text-xs font-bold"
              style={{ background: 'linear-gradient(to bottom, #10638e, #0d4d70)' }}
            >
              <span>Information</span>
            </div>
            <div className="p-5">
              <p className="text-sm text-gray-800 leading-relaxed mb-5">
                {semester === '5th'
                  ? `You did not complete ${activeSelection ? SELECTION_LABELS[activeSelection] : 'the selection'} within the allotted time. Click OK, then use Click Here to try this selection again.`
                  : 'You have failed to choose any section within allotted time. You will receive a random section allotted to your name.'}
              </p>
              <div className="flex justify-center">
                <button
                  type="button"
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
