export type Grade = 'S' | 'A+' | 'A' | 'B' | 'C' | 'X';

export function computeGrade(reactionMs: number, missed: boolean): Grade {
  if (missed) return 'X';
  if (reactionMs < 5000) return 'S';
  if (reactionMs < 10000) return 'A+';
  if (reactionMs < 20000) return 'A';
  if (reactionMs < 30000) return 'B';
  return 'C';
}

export const GRADE_TIPS: Record<Grade, string> = {
  S: 'Elite reflexes. You\'re ready for the real thing.',
  'A+': 'Excellent. Pre-hovering your section saves ~2s.',
  A: 'Good speed. Try hard mode to sharpen further.',
  B: 'Keep going — aim to get under 10s.',
  C: 'Practice more — try easy mode first.',
  X: 'Missed it. Focus on the countdown and pre-scroll.',
};

export const GRADE_COLOR: Record<Grade, string> = {
  S: 'text-green-600',
  'A+': 'text-green-500',
  A: 'text-blue-600',
  B: 'text-yellow-600',
  C: 'text-orange-600',
  X: 'text-red-600',
};
