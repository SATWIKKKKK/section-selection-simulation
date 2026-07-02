import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getSelectionOptions, SECTIONS } from '@/lib/sections';
import type { SelectionKind } from '@/lib/sections';
import { computeGrade } from '@/lib/grading';
import type { Grade } from '@/lib/grading';

export interface SelectionDetail {
  kind: SelectionKind;
  value: string;
  reactionMs: number;
  seatsAtClaim: number;
}

export interface Attempt {
  id: string;
  attemptNumber: number;
  section: string | null;
  reactionMs: number;
  seatsAtClaim: number;
  grade: Grade;
  difficulty: string;
  timestamp: number;
  semester?: '3rd' | '5th';
  elective1?: string | null;
  elective2?: string | null;
  selectionDetails?: SelectionDetail[];
}

export type Difficulty = 'easy' | 'normal' | 'hard' | 'custom';

interface SimState {
  // identity
  studentId: string;
  studentName: string;

  // config
  difficulty: Difficulty;
  customWindowTime: number;

  // runtime (not persisted)
  windowOpen: boolean;
  windowStartTime: number | null;
  seatCounts: Record<string, number>;
  selectedSection: string | null;
  selectedElective1: string | null;
  selectedElective2: string | null;
  selectionDetails: SelectionDetail[];
  claimTime: number | null;
  seatsAtClaim: number;

  // persisted history
  attempts: Attempt[];

  // actions
  setCredentials: (id: string, name: string) => void;
  setDifficulty: (d: Difficulty) => void;
  setCustomWindowTime: (time: number) => void;
  logout: () => void;
  initSeats: () => void;
  initSelection: (kind: SelectionKind) => void;
  openWindow: () => void;
  closeWindow: () => void;
  drainSeat: (section: string, amount: number) => void;
  drainAllSeats: (drainAmounts: Record<string, number>) => void;
  claimSection: (section: string, semester?: '3rd' | '5th') => void;
  claimFifthSelection: (kind: SelectionKind, value: string) => void;
  missedWindow: () => void;
  resetRound: () => void;
  clearHistory: () => void;
}

