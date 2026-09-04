'use client';

import React from 'react';

const upcomingFeatures = [
  { title: 'Campus Event Ticketing', desc: 'Seamless ticketing for faculty & departmental events' },
  { title: 'Student Organization Wallets', desc: 'Secure multi-sig financial accounts for executive boards' },
  { title: 'Automated Financial Handover', desc: 'One-click tenure financial reporting & audit exports' },
];

export function RoadmapSection() {
  return (
    <section id="coming-soon" className="border-b border-slate-200/80 bg-white py-16 dark:border-slate-800 dark:bg-[#0B1020] sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        
        <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
          <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#2563EB]">
            COMING TO HEIGHTT
          </div>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-[-0.045em] text-[#0B1020] dark:text-white sm:text-4xl lg:text-5xl">
            Dues are just the beginning.
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
            Starting with dues. Heightt is building financial infrastructure around campus life.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {upcomingFeatures.map((item, index) => (
            <div
              key={item.title}
              className="rounded-3xl border border-slate-200/90 bg-[#F8FAFC] p-6 text-center dark:border-slate-800 dark:bg-[#131B2E] md:min-h-56 md:text-left"
            >
              <span className="mb-8 block font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#2563EB]">
                0{index + 1} / Soon
              </span>
              <h3 className="mb-2 text-lg font-semibold tracking-[-0.025em] text-[#0B1020] dark:text-white">
                {item.title}
              </h3>
              <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
