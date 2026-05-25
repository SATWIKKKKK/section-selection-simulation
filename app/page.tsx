import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Top header bar */}
      <div className="bg-[#006633] text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="48" fill="white" />
            <text x="50" y="63" textAnchor="middle" fontSize="38" fontWeight="bold" fill="#006633">K</text>
          </svg>
          <div>
            <div className="text-lg font-extrabold tracking-wide">KIIT University</div>
            <div className="text-xs opacity-80">Kalinga Institute of Industrial Technology (Deemed to be University)</div>
          </div>
        </div>
        <div className="text-xs opacity-70">Established under Section 3 of UGC Act 1956</div>
      </div>

      {/* Nav bar */}
      <div className="bg-[#004d26] text-white px-6 py-1.5 flex gap-6 text-xs">
        {['Home','About','Academics','Admissions','Research','Campus Life','Alumni'].map(item => (
          <span key={item} className="hover:underline cursor-pointer opacity-80">{item}</span>
        ))}
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#e8f5e9] to-[#f0f7ff] min-h-[calc(100vh-100px)] flex items-center justify-center px-4">
        <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8 items-center">
          {/* Left: campus image placeholder */}
          <div className="rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-[#006633] to-[#1a8c4e] aspect-video flex flex-col items-center justify-center text-white p-8">
            <div className="text-6xl mb-4">🎓</div>
            <div className="text-xl font-bold mb-1">KIIT Campus</div>
            <div className="text-sm opacity-70">Bhubaneswar, Odisha</div>
          </div>

          {/* Right: login card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 flex flex-col items-center gap-6">
            <div className="text-center">
              <div className="text-xl font-extrabold text-[#006633] mb-1">Section Selection Simulator</div>
              <div className="text-sm text-gray-500">Practice your KIIT SAP section selection under real-time pressure</div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 text-xs text-amber-700 text-center">
              ⚠ This is a practice simulator — not affiliated with KIIT University
            </div>

            <div className="w-full space-y-3">
              <div className="flex items-start gap-2 text-xs text-gray-600">
                <span className="text-green-600 font-bold mt-0.5">✓</span>
                <span>Realistic SAP portal interface replica</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-gray-600">
                <span className="text-green-600 font-bold mt-0.5">✓</span>
                <span>Live bot drain simulation of seat counts</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-gray-600">
                <span className="text-green-600 font-bold mt-0.5">✓</span>
                <span>Speed grading: S / A+ / A / B / C</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-gray-600">
                <span className="text-green-600 font-bold mt-0.5">✓</span>
                <span>Full attempt history saved locally</span>
              </div>
            </div>

            <Link
              href="/login"
              className="w-full text-center bg-[#006633] hover:bg-[#005229] text-white font-bold py-3 px-6 rounded-lg transition text-sm shadow-md"
            >
              Click here to Login →
            </Link>

            <Link href="/settings" className="text-xs text-blue-600 hover:underline">
              ⚙ Configure difficulty settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
