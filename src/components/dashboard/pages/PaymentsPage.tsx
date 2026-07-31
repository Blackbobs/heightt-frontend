'use client';

import React, { useState } from 'react';
import { CreditCard, AlertCircle, CheckCircle2, Clock, ChevronRight, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

type Status = 'paid' | 'outstanding' | 'pending';

interface Payment {
  id: string;
  title: string;
  org: string;
  amount: number;
  deadline: string;
  status: Status;
  category: string;
}

const PAYMENTS: Payment[] = [
  { id: 'p1', title: 'Departmental Dues 2025/26',   org: 'Comp. Sci. Dept',     amount: 25000, deadline: 'Dec 15, 2025', status: 'outstanding', category: 'Dues'   },
  { id: 'p2', title: 'Faculty Dues 2025/26',         org: 'Faculty of Science',  amount: 15000, deadline: 'Dec 20, 2025', status: 'pending',     category: 'Dues'   },
  { id: 'p3', title: 'SUG Levy 2025/26',             org: 'Student Union Govt',  amount: 5000,  deadline: 'Jan 10, 2026', status: 'outstanding', category: 'Levy'   },
  { id: 'p4', title: 'Library Card Renewal',         org: 'University Library',  amount: 2000,  deadline: 'Nov 30, 2025', status: 'paid',        category: 'Others' },
  { id: 'p5', title: 'ICT Conference Registration',  org: 'NACOSS',              amount: 8000,  deadline: 'Oct 20, 2025', status: 'paid',        category: 'Events' },
  { id: 'p6', title: 'Faculty Week Ticket',          org: 'Faculty of Science',  amount: 5000,  deadline: 'Nov 30, 2025', status: 'pending',     category: 'Events' },
  { id: 'p7', title: 'Lab Consumables Fee',          org: 'Comp. Sci. Dept',     amount: 4500,  deadline: 'Dec 5, 2025',  status: 'outstanding', category: 'Dues'   },
];

const STATUS_CONFIG: Record<Status, { label: string; icon: React.ReactNode; badge: string; rowBg: string }> = {
  outstanding: {
    label: 'Outstanding',
    icon: <AlertCircle className="w-3 h-3" />,
    badge: 'bg-[#fde8e8] text-[#c05a5a]',
    rowBg: '',
  },
  pending: {
    label: 'Pending',
    icon: <Clock className="w-3 h-3" />,
    badge: 'bg-[#fff4e6] text-[#b86b1f]',
    rowBg: '',
  },
  paid: {
    label: 'Paid',
    icon: <CheckCircle2 className="w-3 h-3" />,
    badge: 'bg-[#e6f7f0] text-[#0f7b4a]',
    rowBg: '',
  },
};

const TABS = ['All', 'Dues', 'Events', 'Others'];

export function PaymentsPage() {
  const [tab, setTab] = useState('All');
  const [search, setSearch] = useState('');

  const totalOutstanding = PAYMENTS.filter(p => p.status !== 'paid').reduce((a, p) => a + p.amount, 0);

  const filtered = PAYMENTS.filter((p) => {
    const tabMatch = tab === 'All' || p.category === tab;
    const searchMatch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.org.toLowerCase().includes(search.toLowerCase());
    return tabMatch && searchMatch;
  });

  return (
    <div className="space-y-5 pb-6">
      {/* Alert banner */}
      <div className="bg-[#fff8ec] border border-[#f5d08a] rounded-[16px] px-4 py-4 flex items-start gap-3">
        <div className="w-8 h-8 rounded-[8px] bg-amber-100 flex items-center justify-center flex-shrink-0">
          <AlertCircle className="w-4 h-4 text-amber-600" />
        </div>
        <div>
          <p className="text-[0.82rem] font-semibold text-[#7a4a00]">You have unpaid dues</p>
          <p className="text-[0.7rem] text-[#a06020] mt-0.5">
            ₦{totalOutstanding.toLocaleString()} total outstanding across 3 payments. Some have upcoming deadlines.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Paid',        value: PAYMENTS.filter(p => p.status === 'paid').length,        color: 'text-[#0f7b4a]' },
          { label: 'Outstanding', value: PAYMENTS.filter(p => p.status === 'outstanding').length,  color: 'text-[#c05a5a]' },
          { label: 'Pending',     value: PAYMENTS.filter(p => p.status === 'pending').length,      color: 'text-[#b86b1f]' },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-[#e8ecf1] rounded-[14px] p-3.5 text-center">
            <p className={`text-[1.2rem] font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-[0.6rem] text-[#7a8ba3] mt-0.5 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7a8ba3]" />
        <input
          type="text"
          placeholder="Search payments…"
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

      {/* Payment list */}
      <div className="bg-white border border-[#e8ecf1] rounded-[16px] divide-y divide-[#f0f2f5] overflow-hidden">
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <CreditCard className="w-8 h-8 text-[#c8d0db] mb-2" />
            <p className="text-[0.82rem] font-medium text-[#6b7a8f]">No payments found</p>
          </div>
        )}
        {filtered.map((p) => {
          const cfg = STATUS_CONFIG[p.status];
          return (
            <div key={p.id} className="flex items-center gap-3 px-4 py-4 hover:bg-[#fafbff] transition-colors cursor-pointer group">
              <div className="w-9 h-9 rounded-[10px] bg-[#eef3ff] flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-4 h-4 text-[#1a5cff]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[0.82rem] font-semibold text-[#1a1a2e] truncate">{p.title}</p>
                <p className="text-[0.6rem] text-[#7a8ba3] mt-0.5">{p.org} · {p.deadline}</p>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <span className="text-[0.82rem] font-bold text-[#1a1a2e]">₦{p.amount.toLocaleString()}</span>
                <span className={cn('inline-flex items-center gap-1 text-[0.58rem] font-semibold px-2 py-0.5 rounded-full', cfg.badge)}>
                  {cfg.icon}
                  {cfg.label}
                </span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#c8d0db] group-hover:text-[#6b7a8f] transition-colors flex-shrink-0 ml-1" />
            </div>
          );
        })}
      </div>

      {/* Pay all outstanding CTA */}
      {PAYMENTS.some(p => p.status === 'outstanding') && (
        <button className="w-full bg-gradient-to-r from-[#1a5cff] to-[#4a7aff] text-white rounded-[14px] py-3.5 text-[0.85rem] font-bold border-none cursor-pointer hover:from-[#0f4ad0] hover:to-[#3a5be8] active:scale-[0.98] transition-all shadow-[0_4px_16px_rgba(26,92,255,0.25)]">
          Pay All Outstanding — ₦{PAYMENTS.filter(p => p.status === 'outstanding').reduce((a, p) => a + p.amount, 0).toLocaleString()}
        </button>
      )}
    </div>
  );
}
