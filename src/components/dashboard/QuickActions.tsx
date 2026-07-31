'use client';

import React from 'react';
import { CreditCard, CalendarDays, PiggyBank, Receipt } from 'lucide-react';

const ACTIONS = [
  { label: 'Pay Dues',  desc: '2 pending', icon: CreditCard },
  { label: 'Tickets',   desc: 'Events',    icon: CalendarDays },
  { label: 'Save',      desc: '3 goals',   icon: PiggyBank },
  { label: 'Receipts',  desc: '6 issued',  icon: Receipt },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-4 gap-2.5 mb-5">
      {ACTIONS.map(({ label, desc, icon: Icon }) => (
        <button
          key={label}
          className="bg-white border border-[#e8ecf1] rounded-[14px] py-3 px-2 flex flex-col items-center gap-1.5 cursor-pointer group transition-all hover:border-[#1a5cff] hover:shadow-[0_4px_12px_rgba(26,92,255,0.06)] active:scale-95"
        >
          <div className="w-9 h-9 rounded-[10px] bg-[#eef3ff] flex items-center justify-center text-[#1a5cff] group-hover:bg-[#dce8ff] transition-colors">
            <Icon className="w-[18px] h-[18px]" />
          </div>
          <span className="text-[0.7rem] font-semibold text-[#1a1a2e] leading-tight">{label}</span>
          <span className="text-[0.58rem] text-[#6b7a8f] leading-tight">{desc}</span>
        </button>
      ))}
    </div>
  );
}
