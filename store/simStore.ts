import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SECTIONS } from '@/lib/sections';
import { computeGrade, Grade } from '@/lib/grading';

export interface Attempt {
  id: string;
  attemptNumber: number;
  section: string | null;
  reactionMs: number;
  seatsAtClaim: number;
  grade: Grade;
  difficulty: string;
  timestamp: number;
}

export type Difficulty = 'easy' | 'normal' | 'hard';

interface SimState {
  // identity
  studentId: string;
  studentName: string;

  // config
  difficulty: Difficulty;
  botRushEnabled: boolean;

  // runtime (not persisted)
  windowOpen: boolean;
  windowStartTime: number | null;
  seatCounts: Record<string, number>;
  selectedSection: string | null;
  claimTime: number | null;
  seatsAtClaim: number;

  // persisted history
  attempts: Attempt[];

  // actions
  setCredentials: (id: string, name: string) => void;
  setDifficulty: (d: Difficulty) => void;
  toggleBotRush: () => void;
  initSeats: () => void;
  openWindow: () => void;
  drainSeat: (section: string, amount: number) => void;
  drainAllSeats: (drainAmounts: Record<string, number>) => void;
  claimSection: (section: string) => void;
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
      botRushEnabled: true,
      windowOpen: false,
      windowStartTime: null,
      seatCounts: {},
      selectedSection: null,
      claimTime: null,
      seatsAtClaim: 0,
      attempts: [],

      setCredentials: (id, name) => set({ studentId: id, studentName: name }),

      setDifficulty: (d) => set({ difficulty: d }),

      toggleBotRush: () => set((s) => ({ botRushEnabled: !s.botRushEnabled })),

      initSeats: () => {
        const counts: Record<string, number> = {};
        SECTIONS.forEach((sec) => { counts[sec.code] = sec.seats; });
        set({ seatCounts: counts });
      },

      openWindow: () => set({ windowOpen: true, windowStartTime: Date.now() }),

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

      claimSection: (section) => {
        const { windowStartTime, seatCounts, difficulty, attempts } = get();
        const reactionMs = windowStartTime ? Date.now() - windowStartTime : 0;
        const seatsLeft = seatCounts[section] ?? 0;
        const grade = computeGrade(reactionMs, false);
        const attempt: Attempt = {
          id: Math.random().toString(36).slice(2),
          attemptNumber: attempts.length + 1,
          section,
          reactionMs,
          seatsAtClaim: seatsLeft,
          grade,
          difficulty,
          timestamp: Date.now(),
        };
        set({
          selectedSection: section,
          claimTime: reactionMs,
          seatsAtClaim: seatsLeft,
          windowOpen: false,
          attempts: [...attempts, attempt],
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
        };
        set({ windowOpen: false, attempts: [...attempts, attempt] });
      },

      resetRound: () =>
        set({
          windowOpen: false,
          windowStartTime: null,
          seatCounts: {},
          selectedSection: null,
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
        botRushEnabled: state.botRushEnabled,
      }),
    }
  )
);
