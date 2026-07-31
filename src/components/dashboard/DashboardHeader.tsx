'use client';

import React from 'react';
import Link from 'next/link';
import { Bell } from 'lucide-react';

function CampusPayLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
      <rect x="2" y="6" width="28" height="20" rx="6" stroke="#1a5cff" strokeWidth="2.5" />
      <path d="M10 12h12M10 16h8M10 20h6" stroke="#1a5cff" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="22" cy="20" r="2" fill="#1a5cff" />
    </svg>
  );
}

export function DashboardHeader({ pageTitle = 'Dashboard' }: { pageTitle?: string }) {
  return (
    <header className="flex items-center justify-between px-5 lg:px-7 py-4 bg-[#f8f9fc] lg:bg-white border-b border-[#e8ecf1] flex-shrink-0 sticky top-0 z-10">
      {/* Logo — mobile only (desktop has sidebar) */}
      <Link href="/" className="lg:hidden flex items-center gap-2 font-bold text-[1rem] text-[#1a1a2e] no-underline">
        <CampusPayLogo />
        Campus<span className="text-[#1a5cff]">Pay</span>
      </Link>

      {/* Desktop page title */}
      <h2 className="hidden lg:block text-[1.05rem] font-semibold text-[#1a1a2e]">{pageTitle}</h2>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        <button
          className="w-[38px] h-[38px] rounded-full border-none bg-white flex items-center justify-center cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:bg-[#f0f2f5] transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-[18px] h-[18px] text-[#1a1a2e]" />
        </button>
        <div
          className="w-[38px] h-[38px] rounded-full bg-gradient-to-br from-[#1a5cff] to-[#4a7aff] flex items-center justify-center text-white font-semibold text-[0.8rem] cursor-pointer"
          aria-label="Profile"
        >
          AO
        </div>
      </div>
    </header>
  );
}
