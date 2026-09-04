'use client';

import React from 'react';

const lifecycleSteps = [
  { step: '01', title: 'Due assigned', desc: 'Added by your department or faculty' },
  { step: '02', title: 'Payment initiated', desc: 'Secure payment session created' },
  { step: '03', title: 'Payment confirmed', desc: 'Instant bank & gateway verification' },
  { step: '04', title: 'Receipt issued', desc: 'Verifiable digital receipt generated' },
];

export function TransparencySection() {
  return (
    <section className="py-16 sm:py-20 bg-[#F8FAFC] dark:bg-[#0B1020] border-b border-[#E2E8F0] dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-xs font-bold text-[#2563EB] uppercase tracking-wider mb-2">
          TRANSPARENCY & TRUST
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#0B1020] dark:text-white tracking-tight mb-10">
          You should always know where your payment stands.
        </h2>

        {/* Horizontal Lifecycle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {lifecycleSteps.map((item, idx) => (
            <div
              key={item.step}
              className="bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 rounded-lg p-5 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-[#2563EB] bg-[#2563EB]/10 px-2 py-0.5 rounded">
                  {item.step}
                </span>
                {idx < lifecycleSteps.length - 1 && (
                  <span className="hidden lg:inline-block text-slate-300 dark:text-slate-700">→</span>
                )}
              </div>
              <h3 className="text-sm font-bold text-[#0B1020] dark:text-white mb-1">
                {item.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
