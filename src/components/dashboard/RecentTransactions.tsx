'use client';

import React from 'react';
import { SectionTitle } from './SectionTitle';
import { cn } from '@/lib/utils';

interface Transaction {
  desc: string;
  meta: string;
  amount: string;
  type: 'credit' | 'debit';
}

const TRANSACTIONS: Transaction[] = [
  { desc: 'SUG Levy Payment',   meta: 'Student Union • Oct 28',   amount: '−₦5,000',  type: 'debit'  },
  { desc: 'Faculty Week Ticket',meta: 'Faculty of Science • Oct 22',amount: '−₦2,500',type: 'debit'  },
  { desc: 'ICT Conference Fee', meta: 'NACOSS • Oct 20',           amount: '−₦8,000', type: 'debit'  },
];

export function RecentTransactions() {
  return (
    <div className="mb-2">
      <SectionTitle title="Recent transactions" linkLabel="See all" />
      <div className="bg-white border border-[#E2E8F0] rounded-2xl divide-y divide-[#F1F5F9] overflow-hidden">
        {TRANSACTIONS.map((tx, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-4 py-3 hover:bg-[#F8FAFC] transition-colors cursor-pointer"
          >
            <div
              className={cn(
                'w-[34px] h-[34px] rounded-full flex items-center justify-center text-[0.7rem] font-bold flex-shrink-0',
                tx.type === 'credit' ? 'bg-[#EFF6FF] text-[#2563EB]' : 'bg-[#fde8e8] text-[#c05a5a]'
              )}
            >
              {tx.type === 'credit' ? '+' : '−'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[0.8rem] font-medium text-[#0B1020] truncate">{tx.desc}</p>
              <p className="text-[0.58rem] text-[#64748B] mt-0.5">{tx.meta}</p>
            </div>
            <span
              className={cn(
                'text-[0.8rem] font-bold flex-shrink-0',
                tx.type === 'credit' ? 'text-[#0f7b4a]' : 'text-[#c05a5a]'
              )}
            >
              {tx.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
