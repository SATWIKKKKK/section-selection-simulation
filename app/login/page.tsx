'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
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
      className="min-h-screen flex items-center justify-center"
      style={{ background: '#ebeff2', fontFamily: 'Arial, sans-serif', padding: '2rem' }}
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
          {/* Left: campus photo */}
          <div style={{ width: '44%', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
            <Image
              src="/KIIT-University-SAP-Portal-Login-800x600.webp"
              alt="KIIT Campus"
              width={800}
              height={600}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              priority
            />
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
              <Image src="/logo kiit.png" alt="KIIT" width={36} height={36} style={{ objectFit: 'contain' }} />
            </div>
          </div>
        </div>

        {/* Bottom gold bar */}
        <div
          style={{
            height: 28,
            background: 'linear-gradient(to right, #c8960c, #e8b830, #c8960c)',
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
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
