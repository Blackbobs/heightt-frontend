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
          className="group flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-white px-2 py-3 transition-colors hover:border-[#2563EB] active:scale-95 dark:border-[#30343A] dark:bg-[#191B1E]"
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
