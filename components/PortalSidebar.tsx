'use client';
import Link from 'next/link';
import { useState } from 'react';

interface SidebarItem {
  label: string;
  href: string;
  active?: boolean;
  indent?: boolean;
  folder?: boolean;
  expanded?: boolean;
}

interface PortalSidebarProps {
  activePage?: string;
}

const NAV_ITEMS: SidebarItem[] = [
  { label: 'Overview', href: '/portal', indent: false },
  { label: 'Student Self Service', href: '/portal/student-self-service', folder: true, expanded: true },
  { label: 'Overview', href: '/portal/student-self-service', indent: true },
  { label: 'Exam Booking', href: '#', indent: true, folder: true },
  { label: 'Leave Application for Students', href: '#', indent: true },
  { label: 'Semester Grade Report', href: '#', indent: true },
  { label: 'Academic,Mentor & Address Details', href: '#', indent: true },
  { label: 'Fees Details', href: '#', indent: true },
  { label: 'RTGS Submit Application', href: '#', indent: true },
  { label: 'Student Attendance Details', href: '#', indent: true },
  { label: 'Download Demand Letter', href: '#', indent: true },
  { label: 'Mental Health Matters', href: '#', indent: true, folder: true },
  { label: 'Pre-mid-semester Student Feedback', href: '#', indent: true },
  { label: 'Section Selection', href: '/portal/section-selection', indent: true },
];

export default function PortalSidebar({ activePage }: PortalSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  if (collapsed) {
    return (
      <aside className="w-8 bg-[#c9d8ec] border-r border-gray-400 flex flex-col items-center pt-2">
        <button
          className="w-6 h-6 bg-gray-200 border border-gray-400 text-xs flex items-center justify-center"
          onClick={() => setCollapsed(false)}
        >▶</button>
      </aside>
    );
  }

  return (
    <aside className="w-56 bg-[#c9d8ec] border-r border-gray-400 flex flex-col flex-shrink-0">
      {/* Sidebar controls */}
      <div className="bg-[#a9c2db] h-5 flex justify-between items-center px-1 border-b border-white">
        <div className="flex space-x-1">
          <button
            className="w-4 h-4 bg-gray-200 border border-gray-400 text-[8px] flex items-center justify-center hover:bg-gray-300"
            onClick={() => setCollapsed(true)}
          >◀</button>
          <button className="w-4 h-4 bg-gray-200 border border-gray-400 text-[8px] flex items-center justify-center hover:bg-gray-300">▶</button>
        </div>
        <button className="w-4 h-4 bg-gray-200 border border-gray-400 text-[8px] flex items-center justify-center hover:bg-gray-300">◀</button>
      </div>

      {/* Detailed Navigation */}
      <div className="flex-1 overflow-y-auto border-b border-gray-400">
        <div className="font-bold text-xs p-1 border-b border-gray-300 bg-[#e4ebf1] flex justify-between items-center">
          <span>Detailed Navigation</span>
          <button className="border border-gray-400 w-4 h-3 flex items-center justify-center bg-gray-100 hover:bg-gray-200">
            <div className="w-2 h-[2px] bg-black"></div>
          </button>
        </div>
        <ul className="text-xs py-1 bg-[#d6e3f0]">
          {NAV_ITEMS.map((item, i) => {
            const isActive = activePage === item.href || (activePage && item.href !== '#' && activePage.startsWith(item.href) && item.href !== '/portal');
            return (
              <li key={i} className={`${item.indent ? 'pl-6' : 'pl-2'}`}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-1 py-0.5 px-1 hover:bg-[#a4c2f4] cursor-pointer rounded-sm ${
                    isActive ? 'bg-[#a4c2f4] font-bold' : ''
                  }`}
                >
                  {item.folder ? (
                    <span className="text-[8px]">{item.expanded ? '▼' : '▶'}</span>
                  ) : (
                    <span className="w-1.5 h-1.5 bg-black inline-block flex-shrink-0" />
                  )}
                  {item.folder && <span className="text-[10px]">📁</span>}
                  <span style={{ color: '#204ba2', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '0.7em', fontStyle: 'normal' }}>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Portal Favorites */}
      <div className="h-32">
        <div className="font-bold text-xs p-1 border-b border-gray-300 bg-[#e4ebf1] flex justify-between">
          <span>Portal Favorites</span>
          <div className="flex space-x-1">
            <button className="border border-gray-400 w-4 h-3 bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-[8px]">☰</button>
            <button className="border border-gray-400 w-4 h-3 bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-[8px]">_</button>
          </div>
        </div>
      </div>

      {/* Bottom scrollbar mock */}
      <div className="h-4 bg-gray-200 border-t border-gray-400 flex items-center justify-between px-1">
        <button className="text-[10px] text-gray-600">◀</button>
        <div className="h-2 flex-1 mx-1 bg-gray-400 rounded-full"></div>
        <button className="text-[10px] text-gray-600">▶</button>
      </div>
    </aside>
  );
}
