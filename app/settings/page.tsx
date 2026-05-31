'use client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useSimStore } from '@/store/simStore';
import SimulationSettingsControls from '@/components/SimulationSettingsControls';

export default function SettingsPage() {
  const router = useRouter();
  const logout = useSimStore((state) => state.logout);

  const handleStart = () => {
    router.push('/portal/section-selection');
  };

  const handleLogout = () => {
    logout();
    router.push('/');
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

        <div className="mb-8">
          <SimulationSettingsControls description="Configure your practice simulation before starting." />
        </div>

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
