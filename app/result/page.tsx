'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSimStore } from '@/store/simStore';
import { GRADE_TIPS, GRADE_COLOR } from '@/lib/grading';
import ResultChart from '@/components/ResultChart';
import AttemptHistoryTable from '@/components/AttemptHistoryTable';

function StatPill({ value, label, color = 'text-gray-800' }: { value: string; label: string; color?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm"
    >
      <div className={`text-2xl font-extrabold font-mono ${color}`}>{value}</div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </motion.div>
  );
}

export default function ResultPage() {
  const router = useRouter();
  const { attempts, resetRound, clearHistory } = useSimStore();

  const latest = attempts.length > 0 ? attempts[attempts.length - 1] : null;

  useEffect(() => {
    if (!latest) {
      router.replace('/portal/section-selection');
    }
  }, [latest, router]);

  if (!latest) return null;

  const missed = latest.section === null;
  const reactionSec = missed ? 0 : latest.reactionMs / 1000;
  const grade = latest.grade;

  // Personal best
  const completed = attempts.filter((a) => a.section !== null);
  const best = completed.length ? Math.min(...completed.map((a) => a.reactionMs / 1000)) : null;
  const prevCompleted = completed.filter((a) => a.id !== latest.id);
  const prevBest = prevCompleted.length ? Math.min(...prevCompleted.map((a) => a.reactionMs / 1000)) : null;

  const avgSec = completed.length
    ? completed.reduce((s, a) => s + a.reactionMs / 1000, 0) / completed.length
    : null;

  const isNewBest = !missed && best !== null && Math.abs(best - reactionSec) < 0.01;
  const delta = !missed && prevBest !== null ? reactionSec - prevBest : null;

  const handleTryAgain = () => {
    resetRound();
    router.push('/portal/section-selection');
  };

  const handleClearHistory = () => {
    if (confirm('Clear all attempt history? This cannot be undone.')) {
      clearHistory();
      router.push('/portal/section-selection');
    }
  };

  return (
    <div
      className="min-h-screen bg-[#f0f4f8] p-4 md:p-8"
      style={{ fontFamily: 'Arial, sans-serif' }}
    >
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header card */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl p-6 shadow-md text-white ${missed ? 'bg-red-600' : 'bg-green-600'}`}
        >
          <div className="flex items-center gap-4">
            <span className="text-5xl">{missed ? '❌' : '🏆'}</span>
            <div>
              <h1 className="text-xl font-extrabold">
                {missed ? 'Window closed — no section selected' : `Section secured — ${latest.section}`}
              </h1>
              <p className="text-sm opacity-80 mt-1">
                Attempt #{latest.attemptNumber} · <span className="capitalize">{latest.difficulty}</span> mode
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stat pills */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          variants={{ show: { transition: { staggerChildren: 0.08 } } }}
          initial="hidden"
          animate="show"
        >
          <StatPill
            value={missed ? '—' : reactionSec.toFixed(2) + 's'}
            label="Reaction time"
            color={missed ? 'text-gray-400' : reactionSec < 10 ? 'text-green-600' : reactionSec < 20 ? 'text-amber-600' : 'text-red-600'}
          />
          <StatPill
            value={grade}
            label="Speed grade"
            color={GRADE_COLOR[grade]}
          />
          <StatPill
            value={missed ? '0' : String(latest.seatsAtClaim)}
            label="Seats left when claimed"
            color="text-blue-700"
          />
        </motion.div>

        {/* Delta */}
        {delta !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-sm font-semibold text-center px-4 py-2 rounded-lg ${delta < 0 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}
          >
            {delta < 0
              ? `−${Math.abs(delta).toFixed(2)}s — new personal best! 🎉`
              : `+${delta.toFixed(2)}s slower than your best`}
          </motion.div>
        )}
        {isNewBest && delta === null && (
          <div className="text-sm font-semibold text-center px-4 py-2 rounded-lg bg-green-100 text-green-700">
            🏅 First completed attempt — personal best set!
          </div>
        )}

        {/* Chart */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="text-sm font-bold text-gray-700 mb-3">Reaction Time History</h3>
          <ResultChart attempts={attempts} />
          {attempts.length < 2 && (
            <p className="text-xs text-gray-400 text-center py-4">Complete at least 2 attempts to see the chart.</p>
          )}
        </div>

        {/* Tip */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-sm font-bold text-amber-800 mb-1">💡 Tip</p>
          <p className="text-sm text-amber-700">{GRADE_TIPS[grade]}</p>
        </div>

        {/* History table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-700">Session History</h3>
          </div>
          <AttemptHistoryTable attempts={attempts} />
        </div>

        {/* Summary footer */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-3 text-center shadow-sm">
            <div className="text-xl font-bold text-gray-800">{attempts.length}</div>
            <div className="text-xs text-gray-500">Total attempts</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-3 text-center shadow-sm">
            <div className="text-xl font-bold text-green-600">
              {best !== null ? best.toFixed(2) + 's' : '—'}
            </div>
            <div className="text-xs text-gray-500">Personal best</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-3 text-center shadow-sm">
            <div className="text-xl font-bold text-blue-600">
              {avgSec !== null ? avgSec.toFixed(2) + 's' : '—'}
            </div>
            <div className="text-xs text-gray-500">Average</div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-3 pb-8">
          <button
            onClick={handleTryAgain}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#2c5e8b] text-white rounded-lg text-sm font-bold hover:bg-[#234a70] transition shadow"
          >
            ↺ Try again
          </button>
          <Link
            href="/settings"
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 transition shadow"
          >
            ⚙ Change difficulty
          </Link>
          <button
            onClick={handleClearHistory}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-bold hover:bg-red-100 transition"
          >
            🗑 Clear history
          </button>
        </div>
      </div>
    </div>
  );
}
