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
      className="border-b border-slate-200/80 bg-[#F8FAFC] py-16 dark:border-slate-800 dark:bg-[#0B1020] sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-3xl text-center lg:mx-0 lg:text-left">
          <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#2563EB]">
            THE CURRENT FRAGMENTED SYSTEM
          </div>
          <h2 className="mt-3 text-balance text-3xl font-semibold leading-tight tracking-[-0.045em] text-[#0B1020] dark:text-white sm:text-4xl lg:text-5xl">
            Dues shouldn&apos;t require screenshots, spreadsheets and endless messages.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base lg:mx-0">
            Traditional campus dues collection relies on fragmented processes that drain time and create confusion for everyone involved.
          </p>
        </div>

        {/* 2-Column Split: Image Mockup on Left, Points on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Platform Image Mockup */}
          <div className="relative h-[280px] w-full overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 shadow-[0_24px_70px_-36px_rgba(15,42,100,0.4)] dark:border-slate-800 sm:h-[400px] lg:col-span-5 lg:h-[440px]">
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
                className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 text-center dark:border-slate-800 dark:bg-[#131B2E] sm:text-left"
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
        <div className="mt-12 flex flex-col items-center justify-between gap-6 rounded-3xl border border-[#2563EB]/15 bg-[#2563EB]/5 p-7 text-center dark:bg-[#2563EB]/8 sm:flex-row sm:p-9 sm:text-left">
          <div className="max-w-3xl">
            <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#2563EB]">
              THE HEIGHTT SOLUTION
            </div>
            <h3 className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-[#0B1020] dark:text-white sm:text-3xl">
              Heightt puts everything in one place.
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
              Direct due assignment, instant online payments, verified digital receipts, and clear financial history.
            </p>
          </div>

          <a
            href="#how-it-works"
            className="whitespace-nowrap rounded-xl bg-[#0B1020] px-5 py-3 text-xs font-semibold text-white transition-transform hover:-translate-y-0.5 dark:bg-white dark:text-[#0B1020]"
          >
            See How It Works →
          </a>
        </div>

      </div>
    </section>
  );
}
