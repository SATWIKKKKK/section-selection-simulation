import Link from 'next/link';

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
