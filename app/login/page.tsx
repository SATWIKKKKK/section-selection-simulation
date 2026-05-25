'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSimStore } from '@/store/simStore';

export default function LoginPage() {
  const router = useRouter();
  const setCredentials = useSimStore((s) => s.setCredentials);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!userId.trim() || !password.trim()) {
      setError('Please enter both User ID and Password.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setCredentials(userId.trim(), 'SATWIK CHANDRA');
      router.push('/portal');
    }, 800);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-300 p-4"
      style={{ fontFamily: 'Arial, sans-serif' }}
    >
      <div
        className="bg-white rounded-lg max-w-2xl w-full overflow-hidden"
        style={{ border: '4px solid #c8960c', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}
      >
        <div className="flex flex-col md:flex-row min-h-[400px]">
          {/* Left: image placeholder */}
          <div
            className="w-full md:w-1/2 flex items-center justify-center p-6 min-h-[200px]"
            style={{ background: 'linear-gradient(135deg, #1a5c2e 0%, #2d8a4e 50%, #1a7a3a 100%)' }}
          >
            <div className="text-center text-white">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg width="60" height="60" viewBox="0 0 100 100" fill="none">
                  <circle cx="50" cy="50" r="40" fill="white" stroke="#00b050" strokeWidth="4" />
                  <path d="M50 15L60 30H40L50 15Z" fill="#00b050" />
                  <path d="M85 50L70 40V60L85 50Z" fill="#00b050" />
                  <path d="M50 85L40 70H60L50 85Z" fill="#00b050" />
                  <path d="M15 50L30 60V40L15 50Z" fill="#00b050" />
                  <text x="50" y="55" fontFamily="Arial" fontSize="20" fontWeight="bold" fill="#00b050" textAnchor="middle">KIIT</text>
                </svg>
              </div>
              <p className="font-bold text-lg">KIIT University</p>
              <p className="text-sm text-white/80">Bhubaneswar, Odisha</p>
              <p className="text-xs text-white/60 mt-2">Campus Portal</p>
            </div>
          </div>

          {/* Right: login form */}
          <div className="w-full md:w-1/2 p-8 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold text-green-700 mb-1">Welcome to KIIT World</h2>
              <p className="text-xs font-bold text-black mb-6 leading-snug">
                INDIA&apos;s first university to implement SAP in all its schools and processes at a time
              </p>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    User <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="e.g. 2405900"
                    className="w-full border border-gray-400 px-3 py-2 text-sm rounded-sm focus:outline-none focus:border-blue-500"
                    autoComplete="username"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full border border-gray-400 px-3 py-2 text-sm rounded-sm focus:outline-none focus:border-blue-500"
                    autoComplete="current-password"
                  />
                </div>

                {error && (
                  <p className="text-xs text-red-600 font-semibold">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="border border-gray-400 bg-gradient-to-b from-[#f5f5f5] to-[#e0e0e0] text-gray-700 text-sm px-6 py-2 rounded-sm hover:from-white hover:to-[#d0d0d0] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Logging in...' : 'Log On'}
                </button>
              </form>

              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-700">
                ⚠️ This is a practice simulator. Credentials are not verified or stored.
              </div>
            </div>

            <div className="mt-6 flex justify-between items-end">
              <p className="text-[10px] text-gray-400">Copyright © SAP AG. All Rights Reserved.</p>
              <div className="bg-[#1a3a6b] w-12 h-8 flex items-center justify-center rounded">
                <span className="text-white font-bold text-xs">KIIT</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
