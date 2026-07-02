'use client';
import { motion } from 'framer-motion';
import type { Attempt } from '@/store/simStore';
import { GRADE_COLOR } from '@/lib/grading';

interface AttemptHistoryTableProps {
  attempts: Attempt[];
}

function medal(rank: number) {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return '';
}

export default function AttemptHistoryTable({ attempts }: AttemptHistoryTableProps) {
  if (attempts.length === 0) {
    return <p className="text-sm text-gray-500 text-center py-4">No attempts yet.</p>;
  }

  const completed = [...attempts]
    .filter((a) => a.section !== null)
    .sort((a, b) => a.reactionMs - b.reactionMs);

  const rankMap = new Map<string, number>();
  completed.forEach((a, i) => rankMap.set(a.id, i + 1));

  const sorted = [...attempts].reverse();

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="bg-[#3f688e] text-white">
            <th className="px-2 py-1 text-left">#</th>
            <th className="px-2 py-1 text-left">Section</th>
            <th className="px-2 py-1 text-left">Semester</th>
            <th className="px-2 py-1 text-left">Elective 1</th>
            <th className="px-2 py-1 text-left">Elective 2</th>
            <th className="px-2 py-1 text-left font-mono">Time</th>
            <th className="px-2 py-1 text-left">Grade</th>
            <th className="px-2 py-1 text-left">Seats left</th>
            <th className="px-2 py-1 text-left">Mode</th>
            <th className="px-2 py-1 text-left">Date</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((a, i) => {
            const rank = rankMap.get(a.id);
            const isEven = i % 2 === 0;
            return (
              <motion.tr
                key={a.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className={isEven ? 'bg-white' : 'bg-[#f0f4f8]'}
              >
                <td className="px-2 py-1">
                  {a.attemptNumber} {rank ? medal(rank) : ''}
                </td>
                <td className="px-2 py-1 font-semibold">
                  {a.section ?? <span className="text-red-500">Missed</span>}
                </td>
                <td className="px-2 py-1 whitespace-nowrap">{a.semester ?? '3rd'}</td>
                <td className="px-2 py-1 min-w-40">{a.elective1 ?? '—'}</td>
                <td className="px-2 py-1 min-w-40">{a.elective2 ?? '—'}</td>
                <td className="px-2 py-1 font-mono tabular-nums">
                  {a.section ? (a.reactionMs / 1000).toFixed(2) + 's' : '—'}
                </td>
                <td className={`px-2 py-1 font-bold ${GRADE_COLOR[a.grade]}`}>
                  {a.grade}
                </td>
                <td className="px-2 py-1">{a.seatsAtClaim || '—'}</td>
                <td className="px-2 py-1 capitalize">{a.difficulty}</td>
                <td className="px-2 py-1 text-gray-500">
                  {new Date(a.timestamp).toLocaleDateString()}
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
