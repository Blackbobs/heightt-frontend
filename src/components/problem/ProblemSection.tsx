'use client';

import React from 'react';
import Image from 'next/image';

const problemPoints = [
  {
    step: '01',
    title: 'Students send transfers',
    desc: 'Fragmented manual transfers across different bank apps without automatic tracking.',
  },
  {
    step: '02',
    title: 'Executives manually confirm',
    desc: 'Executive members spend endless hours cross-checking transaction alerts and chats.',
  },
  {
    step: '03',
    title: 'Screenshots get lost',
    desc: 'Payment proofs disappear in busy WhatsApp group threads and unorganized galleries.',
  },
  {
    step: '04',
    title: 'Receipts are hard to verify',
    desc: 'Paper receipts or screenshot images can be forged, misplaced, or disputed.',
  },
];

export function ProblemSection() {
  return (
    <section
      id="why-heightt"
      className="py-16 sm:py-20 bg-[#F8FAFC] dark:bg-[#0B1020] border-b border-[#E2E8F0] dark:border-slate-800 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-bold text-[#2563EB] uppercase tracking-wider mb-2">
            THE CURRENT FRAGMENTED SYSTEM
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0B1020] dark:text-white leading-tight tracking-tight">
            Dues shouldn't require screenshots, spreadsheets and endless messages.
          </h2>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Traditional campus dues collection relies on fragmented processes that drain time and create confusion for everyone involved.
          </p>
        </div>

        {/* 2-Column Split: Image Mockup on Left, Points on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Platform Image Mockup */}
          <div className="lg:col-span-5 relative w-full h-[320px] sm:h-[400px] lg:h-[440px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg bg-slate-950">
            <Image
              src="/Page 19.png"
              alt="Heightt Platform Mockup"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover object-center"
              priority
            />
          </div>

          {/* Right Column: Structured Grid of Fragmented Problems */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {problemPoints.map((item) => (
              <div
                key={item.step}
                className="bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 rounded-lg p-5 flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500 mb-2 block">
                    {item.step}
                  </span>
                  <h3 className="text-sm font-bold text-[#0B1020] dark:text-white mb-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Strong Typography Transition */}
        <div className="mt-12 p-6 sm:p-8 bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-xs font-bold text-[#2563EB] uppercase tracking-wider mb-1">
              THE HEIGHTT SOLUTION
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#0B1020] dark:text-white">
              Heightt puts everything in one place.
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
              Direct due assignment, instant online payments, verified digital receipts, and clear financial history.
            </p>
          </div>

          <a
            href="#how-it-works"
            className="px-5 py-2.5 bg-[#0B1020] dark:bg-white text-white dark:text-[#0B1020] font-semibold text-xs rounded-md hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            See How It Works →
          </a>
        </div>

      </div>
    </section>
  );
}
