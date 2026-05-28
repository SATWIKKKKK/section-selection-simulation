'use client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useSimStore, Difficulty } from '@/store/simStore';
import DifficultyCard from '@/components/DifficultyCard';

export default function SettingsPage() {
  const router = useRouter();
  const { difficulty, setDifficulty, customWindowTime, setCustomWindowTime, logout } = useSimStore();

  const handleStart = () => {
    router.push('/portal/section-selection');
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
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
          className="mb-8 flex justify-between items-start"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-[#2c5e8b] text-white px-2 py-0.5 rounded text-xs font-bold">KIIT SIM</div>
              <h1 className="text-2xl font-extrabold text-gray-800">Settings</h1>
            </div>
            <p className="text-sm text-gray-500">Configure your practice simulation</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-100 text-red-700 font-bold rounded hover:bg-red-200 transition text-sm"
          >
            Logout
          </button>
        </motion.div>

        {/* Difficulty cards */}
        <div className="mb-8">
          <h2 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Difficulty</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(['easy', 'normal', 'hard', 'custom'] as Difficulty[]).map((d) => (
              <DifficultyCard
                key={d}
                difficulty={d}
                selected={difficulty === d}
                onClick={() => setDifficulty(d)}
              />
            ))}
          </div>
        </div>

        {/* Custom time slider */}
        {difficulty === 'custom' && (
          <div className="mb-8">
            <h2 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Custom Window Time</h2>
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-700 font-semibold text-sm">Duration (seconds)</span>
                <span className="text-blue-700 font-bold bg-blue-100 px-3 py-1 rounded-full">{customWindowTime}s</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                value={customWindowTime}
                onChange={(e) => setCustomWindowTime(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>1s (Impossible)</span>
                <span>30s (Very Relaxed)</span>
              </div>
            </div>
          </div>
        )}

        {/* Start button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleStart}
          className="w-full bg-[#2c5e8b] text-white font-bold py-3 px-6 rounded-xl text-base hover:bg-[#234a70] transition shadow-md mt-6"
        >
          Start practice →
        </motion.button>
      </div>
    </div>
  );
}
