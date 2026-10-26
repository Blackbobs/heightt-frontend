'use client';

import React from 'react';
import { Sun } from 'lucide-react';

export function BalanceCard({ totalPaid }: { totalPaid: number }) {
  return (
    <div className="mb-5 rounded-xl border border-slate-200 bg-white px-6 py-5 dark:border-[#30343A] dark:bg-[#191B1E]">
      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total dues paid</p>
      <p className="mt-2 text-3xl font-black tracking-tight text-[#0B1020] dark:text-white">₦{totalPaid.toLocaleString()}</p>
    </div>
  );
}

export function Greeting({ firstName }: { firstName: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-10 h-10 rounded-full bg-[#EFF6FF] flex items-center justify-center text-[#2563EB] flex-shrink-0">
        <Sun className="w-5 h-5" />
      </div>
      <h1 className="text-[1.2rem] font-bold text-[#0B1020]">
        Hi, <span className="text-[#2563EB]">{firstName}</span>
      </h1>
    </div>
  );
}
