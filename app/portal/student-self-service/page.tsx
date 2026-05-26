'use client';
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
                  <span style={{ color: '#204ba2', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '0.7em', fontStyle: 'normal', textDecoration: 'underline' }}>
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
