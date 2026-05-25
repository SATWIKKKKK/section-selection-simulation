'use client';
import { motion } from 'framer-motion';
import { Difficulty } from '@/store/simStore';

interface DifficultyCardProps {
  difficulty: Difficulty;
  selected: boolean;
  onClick: () => void;
}

const CONFIG: Record<Difficulty, { title: string; desc: string; badge: string; badgeColor: string }> = {
  easy: {
    title: 'Easy',
    desc: '60s window · bots drain 1 seat/tick',
    badge: 'Beginner',
    badgeColor: 'bg-green-100 text-green-800',
  },
  normal: {
    title: 'Normal',
    desc: '30s window · bots drain 1–3 seats/tick',
    badge: 'Standard',
    badgeColor: 'bg-blue-100 text-blue-800',
  },
  hard: {
    title: 'Hard',
    desc: '20s window · bots drain 2–5 seats/tick',
    badge: 'Exam mode',
    badgeColor: 'bg-red-100 text-red-800',
  },
};

export default function DifficultyCard({ difficulty, selected, onClick }: DifficultyCardProps) {
  const cfg = CONFIG[difficulty];

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`cursor-pointer rounded-lg border-2 p-5 transition-all ${
        selected ? 'border-blue-500 shadow-md bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-lg text-gray-800">{cfg.title}</h3>
        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${cfg.badgeColor}`}>
          {cfg.badge}
        </span>
      </div>
      <p className="text-sm text-gray-600">{cfg.desc}</p>
      {selected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2 text-xs text-blue-600 font-semibold"
        >
          ✓ Selected
        </motion.div>
      )}
    </motion.div>
  );
}
