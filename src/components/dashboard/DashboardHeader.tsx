'use client';

import React from 'react';
import { Bell } from 'lucide-react';


export function DashboardHeader({ pageTitle = 'Dashboard' }: { pageTitle?: string }) {
  return (
    <header className="flex items-center justify-between px-5 lg:px-7 py-4 bg-[#f8f9fc] lg:bg-white border-b border-[#e8ecf1] flex-shrink-0 sticky top-0 z-10">
      {/* Greeting — mobile only (desktop has sidebar) */}
      <div className="lg:hidden flex items-center gap-1.5 text-[1.15rem] font-bold text-[#1a1a2e]">
        Hi, <span className="text-[#1a5cff]">Adaeze</span>
      </div>

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
