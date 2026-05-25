'use client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useSimStore, Difficulty } from '@/store/simStore';
import DifficultyCard from '@/components/DifficultyCard';

export default function SettingsPage() {
  const router = useRouter();
  const { difficulty, setDifficulty, botRushEnabled, toggleBotRush } = useSimStore();

  const handleStart = () => {
    router.push('/portal/section-selection');
  };

  return (
    <div
      className="min-h-screen bg-[#f0f4f8] p-4 md:p-8"
      style={{ fontFamily: 'Arial, sans-serif' }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-[#2c5e8b] text-white px-2 py-0.5 rounded text-xs font-bold">KIIT SIM</div>
            <h1 className="text-2xl font-extrabold text-gray-800">Settings</h1>
          </div>
          <p className="text-sm text-gray-500">Configure your practice simulation</p>
        </motion.div>

        {/* Difficulty cards */}
        <div className="mb-8">
          <h2 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Difficulty</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['easy', 'normal', 'hard'] as Difficulty[]).map((d) => (
              <DifficultyCard
                key={d}
                difficulty={d}
                selected={difficulty === d}
                onClick={() => setDifficulty(d)}
              />
            ))}
          </div>
        </div>

        {/* Bot rush toggle */}
        <div className="mb-8">
          <h2 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Bot Rush</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold text-gray-800 text-sm">Bot rush enabled</p>
                <p className="text-xs text-gray-500 mt-1">
                  {botRushEnabled
                    ? 'Bots will drain seat counts during the window — simulates real competition.'
                    : 'Seats stay constant — pure reaction-time practice mode.'}
                </p>
              </div>
              <button
                onClick={toggleBotRush}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  botRushEnabled ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                    botRushEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Info card */}
        <div className="mb-8 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm font-bold text-blue-800 mb-2">How it works</p>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• A countdown timer simulates the real selection window opening.</li>
            <li>• When the window opens, select your section and submit as fast as possible.</li>
            <li>• Your reaction time is graded: S(&lt;5s) · A+(&lt;10s) · A(&lt;20s) · B(&lt;30s) · C(30s+)</li>
            <li>• All attempts are saved locally — history persists across sessions.</li>
          </ul>
        </div>

        {/* Start button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleStart}
          className="w-full bg-[#2c5e8b] text-white font-bold py-3 px-6 rounded-xl text-base hover:bg-[#234a70] transition shadow-md"
        >
          Start practice →
        </motion.button>
      </div>
    </div>
  );
}
