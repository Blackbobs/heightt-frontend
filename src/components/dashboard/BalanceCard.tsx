'use client';

import React from 'react';
import { Sun, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

export function BalanceCard() {
  return (
    <div className="bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] rounded-3xl px-6 py-5 text-white mb-5 relative overflow-hidden">
      {/* Background glare */}
      <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />

      <p className="text-[0.7rem] text-white/70 font-medium uppercase tracking-wide mb-1">Total Balance</p>
      <p className="text-[2rem] font-bold tracking-tight leading-none">₦184,500</p>
      <p className="text-[0.7rem] text-white/60 mt-1.5">Total Dues Paid</p>
    </div>
  );
}

export function Greeting() {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-10 h-10 rounded-full bg-[#EFF6FF] flex items-center justify-center text-[#2563EB] flex-shrink-0">
        <Sun className="w-5 h-5" />
      </div>
      <h1 className="text-[1.2rem] font-bold text-[#0B1020]">
        Hi, <span className="text-[#2563EB]">Adaeze</span>
      </h1>
    </div>
  );
}
