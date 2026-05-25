import Link from 'next/link';

const GEAR_TEETH = [
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

function KiitGearLogo() {
  return (
    <svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <circle cx="30" cy="30" r="28" fill="white" stroke="#1a7a2e" strokeWidth="1.5" />
      {GEAR_TEETH.map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="#1a7a2e" strokeWidth="3.5" strokeLinecap="round" />
      ))}
      <circle cx="30" cy="30" r="18" fill="#1a7a2e" />
      <circle cx="30" cy="30" r="6" fill="white" />
    </svg>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <header className="bg-white px-6 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid #e5e7eb' }}>
        <div className="flex items-center gap-3">
          <KiitGearLogo />
          <div>
            <div
              className="font-extrabold tracking-wide uppercase"
              style={{ fontSize: '1.05rem', color: '#1a7a2e', lineHeight: 1.2 }}
            >
              Kalinga Institute of Industrial Technology
            </div>
            <div className="text-gray-500 italic" style={{ fontSize: '0.72rem' }}>
              Deemed to be University U/S 3 of UGC Act, 1956 &nbsp;&#8212;&#8212;
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
          {/* Left: desk photo placeholder */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              minHeight: 340,
              background: 'linear-gradient(160deg, #c8b89a 0%, #a09070 35%, #708060 65%, #506848 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.55)' }}>
              <div style={{ fontSize: '5rem', lineHeight: 1 }}>💻</div>
              <div style={{ fontSize: '1.5rem', marginTop: 4 }}>📱</div>
              <p style={{ fontSize: '0.7rem', marginTop: 8, color: 'rgba(255,255,255,0.4)' }}>
                KIIT Campus · Bhubaneswar
              </p>
            </div>
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
            <p className="font-bold text-gray-800 text-sm">https://kiitportal.kiituniversity.net/</p>
          </div>
        </div>
      </main>
    </div>
  );
}
