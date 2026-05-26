'use client';
import Link from 'next/link';
import { useSimStore } from '@/store/simStore';

interface Tab {
  label: string;
  href: string;
  active?: boolean;
}

interface PortalHeaderProps {
  activePage?: 'home' | 'student-self-service' | 'section-selection' | 'cyber';
}

export default function PortalHeader({ activePage = 'home' }: PortalHeaderProps) {
  const studentName = useSimStore((s) => s.studentName);

  const tabs: Tab[] = [
    { label: 'Home', href: '/portal', active: activePage === 'home' },
    {
      label: 'Student Self Service for Computer Science & Engineering (CSE - 2024/25 Batch)',
      href: '/portal/student-self-service',
      active: activePage === 'student-self-service' || activePage === 'section-selection',
    },
    { label: 'AWARENESS IN CYBER SECURITY MANUAL', href: '#', active: activePage === 'cyber' },
  ];

  return (
    <div className="w-full">
      {/* Main Header */}
      <header
        className="w-full flex items-center justify-between px-3 py-2 border-b border-gray-400"
        style={{ background: 'linear-gradient(to right, #c4d7ec 0%, #dbe9f5 40%, #b8cfea 100%)', minHeight: 64 }}
      >
        <div className="text-[#003366] font-bold text-sm bg-white/70 px-2 py-1 rounded-sm">
          Welcome { 'LOVABLE KIITIAN'} .
        </div>
        <div className="flex-1 mx-4 h-10 rounded overflow-hidden">
          <div
            className="w-full h-full"
            style={{ background: 'linear-gradient(135deg, #4a90d9 0%, #87bfee 40%, #c4d7ec 70%, #5b8ec4 100%)' }}
          />
        </div>
        <div className="flex items-center space-x-4 text-xs text-[#003366]">
          <div className="flex items-center space-x-2 bg-white/70 px-2 py-1 rounded-sm">
            <a href="#" style={{ color: '#204ba2', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '0.7em', fontStyle: 'normal' }}>Help</a>
            <span>|</span>
            <Link href="/portal" style={{ color: '#204ba2', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '0.7em', fontStyle: 'normal' }}>Log off</Link>
          </div>
          <div className="bg-[#1a3a6b] w-16 h-10 flex items-center justify-center rounded-sm">
            <span className="text-white font-bold text-xs">KIIT</span>
          </div>
        </div>
      </header>

      {/* Important Notice */}
      <div className="w-full bg-[#c2d2e1] border-y border-gray-400 py-1 px-2">
        <div className="flex justify-between items-center text-xs font-bold text-gray-800 mb-1">
          <span>IMPORTANT NOTICE</span>
          <div className="flex space-x-1">
            <button className="w-3 h-3 bg-gray-100 border border-gray-400 text-[8px] flex items-center justify-center">□</button>
            <button className="w-3 h-3 bg-gray-100 border border-gray-400 text-[8px] flex items-center justify-center">_</button>
          </div>
        </div>
        <div className="bg-[#fdf5e6] border border-[#f6c075] rounded px-4 py-2 flex items-center justify-center">
          <span className="text-orange-500 mr-2 text-lg">⚠️</span>
          <span className="text-red-600 font-bold text-sm">
            You must clear your outstanding dues before the due date for a hassle free process.
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="w-full bg-[#8faecf] flex border-b border-white flex-wrap">
        {tabs.map((tab) => (
          <Link
            key={tab.label}
            href={tab.href}
            className={`text-xs py-1 px-3 border-r border-white whitespace-nowrap ${
              tab.active
                ? 'bg-[#3f688e] text-white font-bold'
                : 'bg-[#8faecf] text-black hover:bg-gray-300'
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      {/* Sub-nav */}
      <nav className="w-full bg-[#3f688e] flex border-b-2 border-white">
        {activePage === 'home' ? (
          <span className="bg-[#3f688e] text-white text-xs font-bold py-1 px-4 border-r border-white">Overview</span>
        ) : (
          <span className="bg-[#3f688e] text-white text-xs font-bold py-1 px-4 border-r border-white">Student Self Service</span>
        )}
      </nav>

      {/* Breadcrumb */}
      <div className="w-full bg-[#e3eaf3] border-b border-gray-300 flex justify-between items-center px-2 py-0.5 text-[10px]">
        <span className="font-bold text-gray-800">Overview</span>
        <div className="flex items-center space-x-2 text-blue-800">
          <span className="text-gray-600">|</span>
          <a href="#" className="hover:underline flex items-center">History <span className="text-[8px] ml-1">▼</span></a>
          <a href="#" className="hover:underline">Back</a>
          <span className="text-gray-400 cursor-not-allowed">Forward</span>
          <button className="w-3 h-3 bg-gray-100 border border-gray-400 flex items-center justify-center text-[8px]">☰</button>
        </div>
      </div>
    </div>
  );
}
