const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

// ============================================================
// 1. app/page.tsx - Real logo + branding image
// ============================================================
const landingPage = `import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <header className="bg-white px-6 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid #e5e7eb' }}>
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo kiit.png" alt="KIIT Logo" width={60} height={60} style={{ objectFit: 'contain' }} />
          <div>
            <div
              className="font-extrabold tracking-wide uppercase"
              style={{ fontSize: '1.05rem', color: '#1a7a2e', lineHeight: 1.2 }}
            >
              Kalinga Institute of Industrial Technology
            </div>
            <div className="text-gray-500 italic" style={{ fontSize: '0.72rem' }}>
              Deemed to be University U/S 3 of UGC Act, 1956 &nbsp;&mdash;&mdash;
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center cursor-pointer select-none">
          <div
            className="flex items-center justify-center rounded-full"
            style={{ width: 42, height: 42, background: '#1a7a2e' }}
          >
            <svg width="20" height="15" viewBox="0 0 20 15" fill="white">
              <rect width="20" height="2.5" rx="1.25" />
              <rect y="6.25" width="20" height="2.5" rx="1.25" />
              <rect y="12.5" width="20" height="2.5" rx="1.25" />
            </svg>
          </div>
          <span className="text-xs font-semibold text-gray-700 mt-1">Menu</span>
        </div>
      </header>

      {/* Body */}
      <main className="px-6 pt-10 pb-16 bg-white">
        <div className="text-center mb-10">
          <h1
            className="font-bold text-gray-800"
            style={{ fontSize: '2.2rem', letterSpacing: '-0.5px' }}
          >
            KIIT SAP Portal
          </h1>
          <p className="text-gray-500 mt-3" style={{ fontSize: '0.95rem' }}>
            India&apos;s first university to implement SAP in all its school &amp; Processes at a time
          </p>
          <div className="mx-auto mt-4" style={{ width: 80, height: 2, background: '#3ab0e8' }} />
        </div>

        <div
          className="mx-auto grid gap-8"
          style={{ maxWidth: 960, gridTemplateColumns: '1fr 1fr', alignItems: 'stretch' }}
        >
          {/* Left: campus branding image */}
          <div className="rounded-2xl overflow-hidden" style={{ minHeight: 340 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/branding-image.jpg"
              alt="KIIT Campus"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', minHeight: 340 }}
            />
          </div>

          {/* Right: Login card */}
          <div
            className="bg-white flex flex-col items-center justify-center gap-5 rounded-2xl"
            style={{
              border: '1px solid #e5e7eb',
              boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
              padding: '2.5rem',
            }}
          >
            <Link
              href="/login"
              className="w-full text-center font-bold text-white rounded"
              style={{ background: '#00b0f0', padding: '0.75rem 0', fontSize: '1rem', display: 'block' }}
            >
              Click here to Login
            </Link>
            <p className="text-gray-500 text-sm">or visit</p>
            <a
              href="https://ksap.kiit.ac.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold underline"
              style={{ color: '#0055cc' }}
            >
              https://ksap.kiit.ac.in
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-gray-200 text-center text-xs text-gray-400">
        <p>
          This is a simulation tool. Not affiliated with or endorsed by KIIT University or SAP SE.
        </p>
        <p className="mt-1">All trademarks belong to their respective owners.</p>
      </footer>
    </div>
  );
}
`;
fs.writeFileSync(path.join(root, 'app', 'page.tsx'), landingPage);
console.log('✓ app/page.tsx');

// ============================================================
// 2. app/login/page.tsx - Real campus photo + #ebeff2 bg
// ============================================================
const loginPage = `'use client';
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/KIIT-University-SAP-Portal-Login-800x600.webp"
              alt="KIIT Campus"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo kiit.png" alt="KIIT" width={36} height={36} style={{ objectFit: 'contain' }} />
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
`;
fs.writeFileSync(path.join(root, 'app', 'login', 'page.tsx'), loginPage);
console.log('✓ app/login/page.tsx');

// ============================================================
// 3. app/portal/student-self-service/page.tsx - Section Selection first, same style
// ============================================================
const selfServicePage = `'use client';
import Link from 'next/link';
import PortalHeader from '@/components/PortalHeader';
import PortalSidebar from '@/components/PortalSidebar';

function SapIcon() {
  return (
    <div className="w-12 h-12 bg-white border border-gray-300 rounded shadow-sm mr-4 flex flex-wrap p-1 content-center justify-center flex-shrink-0">
      <div className="w-3 h-3 bg-yellow-400 m-[1px] rounded-sm" />
      <div className="w-3 h-3 bg-yellow-200 m-[1px] rounded-full border border-yellow-400" />
      <div className="w-3 h-3 bg-yellow-200 m-[1px] rounded-full border border-yellow-400" />
      <div className="w-3 h-3 bg-yellow-500 m-[1px] rounded-sm" />
    </div>
  );
}

const TILES = [
  { label: 'Section Selection', href: '/portal/section-selection' },
  { label: 'Exam Booking', href: '#' },
  { label: 'RTGS Submit Application', href: '#' },
  { label: 'Leave Application for Students', href: '#' },
  { label: 'Student Attendance Details', href: '#' },
  { label: 'Semester Grade Report', href: '#', note: 'Click the above link i.e., "Academic & Mentor Details" to see the result for (4th&6th Sem B.Tech, BBA [2nd, 4th Sem],4th Sem MCA & BCA). The final result and SGPA/CGPA shall be declared after the examination of pending subject.' },
  { label: 'Download Demand Letter', href: '#' },
  { label: 'Academic,Mentor & Address Details', href: '#' },
  { label: 'Mental Health Matters', href: '#' },
  { label: 'Fees Details', href: '#', special: true },
  { label: 'Pre-mid-semester Student Feedback on Teaching-Learning', href: '#' },
];

export default function StudentSelfServicePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#e8eef3]" style={{ fontFamily: 'Arial, sans-serif', fontSize: 12 }}>
      <PortalHeader activePage="student-self-service" />

      <div className="flex flex-1 overflow-hidden">
        <PortalSidebar activePage="/portal/student-self-service" />

        {/* Content grid */}
        <main className="flex-1 bg-[#f5f5f5] p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 max-w-5xl">
            {TILES.map((tile, i) => (
              <Link key={i} href={tile.href} className="flex items-start group">
                <SapIcon />
                <div className="flex-grow pt-1">
                  <span className="text-sm group-hover:underline text-[#0000ee]">
                    {tile.label}
                  </span>
                  {tile.note && (
                    <p className="text-xs text-gray-600 mt-1 leading-tight">{tile.note}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
`;
fs.writeFileSync(path.join(root, 'app', 'portal', 'student-self-service', 'page.tsx'), selfServicePage);
console.log('✓ app/portal/student-self-service/page.tsx');

console.log('\nAll simple files written. Run update-complex.js for the complex rewrites.');
