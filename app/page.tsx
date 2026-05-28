import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <header className="bg-white px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #e5e7eb' }}>
        <div className="flex items-center gap-3">
          <Image src="/logo kiit.png" alt="KIIT Logo" width={270} height={95} style={{ objectFit: 'contain' }} priority />
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
      <main className="px-4 md:px-10 py-4 md:py-8 bg-white flex flex-col justify-center" style={{ minHeight: 'calc(100vh - 140px)' }}>
        <div className="text-center mb-6 flex flex-col items-center flex-shrink-0">
          <h1
            className="font-bold text-gray-800"
            style={{ fontSize: '2rem', letterSpacing: '-0.5px' }}
          >
            KIIT SAP Portal
          </h1>
          <p className="text-gray-500 mt-2 max-w-xl mx-auto" style={{ fontSize: '0.9rem' }}>
            India&apos;s first university to implement SAP in all its school &amp; Processes at a time
          </p>
          <div className="mt-3" style={{ width: 80, height: 2, background: '#3ab0e8' }} />
        </div>

        <div
          className="mx-auto grid gap-6 grid-cols-1 md:grid-cols-2 w-full"
          style={{ maxWidth: 1280, alignItems: 'stretch' }}
        >
          {/* Left: campus branding image */}
          <div className="rounded-2xl overflow-hidden shadow-sm relative" style={{ minHeight: 240, height: 'clamp(240px, 38vw, 520px)' }}>
            <Image
              src="/KIIT-University-SAP-Portal-Login-800x600.webp"
              alt="KIIT Campus"
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>

          {/* Right: Login card */}
          <div
            className="bg-white flex flex-col items-center justify-center gap-5 rounded-2xl py-12 px-8"
            style={{
              border: '1px solid #e5e7eb',
              boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
              minHeight: 240,
            }}
          >
            <Link
              href="/login"
              className="w-full text-center font-bold text-white rounded transition-all duration-300 transform hover:-translate-y-1 hover:bg-[#808080]"
              style={{ background: '#00b0f0', padding: '0.85rem 0', fontSize: '1.05rem', display: 'block' }}
            >
              Click here to Login
            </Link>
            <p className="text-gray-500 text-sm">or visit</p>
            <a
              href="https://kiitportal.kiituniversity.net/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold underline"
              style={{ color: '#0055cc' }}
            >
              https://kiitportal.kiituniversity.net/
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
