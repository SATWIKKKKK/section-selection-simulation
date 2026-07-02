'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import CountdownTimer from '@/components/CountdownTimer';
import OpeningCountdown from '@/components/OpeningCountdown';
import PortalHeader from '@/components/PortalHeader';
import PortalSidebar from '@/components/PortalSidebar';
import SimulationSettingsControls from '@/components/SimulationSettingsControls';
import type { SelectionKind } from '@/lib/sections';
import { getWindowDuration, useSimStore } from '@/store/simStore';
import type { SelectionDetail } from '@/store/simStore';

const SectionModal = dynamic(() => import('@/components/SectionModal'), { ssr: false });

const COUNTDOWN_SECONDS = 10;
const OPENING_WAIT_STORAGE_KEY = 'kiit-opening-wait-v1';
const WAIT_MINUTE_OPTIONS = [1, 2, 5] as const;

type OpeningMode = 'instant' | 'wait' | null;

interface StoredOpeningWait {
  opensAt: number;
  durationMs: number;
  waitMinutes: number;
}

function clearStoredOpeningWait() {
  if (typeof window !== 'undefined') {
    window.sessionStorage.removeItem(OPENING_WAIT_STORAGE_KEY);
  }
}

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
    selectedElective1Section,
    selectedElective2Section,
    selectionDetails,
    randomlyAllotFifthSelection,
    resetRound,
    missedWindow,
  } = useSimStore();
  const selectionWindowSeconds = getWindowDuration(difficulty, customWindowTime);

  const [semester, setSemester] = useState<string>('');
  const [activeSelection, setActiveSelection] = useState<SelectionKind | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [failedPopupVisible, setFailedPopupVisible] = useState(false);
  const [timeoutAllotment, setTimeoutAllotment] = useState<SelectionDetail | null>(null);
  const [openingMode, setOpeningMode] = useState<OpeningMode>(null);
  const [waitMinutes, setWaitMinutes] = useState(1);
  const [customWaitSelected, setCustomWaitSelected] = useState(false);
  const [waitStarted, setWaitStarted] = useState(false);
  const [waitReady, setWaitReady] = useState(false);
  const [opensAt, setOpensAt] = useState<number | null>(null);
  const [waitDurationMs, setWaitDurationMs] = useState(0);
  const [clockNow, setClockNow] = useState(0);
  const [panelRefreshing, setPanelRefreshing] = useState(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<number | null>(null);
  const missedRef = useRef(false);
  const sessionActiveRef = useRef(false);
  const panelReloadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selectionAccessOpen = semester === '5th' && (
    openingMode === 'instant' ||
    (openingMode === 'wait' && waitStarted && waitReady)
  );
  const waitRemainingMs = opensAt ? Math.max(0, opensAt - clockNow) : 0;

  useEffect(() => {
    resetRound();
    initSeats();
    missedRef.current = false;
    sessionActiveRef.current = false;
  }, [initSeats, resetRound]);

  useEffect(() => {
    const restoreTimer = setTimeout(() => {
      const storedWait = window.sessionStorage.getItem(OPENING_WAIT_STORAGE_KEY);
      if (!storedWait) return;

      try {
        const parsed = JSON.parse(storedWait) as StoredOpeningWait;
        if (
          !Number.isFinite(parsed.opensAt) ||
          !Number.isFinite(parsed.durationMs) ||
          !Number.isFinite(parsed.waitMinutes)
        ) {
          clearStoredOpeningWait();
          return;
        }

        const now = Date.now();
        setSemester('5th');
        setOpeningMode('wait');
        setWaitMinutes(parsed.waitMinutes);
        setCustomWaitSelected(!WAIT_MINUTE_OPTIONS.includes(parsed.waitMinutes as 1 | 2 | 5));
        setWaitStarted(true);
        setOpensAt(parsed.opensAt);
        setWaitDurationMs(parsed.durationMs);
        setClockNow(now);
        setLastRefreshedAt(now);
        setWaitReady(now >= parsed.opensAt);

        if (now >= parsed.opensAt) {
          clearStoredOpeningWait();
        }
      } catch {
        clearStoredOpeningWait();
      }
    }, 0);

    return () => clearTimeout(restoreTimer);
  }, []);

  useEffect(() => {
    if (openingMode !== 'wait' || !waitStarted || waitReady || !opensAt) return;

    const syncClock = () => {
      const now = Date.now();
      setClockNow(now);
      if (now >= opensAt) {
        setWaitReady(true);
        setPanelRefreshing(false);
        clearStoredOpeningWait();
      }
    };

    syncClock();
    const interval = setInterval(syncClock, 250);
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') syncClock();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [openingMode, opensAt, waitReady, waitStarted]);

  useEffect(() => () => {
    if (panelReloadTimerRef.current) clearTimeout(panelReloadTimerRef.current);
  }, []);

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
    clearStoredOpeningWait();
    resetRound();
    initSeats();
    setActiveSelection(null);
    setFailedPopupVisible(false);
    setTimeoutAllotment(null);
    setOpeningMode(null);
    setWaitMinutes(1);
    setCustomWaitSelected(false);
    setWaitStarted(false);
    setWaitReady(false);
    setOpensAt(null);
    setWaitDurationMs(0);
    setPanelRefreshing(false);
    setLastRefreshedAt(null);
    setSemester(selectedSemester);
  };

  const handleOpeningModeSelection = (mode: Exclude<OpeningMode, null>) => {
    clearStoredOpeningWait();
    setOpeningMode(mode);
    setWaitStarted(false);
    setWaitReady(false);
    setOpensAt(null);
    setWaitDurationMs(0);
    setClockNow(Date.now());
    setPanelRefreshing(false);
    setLastRefreshedAt(null);
  };

  const handleStartOpeningWait = () => {
    const normalizedMinutes = Math.max(1, Math.min(30, waitMinutes || 1));
    const durationMs = normalizedMinutes * 60 * 1000;
    const now = Date.now();
    const target = now + durationMs;
    const storedWait: StoredOpeningWait = {
      opensAt: target,
      durationMs,
      waitMinutes: normalizedMinutes,
    };

    window.sessionStorage.setItem(OPENING_WAIT_STORAGE_KEY, JSON.stringify(storedWait));
    setWaitMinutes(normalizedMinutes);
    setWaitDurationMs(durationMs);
    setOpensAt(target);
    setClockNow(now);
    setLastRefreshedAt(now);
    setWaitReady(false);
    setWaitStarted(true);
  };

  const handlePanelReload = () => {
    if (openingMode !== 'wait' || !waitStarted || waitReady || panelRefreshing) return;

    setPanelRefreshing(true);
    if (panelReloadTimerRef.current) clearTimeout(panelReloadTimerRef.current);
    panelReloadTimerRef.current = setTimeout(() => {
      const now = Date.now();
      setClockNow(now);
      setLastRefreshedAt(now);
      setPanelRefreshing(false);
    }, 450);
  };

  const handleCancelOpeningWait = () => {
    clearStoredOpeningWait();
    if (panelReloadTimerRef.current) clearTimeout(panelReloadTimerRef.current);
    setOpeningMode(null);
    setWaitStarted(false);
    setWaitReady(false);
    setOpensAt(null);
    setWaitDurationMs(0);
    setPanelRefreshing(false);
    setLastRefreshedAt(null);
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
    if (
      semester !== '5th' ||
      !selectionAccessOpen ||
      !isSelectionUnlocked(kind) ||
      windowOpen
    ) return;
    setActiveSelection(kind);
    initSelection(kind);
    openWindow();
  };

  const handleModalMissed = useCallback(() => {
    missedRef.current = true;
    setModalVisible(false);
    setFailedPopupVisible(true);

    if (semester === '5th') {
      if (activeSelection) {
        setTimeoutAllotment(randomlyAllotFifthSelection(activeSelection));
      }
      closeWindow();
      return;
    }

    missedWindow();
  }, [activeSelection, closeWindow, missedWindow, randomlyAllotFifthSelection, semester]);

  const handleModalClose = () => {
    if (semester === '5th') {
      handleModalMissed();
      return;
    }

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
      const completedSelection = activeSelection;
      missedRef.current = false;
      sessionActiveRef.current = false;
      setActiveSelection(null);
      setTimeoutAllotment(null);

      if (completedSelection === 'elective2' && selectedElective2) {
        router.push('/result');
      }
      return;
    }

    router.push('/result');
  };

  const selectedValues: Record<SelectionKind, string | null> = {
    section: selectedSection,
    elective1: selectedElective1
      ? `${selectedElective1}${selectedElective1Section ? ` — ${selectedElective1Section}` : ''}`
      : null,
    elective2: selectedElective2
      ? `${selectedElective2}${selectedElective2Section ? ` — ${selectedElective2Section}` : ''}`
      : null,
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

                {!openingMode && (
                  <div className="bg-white border border-gray-300 rounded-sm p-5 mb-4 shadow-sm">
                    <h3 className="text-sm font-bold text-[#003366] mb-1">Choose how the selection portal should open</h3>
                    <p className="text-xs text-gray-600 mb-4">
                      Instant mode keeps the current flow. Opening Wait Simulation lets you practise refreshing before a user-defined opening time.
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => handleOpeningModeSelection('instant')}
                        className="border border-[#3f688e] rounded-sm p-4 text-left hover:bg-[#edf4fa] transition"
                      >
                        <span className="block text-sm font-bold text-[#003366]">Instant Mode</span>
                        <span className="block text-xs text-gray-600 mt-1">Show the first Click Here button immediately.</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpeningModeSelection('wait')}
                        className="border border-[#3f688e] rounded-sm p-4 text-left hover:bg-[#edf4fa] transition"
                      >
                        <span className="block text-sm font-bold text-[#003366]">Opening Wait Simulation</span>
                        <span className="block text-xs text-gray-600 mt-1">Choose a delay, watch the countdown, and practise panel reloads.</span>
                      </button>
                    </div>
                  </div>
                )}

                {openingMode === 'wait' && !waitStarted && (
                  <div className="bg-white border border-gray-300 rounded-sm p-5 mb-4 shadow-sm">
                    <h3 className="text-sm font-bold text-[#003366] mb-1">Set the opening delay</h3>
                    <p className="text-xs text-gray-600 mb-4">
                      The delay starts when you click Start Waiting. It is independent of the timed selection windows.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {WAIT_MINUTE_OPTIONS.map((minutes) => (
                        <button
                          key={minutes}
                          type="button"
                          aria-pressed={!customWaitSelected && waitMinutes === minutes}
                          onClick={() => {
                            setCustomWaitSelected(false);
                            setWaitMinutes(minutes);
                          }}
                          className={`px-4 py-2 text-xs font-bold border rounded-sm ${
                            !customWaitSelected && waitMinutes === minutes
                              ? 'border-[#003366] bg-[#dceaf5] text-[#003366]'
                              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {minutes} {minutes === 1 ? 'minute' : 'minutes'}
                        </button>
                      ))}
                      <button
                        type="button"
                        aria-pressed={customWaitSelected}
                        onClick={() => setCustomWaitSelected(true)}
                        className={`px-4 py-2 text-xs font-bold border rounded-sm ${
                          customWaitSelected
                            ? 'border-[#003366] bg-[#dceaf5] text-[#003366]'
                            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        Custom
                      </button>
                    </div>

                    {customWaitSelected && (
                      <label className="block max-w-xs text-xs font-bold text-[#003366] mb-4">
                        Custom delay (1–30 minutes)
                        <input
                          type="number"
                          min={1}
                          max={30}
                          value={waitMinutes}
                          onChange={(event) => setWaitMinutes(Number(event.target.value) || 1)}
                          className="mt-1 block w-full border border-gray-300 px-3 py-2 text-xs font-normal text-gray-800"
                        />
                      </label>
                    )}

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={handleStartOpeningWait}
                        className="px-5 py-2 text-xs font-bold text-white bg-[#3f688e] border border-[#2f5475] rounded-sm hover:bg-[#345b7d]"
                      >
                        Start Waiting
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelOpeningWait}
                        className="px-5 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50"
                      >
                        Back to Opening Modes
                      </button>
                    </div>
                  </div>
                )}

                {openingMode === 'instant' && !selectedSection && (
                  <div className="flex items-center justify-between gap-3 bg-[#eef7ee] border border-green-300 rounded-sm px-4 py-3 mb-4 text-xs">
                    <span className="font-bold text-green-800">Instant Mode — selection is open now.</span>
                    <button
                      type="button"
                      onClick={handleCancelOpeningWait}
                      className="font-bold text-[#003366] underline"
                    >
                      Change mode
                    </button>
                  </div>
                )}

                {panelRefreshing ? (
                  <div
                    data-testid="selection-panel-skeleton"
                    role="status"
                    aria-label="Reloading selection panel"
                    className="bg-white border border-gray-300 rounded-sm p-5 mb-4 shadow-sm animate-pulse"
                  >
                    <div className="h-4 w-48 bg-gray-200 rounded mb-4" />
                    <div className="h-12 w-56 bg-gray-200 rounded mx-auto mb-5" />
                    <div className="space-y-2">
                      <div className="h-9 bg-gray-200 rounded" />
                      <div className="h-9 bg-gray-100 rounded" />
                      <div className="h-9 bg-gray-200 rounded" />
                    </div>
                    <span className="sr-only">Reloading selection panel…</span>
                  </div>
                ) : (
                  <>
                    {openingMode === 'wait' && waitStarted && opensAt && !waitReady && (
                      <div className="bg-white border border-gray-300 rounded-sm p-6 mb-4 shadow-sm">
                        <OpeningCountdown
                          remainingMs={waitRemainingMs}
                          totalDurationMs={waitDurationMs}
                          opensAt={opensAt}
                        />
                        <div className="mt-5 flex flex-wrap justify-center gap-2">
                          <button
                            type="button"
                            onClick={handlePanelReload}
                            className="px-5 py-2 text-xs font-bold text-[#003366] bg-[#eef4f8] border border-[#3f688e] rounded-sm hover:bg-[#e0ebf3]"
                          >
                            Reload Selection Panel
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelOpeningWait}
                            className="px-5 py-2 text-xs font-bold text-red-700 bg-white border border-red-300 rounded-sm hover:bg-red-50"
                          >
                            Cancel Waiting
                          </button>
                        </div>
                        {lastRefreshedAt && (
                          <p className="mt-3 text-center text-[11px] text-gray-500">
                            Panel last refreshed at {new Date(lastRefreshedAt).toLocaleTimeString()}
                          </p>
                        )}
                      </div>
                    )}

                    {openingMode === 'wait' && waitStarted && waitReady && (
                      <div className="bg-[#eef7ee] border border-green-300 rounded-sm px-4 py-3 mb-4 text-xs font-bold text-green-800">
                        Selection is open. Click Here when you are ready; no popup will open automatically.
                      </div>
                    )}

                    {(openingMode === 'instant' || (openingMode === 'wait' && waitStarted)) && (
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
                                const selectionDetail = selectionDetails.find(
                                  (selection) => selection.kind === row.kind
                                );
                                const unlocked = isSelectionUnlocked(row.kind);
                                const isLocked = !unlocked && !selectedValue;

                                return (
                                  <tr key={row.kind} className={index % 2 === 0 ? 'bg-white' : 'bg-[#f7f9fb]'}>
                                    <td className="border border-gray-300 px-3 py-2 font-semibold whitespace-nowrap">{row.objectAbbr}</td>
                                    <td className="border border-gray-300 px-3 py-2">{row.name}</td>
                                    <td className="border border-gray-300 px-3 py-2 whitespace-nowrap">2026-2027</td>
                                    <td className="border border-gray-300 px-3 py-2">Autumn</td>
                                    <td className="border border-gray-300 px-3 py-2 whitespace-nowrap">
                                      {!selectionAccessOpen ? (
                                        <span className="font-bold text-gray-500">Not Open Yet</span>
                                      ) : selectedValue ? (
                                        <span className={`font-bold ${
                                          selectionDetail?.randomlyAllotted ? 'text-amber-700' : 'text-green-700'
                                        }`}>
                                          {selectionDetail?.randomlyAllotted ? 'Randomly Allotted' : 'Selected'}
                                        </span>
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
                    )}
                  </>
                )}

                <div className="bg-white border border-gray-300 rounded-sm p-4 text-xs text-gray-700 space-y-1 shadow-sm">
                  <p className="font-bold text-[#003366] mb-2" style={{ fontSize: 11 }}>Instructions:</p>
                  <p>1. Choose Instant Mode or the optional Opening Wait Simulation.</p>
                  <p>2. Waiting-mode panel reloads preserve the absolute opening time; Click Here remains hidden until the countdown ends.</p>
                  <p>3. Click the first available “Click Here” button to start that selection. Popups do not open automatically.</p>
                  <p>4. Each popup remains open for {selectionWindowSeconds}s, using the duration selected above.</p>
                  <p>5. For electives, select the full subject first, then choose its abbreviated numbered section before Submit becomes available.</p>
                  <p>6. Submit confirms your choice. Closing or missing the timer causes an immediate, final random allotment with no retry.</p>
                  <p>7. Each completed row unlocks the next; results open after all three rows are complete.</p>
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
              <span>{semester === '5th' ? 'Allotment Result' : 'Information'}</span>
            </div>
            <div className="p-5">
              <p className="text-sm text-gray-800 leading-relaxed mb-5">
                {semester === '5th'
                  ? `You were unable to select your desired ${activeSelection === 'section' ? 'section' : 'elective'} within the allotted time. Your ${activeSelection === 'section' ? 'section' : 'elective'} has been randomly allotted as ${timeoutAllotment ? `${timeoutAllotment.value}${timeoutAllotment.numberedSection ? ` — ${timeoutAllotment.numberedSection}` : ''}` : 'an available choice'}. This allotment is final; please continue to the next selection.`
                  : 'You have failed to choose any section within allotted time. You will receive a random section allotted to your name.'}
              </p>
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={handlePopupOk}
                  className="px-6 py-1 text-sm font-bold border border-[#aaa] transition rounded-sm"
                  style={{ background: 'linear-gradient(to bottom, #ffffff, #e0e0e0)' }}
                >
                  {semester === '5th' ? 'Continue' : 'OK'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
