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
    setLoading(true);
    setTimeout(() => {
      setCredentials(userId.trim() || '2405900', 'Lovable Kiitians');
      router.push('/portal');
    }, 800);
  };

  return (
    <div
      className="min-h-screen flex items-start md:items-center justify-center p-4 md:p-8"
      style={{ background: '#ebeff2', fontFamily: 'Arial, sans-serif' }}
    >
      {/* Outer amber/gold frame */}
      <div
        style={{
          border: '5px solid #c8960c',
          borderRadius: 6,
          background: 'white',
          width: '100%',
          maxWidth: 780,
          overflow: 'hidden',
          boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
        }}
      >
        {/* Top section: image + form — stacked on mobile, side by side on md+ */}
        <div className="flex flex-col md:flex-row" style={{ minHeight: 380 }}>
          {/* Left: campus photo — hidden on mobile */}
          <div className="hidden md:block md:w-[44%] relative overflow-hidden flex-shrink-0" style={{ minHeight: 380 }}>
            <Image
              src="/branding-image.jpg"
              alt="KIIT Campus"
              width={800}
              height={600}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              priority
            />
          </div>

          {/* Right: login form */}
          <div
            className="w-full md:w-[56%] flex flex-col justify-between"
            style={{
              padding: '1.5rem 1.5rem 1.25rem',
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

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      background: 'linear-gradient(to bottom, #f5f5f5, #ddd)',
                      border: '1px solid #aaa',
                      padding: '5px 24px',
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
