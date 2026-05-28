'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSimStore } from '@/store/simStore';
import { GRADE_COLOR } from '@/lib/grading';
import AttemptHistoryTable from '@/components/AttemptHistoryTable';
import PortalHeader from '@/components/PortalHeader';
import PortalSidebar from '@/components/PortalSidebar';

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
  const reactionSec = missed ? null : latest.reactionMs / 1000;
  const grade = latest.grade;

  const completed = attempts.filter((a) => a.section !== null);
  const best = completed.length ? Math.min(...completed.map((a) => a.reactionMs / 1000)) : null;
  const avgSec = completed.length
    ? completed.reduce((s, a) => s + a.reactionMs / 1000, 0) / completed.length
    : null;

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
    <div className="min-h-screen flex flex-col bg-[#e8eef3]" style={{ fontFamily: 'Arial, sans-serif', fontSize: 12 }}>
      <PortalHeader activePage="section-selection" />

      <div className="flex flex-1 overflow-hidden">
        <PortalSidebar activePage="/portal/section-selection" />

        <main className="flex-1 bg-[#f2f5f7] p-3 md:p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-5">

            {/* Page title */}
            <div className="mb-2">
              <h2 className="text-base font-bold text-[#003366] mb-1">Section Selection Result</h2>
              <p className="text-xs text-gray-600">Attempt #{latest.attemptNumber} — {latest.difficulty} mode</p>
            </div>

            {/* Result summary card */}
            <div className="bg-white border border-gray-300 rounded-sm shadow-sm overflow-hidden">
              <div
                className="px-4 py-2 font-bold text-white text-xs"
                style={{ background: '#3f688e' }}
              >
                Result Summary
              </div>
              <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="px-4 py-2 font-bold text-[#003366] w-48">Status</td>
                    <td className="px-4 py-2">
                      {missed ? (
                        <span className="text-red-700 font-bold">Failed — no section selected in time</span>
                      ) : (
                        <span className="text-green-700 font-bold">Section Secured</span>
                      )}
                    </td>
                  </tr>
                  <tr className="bg-[#f7f9fb] border-b border-gray-200">
                    <td className="px-4 py-2 font-bold text-[#003366]">Section Assigned</td>
                    <td className="px-4 py-2 font-bold">
                      {missed ? (
                        <span className="text-gray-500 italic">Random allocation pending</span>
                      ) : (
                        <span className="text-[#003366]">{latest.section}</span>
                      )}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="px-4 py-2 font-bold text-[#003366]">Reaction Time</td>
                    <td className="px-4 py-2">
                      {reactionSec !== null ? (
                        <span className={reactionSec < 5 ? 'text-green-700 font-bold' : reactionSec < 10 ? 'text-amber-700 font-bold' : 'text-red-700 font-bold'}>
                          {reactionSec.toFixed(2)}s
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                  <tr className="bg-[#f7f9fb] border-b border-gray-200">
                    <td className="px-4 py-2 font-bold text-[#003366]">Speed Grade</td>
                    <td className={`px-4 py-2 font-bold ${GRADE_COLOR[grade]}`}>{grade}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="px-4 py-2 font-bold text-[#003366]">Seats Left When Claimed</td>
                    <td className="px-4 py-2 font-bold text-blue-700">
                      {missed ? <span className="text-gray-400">—</span> : latest.seatsAtClaim}
                    </td>
                  </tr>
                  <tr className="bg-[#f7f9fb]">
                    <td className="px-4 py-2 font-bold text-[#003366]">Difficulty Mode</td>
                    <td className="px-4 py-2 capitalize">{latest.difficulty}</td>
                  </tr>
                </tbody>
              </table>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2 md:gap-4">
              <div className="bg-white border border-gray-300 rounded-sm shadow-sm p-3 text-center">
                <div className="text-xl font-bold text-[#003366]">{attempts.length}</div>
                <div className="text-xs text-gray-500 mt-0.5">Total Attempts</div>
              </div>
              <div className="bg-white border border-gray-300 rounded-sm shadow-sm p-3 text-center">
                <div className="text-xl font-bold text-green-700">{best !== null ? best.toFixed(2) + 's' : '—'}</div>
                <div className="text-xs text-gray-500 mt-0.5">Personal Best</div>
              </div>
              <div className="bg-white border border-gray-300 rounded-sm shadow-sm p-3 text-center">
                <div className="text-xl font-bold text-blue-700">{avgSec !== null ? avgSec.toFixed(2) + 's' : '—'}</div>
                <div className="text-xs text-gray-500 mt-0.5">Average Time</div>
              </div>
            </div>

            {/* Session History Table */}
            <div className="bg-white border border-gray-300 rounded-sm shadow-sm overflow-hidden">
              <div
                className="px-4 py-2 font-bold text-white text-xs"
                style={{ background: '#3f688e' }}
              >
                Session History ({attempts.length} attempt{attempts.length !== 1 ? 's' : ''})
              </div>
              <AttemptHistoryTable attempts={attempts} />
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 pb-8">
              <button
                onClick={handleTryAgain}
                className="px-5 py-2 text-xs font-bold border border-[#3f688e] text-[#003366] transition rounded-sm"
                style={{ background: 'linear-gradient(to bottom, #ffffff, #d6e4f0)' }}
              >
                Try Again
              </button>
              <Link
                href="/settings"
                className="px-5 py-2 text-xs font-bold border border-gray-400 text-[#333] transition rounded-sm"
                style={{ background: 'linear-gradient(to bottom, #ffffff, #e8e8e8)' }}
              >
                Change Difficulty
              </Link>
              <button
                onClick={handleClearHistory}
                className="px-5 py-2 text-xs font-bold border border-red-300 text-red-700 transition rounded-sm"
                style={{ background: 'linear-gradient(to bottom, #fff5f5, #ffe4e4)' }}
              >
                Clear History
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
