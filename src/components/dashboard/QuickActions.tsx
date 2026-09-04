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
          className="bg-white border border-[#E2E8F0] rounded-xl py-3 px-2 flex flex-col items-center gap-1.5 cursor-pointer group transition-all hover:border-[#2563EB] hover:shadow-[0_4px_12px_rgba(26,92,255,0.06)] active:scale-95"
        >
          <div className="w-9 h-9 rounded-[10px] bg-[#EFF6FF] flex items-center justify-center text-[#2563EB] group-hover:bg-[#dce8ff] transition-colors">
            <Icon className="w-[18px] h-[18px]" />
          </div>
          <span className="text-[0.7rem] font-semibold text-[#0B1020] leading-tight">{label}</span>
          <span className="text-[0.58rem] text-[#64748B] leading-tight">{desc}</span>
        </button>
      ))}
    </div>
  );
}
