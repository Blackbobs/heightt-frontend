'use client';

import React from 'react';

const steps = [
  {
    step: '01',
    title: 'Create your account',
    desc: 'Join Heightt using your student information.',
  },
  {
    step: '02',
    title: 'See what you owe',
    desc: 'Your assigned dues appear automatically.',
  },
  {
    step: '03',
    title: 'Pay securely',
    desc: 'Complete your payment through Heightt.',
  },
  {
    step: '04',
    title: 'Get your receipt',
    desc: 'Your verified receipt is immediately available.',
  },
];

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="py-16 sm:py-24 bg-[#F8FAFC] dark:bg-[#0B1020] border-b border-[#E2E8F0] dark:border-slate-800 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-xs font-bold text-[#2563EB] uppercase tracking-wider mb-2">
          SIMPLE PROCESS
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0B1020] dark:text-white tracking-tight mb-12">
          How Heightt works for you.
        </h2>

        {/* Process Steps with thin connecting lines */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          
          {steps.map((item, idx) => (
            <div
              key={item.step}
              className="relative bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 rounded-lg p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-mono font-bold text-[#2563EB] bg-[#2563EB]/10 px-2.5 py-1 rounded">
                    {item.step}
                  </span>
                  {idx < steps.length - 1 && (
                    <span className="hidden md:inline-block text-slate-300 dark:text-slate-700 text-lg">→</span>
                  )}
                </div>
                <h3 className="text-base font-bold text-[#0B1020] dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}
