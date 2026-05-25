'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSimStore } from '@/store/simStore';

const KIIT_TEETH = [
  { x1: 51, y1: 30, x2: 57, y2: 30 },
  { x1: 48.19, y1: 39.47, x2: 53.39, y2: 42.5 },
  { x1: 39.47, y1: 48.19, x2: 42.5, y2: 53.39 },
  { x1: 30, y1: 51, x2: 30, y2: 57 },
  { x1: 20.53, y1: 48.19, x2: 17.5, y2: 53.39 },
  { x1: 11.81, y1: 39.47, x2: 6.61, y2: 42.5 },
  { x1: 9, y1: 30, x2: 3, y2: 30 },
  { x1: 11.81, y1: 20.53, x2: 6.61, y2: 17.5 },
  { x1: 20.53, y1: 11.81, x2: 17.5, y2: 6.61 },
  { x1: 30, y1: 9, x2: 30, y2: 3 },
  { x1: 39.47, y1: 11.81, x2: 42.5, y2: 6.61 },
  { x1: 48.19, y1: 20.53, x2: 53.39, y2: 17.5 },
];

function KiitLogoSmall() {
  return (
    <svg width="36" height="36" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" suppressHydrationWarning>
      <circle cx="30" cy="30" r="28" fill="white" stroke="#1a7a2e" strokeWidth="1.5" />
      {KIIT_TEETH.map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="#1a7a2e" strokeWidth="3.5" strokeLinecap="round" />
      ))}
      <circle cx="30" cy="30" r="18" fill="#1a7a2e" />
      <circle cx="30" cy="30" r="6" fill="white" />
    </svg>
  );
}

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
      className="min-h-screen flex items-center justify-center"
      style={{ background: '#d4d0cb', fontFamily: 'Arial, sans-serif', padding: '2rem' }}
    >
      {/* Outer amber/gold frame */}
      <div
        style={{
          border: '5px solid #c8960c',
          borderRadius: 6,
          background: 'white',
          width: '100%',
          maxWidth: 680,
          overflow: 'hidden',
          boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
        }}
      >
        {/* Top section: image + form side by side */}
        <div className="flex" style={{ minHeight: 380 }}>
          {/* Left: campus photo placeholder */}
          <div
            style={{
              width: '44%',
              background: 'linear-gradient(180deg, #6aaa5a 0%, #4a8c3a 30%, #3a7030 55%, #2a5820 75%, #1a4010 100%)',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              padding: '1rem',
            }}
          >
            {/* Building silhouette */}
            <svg viewBox="0 0 200 140" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', opacity: 0.35 }}>
              <rect x="60" y="50" width="80" height="90" fill="white" />
              <rect x="40" y="70" width="30" height="70" fill="white" />
              <rect x="130" y="70" width="30" height="70" fill="white" />
              <rect x="80" y="20" width="40" height="35" fill="white" />
              <rect x="90" y="0" width="20" height="24" fill="white" />
              {[65,80,95,110,125].map((x) => (
                <rect key={x} x={x} y="70" width="12" height="18" fill="#3a7030" />
              ))}
              {[65,80,95,110,125].map((x) => (
                <rect key={x+'b'} x={x} y="100" width="12" height="40" fill="#3a7030" />
              ))}
            </svg>
            {/* Trees */}
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: 8, alignItems: 'flex-end' }}>
              {[28,36,30,38,26].map((h, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: h, height: h * 1.4, background: 'rgba(20,90,20,0.7)', borderRadius: '50% 50% 20% 20%' }} />
                  <div style={{ width: 4, height: 12, background: 'rgba(80,50,20,0.6)' }} />
                </div>
              ))}
            </div>
          </div>

          {/* Right: login form */}
          <div
            style={{
              width: '56%',
              padding: '2rem 2rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <h2
                style={{
                  color: '#1a7a2e',
                  fontWeight: 'bold',
                  fontSize: '1.15rem',
                  marginBottom: '0.4rem',
                }}
              >
                Welcome to KIIT World
              </h2>
              <p
                style={{
                  fontWeight: 'bold',
                  fontSize: '0.78rem',
                  color: '#111',
                  lineHeight: 1.45,
                  marginBottom: '1.5rem',
                }}
              >
                INDIA&apos;s first university to implement SAP<br />
                in all its schools and processes at a time
              </p>

              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#222', minWidth: 64 }}>
                    User <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="e.g. 2405900"
                    style={{
                      border: '1px solid #aaa',
                      padding: '4px 8px',
                      fontSize: '0.85rem',
                      width: '100%',
                      outline: 'none',
                    }}
                    autoComplete="username"
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#222', minWidth: 70, whiteSpace: 'nowrap' }}>
                    Password <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      border: '1px solid #aaa',
                      padding: '4px 8px',
                      fontSize: '0.85rem',
                      width: '100%',
                      outline: 'none',
                    }}
                    autoComplete="current-password"
                  />
                </div>

                {error && (
                  <p style={{ fontSize: '0.75rem', color: '#cc0000', fontWeight: 600 }}>{error}</p>
                )}

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      background: 'linear-gradient(to bottom, #f5f5f5, #ddd)',
                      border: '1px solid #aaa',
                      padding: '4px 20px',
                      fontSize: '0.85rem',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      color: '#222',
                    }}
                  >
                    {loading ? 'Logging in...' : 'Log On'}
                  </button>
                </div>
              </form>
            </div>

            {/* Footer inside right panel */}
            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <p style={{ fontSize: '0.65rem', color: '#888' }}>Copyright &copy; SAP AG. All Rights Reserved.</p>
              <KiitLogoSmall />
            </div>
          </div>
        </div>

        {/* Bottom gold arch decoration */}
        <div
          style={{
            height: 28,
            background: 'linear-gradient(to right, #c8960c, #e8b830, #c8960c)',
            borderRadius: '0 0 0 0',
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {/* Center arch bump */}
          <div
            style={{
              position: 'absolute',
              top: -18,
              width: 100,
              height: 36,
              background: 'linear-gradient(to bottom, #e8b830, #c8960c)',
              borderRadius: '50% 50% 0 0',
            }}
          />
        </div>
      </div>
    </div>
  );
}
