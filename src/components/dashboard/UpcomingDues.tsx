'use client';

import React from 'react';
import { SectionTitle } from './SectionTitle';

interface Due {
  title: string;
  meta: string;
  amount: string;
  status: 'outstanding' | 'pending';
}

const DUES: Due[] = [
  { title: 'Departmental Dues 2025/26', meta: 'Due Dec 15, 2025', amount: '₦25,000', status: 'outstanding' },
  { title: 'Faculty Dues 2025/26',      meta: 'Due Dec 20, 2025', amount: '₦15,000', status: 'pending' },
];

const BADGE = {
  outstanding: 'bg-[#fde8e8] text-[#c05a5a]',
  pending:     'bg-[#fff4e6] text-[#b86b1f]',
};

export function UpcomingDues() {
  return (
    <div className="mb-2">
      <SectionTitle title="Upcoming dues" linkLabel="View all" />
      <div className="bg-white border border-[#e8ecf1] rounded-[16px] divide-y divide-[#f0f2f5] overflow-hidden">
        {DUES.map((due) => (
          <div key={due.title} className="flex items-center justify-between px-4 py-3.5 hover:bg-[#fafbff] transition-colors cursor-pointer">
            <div>
              <p className="text-[0.82rem] font-semibold text-[#1a1a2e]">{due.title}</p>
              <p className="text-[0.6rem] text-[#7a8ba3] mt-0.5">{due.meta}</p>
            </div>
            <div className="text-right">
              <p className="text-[0.82rem] font-bold text-[#1a1a2e]">{due.amount}</p>
              <span className={`mt-1 inline-block text-[0.55rem] font-semibold px-2.5 py-0.5 rounded-full ${BADGE[due.status]}`}>
                {due.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
