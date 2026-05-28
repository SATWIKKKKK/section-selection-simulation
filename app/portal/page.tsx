'use client';
import PortalHeader from '@/components/PortalHeader';
import PortalSidebar from '@/components/PortalSidebar';
import Image from 'next/image';

export default function PortalPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#e8eef3]" style={{ fontFamily: 'Arial, sans-serif', fontSize: 12 }}>
      <PortalHeader activePage="home" />

      <div className="flex flex-1 overflow-hidden">
        <PortalSidebar activePage="/portal" />

        {/* Main content */}
        <main className="flex-1 bg-[#f2f5f7] p-3 md:p-6 overflow-y-auto">
          {/* Campus image */}
          <div className="flex justify-center mb-6">
            <div className="border border-gray-300 p-1 bg-white inline-block shadow-sm">
              <Image
                src="/ESSWelcome.jpg"
                alt="KIIT University Campus"
                width={500}
                height={100}
                style={{ width: 500, height: 100, objectFit: 'cover', display: 'block', maxWidth: '100%' }}
              />
            </div>
          </div>

          {/* Welcome text */}
          <div className="text-center mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-[#3333cc] mb-2">Welcome To</h2>
            <h1 className="text-2xl md:text-3xl font-bold text-black tracking-wide">KIIT Self Service Portal</h1>
          </div>

          {/* Description */}
          <div className="mb-6 max-w-4xl mx-auto">
            <p className="font-bold text-black text-sm mb-1">
              This Site Provides Access SAP Portal for all Employees (Teaching &amp; Non-Teaching), Managers and Students Of KIIT University.
            </p>
            <p className="font-bold text-black text-sm mb-6">
              Please Use the tabs across the top to access information relevant to you.
            </p>
            <p className="font-bold text-black text-sm">Users in KIIT Self Service Portal:</p>
          </div>

          {/* Feature lists */}
          <div className="flex flex-col md:flex-row gap-12 max-w-4xl mx-auto ml-4 md:ml-12">
            <div className="flex-1">
              <h3 className="font-bold text-black text-sm mb-6">
                Employee Self Service (ESS) allows<br />Employees to:
              </h3>
              <ol className="list-decimal pl-5 space-y-2 text-sm font-bold text-[#000080]">
                <li>Search and Maintain your Personal<br />Information.</li>
                <li>Change Own Data.</li>
                <li>View and Change Personal Details.</li>
                <li>Access and Print Pay Slips.</li>
                <li>Display Current Leave Balances, Apply for<br />and Receive Approvals for Leave and</li>
              </ol>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-black text-sm mb-6">
                Faculty Self Service (FSS) allows Faculties<br />to:
              </h3>
              <ol className="list-decimal pl-5 space-y-2 text-sm font-bold text-[#000080]">
                <li>Maintain Time Table and attendance</li>
                <li>View the Faculty Calendar and adjust the<br />Class Timings</li>
                <li>Upload End Sem Question Paper</li>
                <li>View the complete details of the student<br />including their Grade Report</li>
              </ol>
            </div>
          </div>
        </main>

        {/* Right scrollbar mock */}
        <div className="hidden md:flex w-4 bg-gray-200 border-l border-gray-300 flex-col items-center py-1">
          <div className="w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-500 mb-1" />
          <div className="w-2 h-32 bg-gray-400 rounded-full" />
        </div>
      </div>
    </div>
  );
}
