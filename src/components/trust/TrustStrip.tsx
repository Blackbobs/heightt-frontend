'use client';

import React from 'react';
import { ShieldCheck, FileCheck, History, Lock } from 'lucide-react';

export function TrustStrip() {
  const items = [
    { icon: ShieldCheck, label: 'Verified payments' },
    { icon: FileCheck, label: 'Digital receipts' },
    { icon: History, label: 'Clear payment history' },
    { icon: Lock, label: 'Secure transactions' },
  ];

  return (
    <section className="bg-white dark:bg-[#0B1020] border-b border-[#E2E8F0] dark:border-slate-800 py-6 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4">
          <div className="text-sm font-bold text-[#0B1020] dark:text-white uppercase tracking-wider whitespace-nowrap">
            Built for how campus payments actually work.
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-end gap-6 sm:gap-8">
            {items.map((item, idx) => {
              const Icon = item.icon;
              return (
                <React.Fragment key={item.label}>
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                    <Icon className="w-4 h-4 text-[#2563EB] flex-shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {idx < items.length - 1 && (
                    <span className="hidden sm:inline-block text-slate-300 dark:text-slate-700">|</span>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
