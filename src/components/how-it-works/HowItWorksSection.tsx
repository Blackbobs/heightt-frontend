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
      className="relative overflow-hidden border-b border-slate-200/80 bg-[#F8FAFC] py-16 dark:border-slate-800 dark:bg-[#0B1020] sm:py-24"
    >
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-30 dark:opacity-10" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        
        <div className="text-center font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#2563EB] lg:text-left">
          SIMPLE PROCESS
        </div>
        <h2 className="mx-auto mt-3 max-w-2xl text-balance text-center text-3xl font-semibold leading-tight tracking-[-0.045em] text-[#0B1020] dark:text-white sm:text-4xl lg:mx-0 lg:text-left lg:text-5xl">
          From due assigned to receipt issued.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base lg:mx-0 lg:text-left">Every step is visible, verified, and kept in one clear payment history.</p>

        {/* Process Steps with thin connecting lines */}
        <div className="relative mt-12 grid grid-cols-1 gap-3 md:grid-cols-4 md:gap-0">
          
          {steps.map((item, idx) => (
            <div
              key={item.step}
              className="relative border border-slate-200/90 bg-white p-6 text-center dark:border-slate-800 dark:bg-[#131B2E] md:min-h-52 md:text-left md:[&:first-child]:rounded-l-3xl md:[&:last-child]:rounded-r-3xl md:[&:not(:first-child)]:border-l-0"
            >
              <div>
                <div className="mb-8 flex items-center justify-center md:justify-between">
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#2563EB]">
                    {item.step}
                  </span>
                  {idx < steps.length - 1 && (
                    <span className="hidden text-slate-300 dark:text-slate-700 md:inline-block">→</span>
                  )}
                </div>
                <h3 className="mb-2 text-base font-semibold text-[#0B1020] dark:text-white">
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
