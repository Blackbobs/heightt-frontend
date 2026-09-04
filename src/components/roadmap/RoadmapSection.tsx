'use client';

import React from 'react';

const upcomingFeatures = [
  { title: 'Campus Event Ticketing', desc: 'Seamless ticketing for faculty & departmental events' },
  { title: 'Student Organization Wallets', desc: 'Secure multi-sig financial accounts for executive boards' },
  { title: 'Automated Financial Handover', desc: 'One-click tenure financial reporting & audit exports' },
];

export function RoadmapSection() {
  return (
    <section id="coming-soon" className="py-16 sm:py-20 bg-white dark:bg-[#0B1020] border-b border-[#E2E8F0] dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-2xl">
          <div className="text-xs font-bold text-[#2563EB] uppercase tracking-wider mb-2">
            COMING TO HEIGHTT
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0B1020] dark:text-white tracking-tight mb-3">
            Dues are just the beginning.
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
            Starting with dues. Heightt is building financial infrastructure around campus life.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {upcomingFeatures.map((item) => (
            <div
              key={item.title}
              className="bg-[#F8FAFC] dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 rounded-lg p-5"
            >
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
                SOON
              </span>
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
