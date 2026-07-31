'use client';

import React, { useState } from 'react';
import { Receipt, Download, Search, CheckCircle2, ChevronRight, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReceiptItem {
  id: string;
  ref: string;
  title: string;
  org: string;
  amount: string;
  date: string;
  type: 'payment' | 'funding' | 'ticket';
}

const RECEIPTS: ReceiptItem[] = [
  { id: 'r1', ref: 'CPY-2025-11120', title: 'Wallet Funding',         org: 'Card ••42',              amount: '₦50,000', date: 'Nov 12, 2025', type: 'funding'  },
  { id: 'r2', ref: 'CPY-2025-10280', title: 'SUG Levy Payment',       org: 'Student Union Govt',     amount: '₦5,000',  date: 'Oct 28, 2025', type: 'payment'  },
  { id: 'r3', ref: 'CPY-2025-10220', title: 'Faculty Week Ticket',    org: 'Faculty of Science',     amount: '₦2,500',  date: 'Oct 22, 2025', type: 'ticket'   },
  { id: 'r4', ref: 'CPY-2025-10200', title: 'ICT Conference Fee',     org: 'NACOSS',                 amount: '₦8,000',  date: 'Oct 20, 2025', type: 'payment'  },
  { id: 'r5', ref: 'CPY-2025-10150', title: 'Wallet Funding',         org: 'Bank Transfer',          amount: '₦30,000', date: 'Oct 15, 2025', type: 'funding'  },
  { id: 'r6', ref: 'CPY-2025-09300', title: 'Wallet Funding',         org: 'Card ••17',              amount: '₦20,000', date: 'Sep 30, 2025', type: 'funding'  },
];

const TYPE_COLOR: Record<string, string> = {
  payment: 'bg-[#fde8e8] text-[#c05a5a]',
  funding:  'bg-[#e6f7f0] text-[#0f7b4a]',
  ticket:   'bg-[#eef3ff] text-[#1a5cff]',
};

const TYPE_LABELS: Record<string, string> = {
  payment: 'Payment',
  funding: 'Funding',
  ticket:  'Ticket',
};

const TABS = ['All', 'Payments', 'Funding', 'Tickets'];

export function ReceiptsPage() {
  const [tab, setTab] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = RECEIPTS.filter((r) => {
    const tabMap: Record<string, string> = { Payments: 'payment', Funding: 'funding', Tickets: 'ticket' };
    const tabMatch = tab === 'All' || r.type === tabMap[tab];
    const searchMatch = !search ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.ref.toLowerCase().includes(search.toLowerCase()) ||
      r.org.toLowerCase().includes(search.toLowerCase());
    return tabMatch && searchMatch;
  });

  return (
    <div className="space-y-5 pb-6">
      {/* Header stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-[#e8ecf1] rounded-[16px] px-5 py-4">
          <div className="flex items-center gap-2 mb-2">
            <Receipt className="w-4 h-4 text-[#1a5cff]" />
            <span className="text-[0.65rem] font-semibold text-[#7a8ba3] uppercase tracking-wide">Total Receipts</span>
          </div>
          <p className="text-[1.5rem] font-extrabold text-[#1a1a2e]">{RECEIPTS.length}</p>
          <p className="text-[0.62rem] text-[#7a8ba3]">All time</p>
        </div>
        <div className="bg-white border border-[#e8ecf1] rounded-[16px] px-5 py-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-[#0f7b4a]" />
            <span className="text-[0.65rem] font-semibold text-[#7a8ba3] uppercase tracking-wide">Total Paid</span>
          </div>
          <p className="text-[1.5rem] font-extrabold text-[#1a1a2e]">₦115,500</p>
          <p className="text-[0.62rem] text-[#7a8ba3]">All time</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7a8ba3]" />
        <input
          type="text"
          placeholder="Search receipts or reference…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-[#e8ecf1] rounded-[12px] pl-10 pr-4 py-3 text-[0.82rem] text-[#1a1a2e] placeholder-[#b0bac8] outline-none focus:border-[#1a5cff] transition-colors"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'flex-shrink-0 text-[0.72rem] font-semibold px-4 py-2 rounded-full border-none cursor-pointer transition-all',
              tab === t
                ? 'bg-[#1a5cff] text-white'
                : 'bg-white border border-[#e8ecf1] text-[#6b7a8f] hover:border-[#1a5cff] hover:text-[#1a5cff]'
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Receipt list */}
      <div className="bg-white border border-[#e8ecf1] rounded-[16px] divide-y divide-[#f0f2f5] overflow-hidden">
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <FileText className="w-8 h-8 text-[#c8d0db] mb-2" />
            <p className="text-[0.82rem] font-medium text-[#6b7a8f]">No receipts found</p>
          </div>
        )}
        {filtered.map((r) => (
          <div key={r.id} className="flex items-center gap-3 px-4 py-4 hover:bg-[#fafbff] transition-colors cursor-pointer group">
            <div className="w-9 h-9 rounded-[10px] bg-[#eef3ff] flex items-center justify-center flex-shrink-0">
              <FileText className="w-4 h-4 text-[#1a5cff]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[0.82rem] font-semibold text-[#1a1a2e] truncate">{r.title}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={cn('text-[0.55rem] font-semibold px-2 py-0.5 rounded-full', TYPE_COLOR[r.type])}>
                  {TYPE_LABELS[r.type]}
                </span>
                <span className="text-[0.58rem] text-[#7a8ba3]">{r.ref} · {r.date}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[0.82rem] font-bold text-[#1a1a2e] flex-shrink-0">{r.amount}</span>
              <button
                className="w-7 h-7 rounded-full bg-[#f0f2f5] flex items-center justify-center border-none cursor-pointer hover:bg-[#eef3ff] hover:text-[#1a5cff] transition-colors"
                onClick={(e) => e.stopPropagation()}
                aria-label={`Download receipt ${r.ref}`}
              >
                <Download className="w-3 h-3 text-[#6b7a8f]" />
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-[#c8d0db] group-hover:text-[#6b7a8f] transition-colors flex-shrink-0" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