export const useSimStore = create<SimState>()(
  persist(
    (set, get) => ({
      studentId: '',
      studentName: '',
      difficulty: 'normal',
      customWindowTime: 10,
      windowOpen: false,
      windowStartTime: null,
      seatCounts: {},
      selectedSection: null,
      selectedElective1: null,
      selectedElective2: null,
      selectionDetails: [],
      claimTime: null,
      seatsAtClaim: 0,
      attempts: [],

      setCredentials: (id, name) => set({ studentId: id, studentName: name }),

      setDifficulty: (d) => set({ difficulty: d }),

      setCustomWindowTime: (time) => set({ customWindowTime: time }),

      logout: () => set({ studentId: '', studentName: '' }),

      initSeats: () => {
        const counts: Record<string, number> = {};
        SECTIONS.forEach((sec) => { counts[sec.code] = sec.seats; });
        set({ seatCounts: counts });
      },

      initSelection: (kind) => {
        const counts: Record<string, number> = {};
        getSelectionOptions(kind).forEach((option) => {
          counts[option.code] = option.seats;
        });
        set({ seatCounts: counts });
      },

      openWindow: () => set({ windowOpen: true, windowStartTime: Date.now() }),

      closeWindow: () => set({ windowOpen: false, windowStartTime: null, seatCounts: {} }),

      drainSeat: (section, amount) =>
        set((s) => {
          const current = s.seatCounts[section] ?? 0;
          return {
            seatCounts: {
              ...s.seatCounts,
              [section]: Math.max(0, current - amount),
            },
          };
        }),

      drainAllSeats: (drainAmounts) =>
        set((s) => {
          const newCounts = { ...s.seatCounts };
          for (const [section, amount] of Object.entries(drainAmounts)) {
            const current = newCounts[section] ?? 0;
            newCounts[section] = Math.max(0, current - amount);
          }
          return { seatCounts: newCounts };
        }),

      claimSection: (section, semester = '3rd') => {
        const { windowStartTime, seatCounts, difficulty, attempts } = get();
        const reactionMs = windowStartTime ? Date.now() - windowStartTime : 0;
        const seatsLeft = seatCounts[section] ?? 0;
        const grade = computeGrade(reactionMs, false);
        const detail: SelectionDetail = {
          kind: 'section',
          value: section,
          reactionMs,
          seatsAtClaim: seatsLeft,
        };
        const attempt: Attempt = {
          id: Math.random().toString(36).slice(2),
          attemptNumber: attempts.length + 1,
          section,
          reactionMs,
          seatsAtClaim: seatsLeft,
          grade,
          difficulty,
          timestamp: Date.now(),
          semester,
          elective1: null,
          elective2: null,
          selectionDetails: [detail],
        };
        set({
          selectedSection: section,
          selectionDetails: [detail],
          claimTime: reactionMs,
          seatsAtClaim: seatsLeft,
          windowOpen: false,
          attempts: [...attempts, attempt],
        });
      },

      claimFifthSelection: (kind, value) => {
        const state = get();
        const reactionMs = state.windowStartTime ? Date.now() - state.windowStartTime : 0;
        const seatsLeft = state.seatCounts[value] ?? 0;
        const detail: SelectionDetail = {
          kind,
          value,
          reactionMs,
          seatsAtClaim: seatsLeft,
        };

        if (kind === 'section') {
          set({
            selectedSection: value,
            selectionDetails: [detail],
            claimTime: reactionMs,
            seatsAtClaim: seatsLeft,
            windowOpen: false,
          });
          return;
        }

        if (kind === 'elective1') {
          if (!state.selectedSection) return;
          set({
            selectedElective1: value,
            selectionDetails: [
              ...state.selectionDetails.filter((selection) => selection.kind !== 'elective1'),
              detail,
            ],
            windowOpen: false,
          });
          return;
        }

        if (!state.selectedSection || !state.selectedElective1) return;

        const completedSelections = [
          ...state.selectionDetails.filter((selection) => selection.kind !== 'elective2'),
          detail,
        ];
        const totalReactionMs = completedSelections.reduce(
          (total, selection) => total + selection.reactionMs,
          0
        );
        const attempt: Attempt = {
          id: Math.random().toString(36).slice(2),
          attemptNumber: state.attempts.length + 1,
          section: state.selectedSection,
          elective1: state.selectedElective1,
          elective2: value,
          reactionMs: totalReactionMs,
          seatsAtClaim:
            completedSelections.find((selection) => selection.kind === 'section')?.seatsAtClaim ?? 0,
          grade: computeGrade(totalReactionMs, false),
          difficulty: state.difficulty,
          timestamp: Date.now(),
          semester: '5th',
          selectionDetails: completedSelections,
        };

        set({
          selectedElective2: value,
          selectionDetails: completedSelections,
          windowOpen: false,
          attempts: [...state.attempts, attempt],
        });
      },

      missedWindow: () => {
        const { difficulty, attempts } = get();
        const attempt: Attempt = {
          id: Math.random().toString(36).slice(2),
          attemptNumber: attempts.length + 1,
          section: null,
          reactionMs: 0,
          seatsAtClaim: 0,
          grade: 'X',
          difficulty,
          timestamp: Date.now(),
          semester: '3rd',
          elective1: null,
          elective2: null,
          selectionDetails: [],
        };
        set({ windowOpen: false, attempts: [...attempts, attempt] });
      },

      resetRound: () =>
        set({
          windowOpen: false,
          windowStartTime: null,
          seatCounts: {},
          selectedSection: null,
          selectedElective1: null,
          selectedElective2: null,
          selectionDetails: [],
          claimTime: null,
          seatsAtClaim: 0,
        }),

      clearHistory: () => set({ attempts: [] }),
    }),
    {
      name: 'kiit-sim-v1',
      partialize: (state) => ({
        attempts: state.attempts,
        difficulty: state.difficulty,
        studentId: state.studentId,
        studentName: state.studentName,
        customWindowTime: state.customWindowTime,
      }),
    }
  )
);

export function getWindowDuration(difficulty: Difficulty, customWindowTime: number): number {
  if (difficulty === 'easy') return 15;
  if (difficulty === 'normal') return 10;
  if (difficulty === 'hard') return 5;
  return Math.max(1, Math.min(30, customWindowTime || 10));
}
