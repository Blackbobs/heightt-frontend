'use client';

import React from 'react';
import { Sun, ArrowDownLeft, ArrowUpRight, BarChart2 } from 'lucide-react';

export function BalanceCard() {
  return (
    <div className="bg-gradient-to-br from-[#1a5cff] to-[#0f4ad0] rounded-[20px] px-6 py-5 text-white mb-5 relative overflow-hidden">
      {/* Background glare */}
      <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />

      <p className="text-[0.7rem] text-white/70 font-medium uppercase tracking-wide mb-1">Total Balance</p>
      <p className="text-[2rem] font-bold tracking-tight leading-none">₦184,500</p>
      <p className="text-[0.7rem] text-white/60 mt-1.5">Available ₦122,300 · Locked ₦62,200</p>

      <div className="flex gap-2.5 mt-4 flex-wrap">
        <button className="flex items-center gap-1.5 bg-white text-[#1a5cff] rounded-full px-4 py-2 text-[0.72rem] font-semibold cursor-pointer border-none transition-all hover:bg-[#f0f4ff] active:scale-95">
          <ArrowDownLeft className="w-3.5 h-3.5" />
          Fund
        </button>
        <button className="flex items-center gap-1.5 bg-white/15 text-white rounded-full px-4 py-2 text-[0.72rem] font-semibold cursor-pointer border-none transition-all hover:bg-white/25 active:scale-95">
          <ArrowUpRight className="w-3.5 h-3.5" />
          Withdraw
        </button>
        <button className="flex items-center gap-1.5 bg-white/15 text-white rounded-full px-4 py-2 text-[0.72rem] font-semibold cursor-pointer border-none transition-all hover:bg-white/25 active:scale-95">
          <BarChart2 className="w-3.5 h-3.5" />
          Stats
        </button>
      </div>
    </div>
  );
}

export function Greeting() {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-10 h-10 rounded-full bg-[#eef3ff] flex items-center justify-center text-[#1a5cff] flex-shrink-0">
        <Sun className="w-5 h-5" />
      </div>
      <h1 className="text-[1.2rem] font-bold text-[#1a1a2e]">
        Hi, <span className="text-[#1a5cff]">Adaeze</span>
      </h1>
    </div>
  );
}
