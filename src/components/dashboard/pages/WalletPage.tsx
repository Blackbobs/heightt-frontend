'use client';

import React, { useState } from 'react';
import {
  ArrowDownLeft, ArrowUpRight, CreditCard, Banknote,
  Eye, EyeOff, ChevronRight, Clock, CheckCircle2, XCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const TRANSACTIONS = [
  { desc: 'Wallet Funding',      meta: 'Card ••42 · Nov 12, 2025',        amount: '+₦50,000', type: 'credit', status: 'success' },
  { desc: 'SUG Levy Payment',    meta: 'Student Union · Oct 28, 2025',    amount: '−₦5,000',  type: 'debit',  status: 'success' },
  { desc: 'Faculty Week Ticket', meta: 'Faculty of Science · Oct 22',     amount: '−₦2,500',  type: 'debit',  status: 'success' },
  { desc: 'ICT Conference Fee',  meta: 'NACOSS · Oct 20, 2025',           amount: '−₦8,000',  type: 'debit',  status: 'success' },
  { desc: 'Wallet Funding',      meta: 'Bank Transfer · Oct 15, 2025',    amount: '+₦30,000', type: 'credit', status: 'success' },
  { desc: 'Dept. Dues Payment',  meta: 'Comp. Sci. Dept · Oct 10, 2025', amount: '−₦25,000', type: 'debit',  status: 'pending' },
  { desc: 'Wallet Funding',      meta: 'Card ••17 · Sep 30, 2025',        amount: '+₦20,000', type: 'credit', status: 'success' },
  { desc: 'Sports Levy',         meta: 'Sports Directorate · Sep 20',     amount: '−₦3,000',  type: 'debit',  status: 'failed'  },
];

const FILTER_TABS = ['All', 'Credits', 'Debits'];

const StatusIcon = ({ status }: { status: string }) => {
  if (status === 'success') return <CheckCircle2 className="w-3 h-3 text-[#0f7b4a]" />;
  if (status === 'pending') return <Clock className="w-3 h-3 text-[#b86b1f]" />;
  return <XCircle className="w-3 h-3 text-[#c05a5a]" />;
};

export function WalletPage() {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [filter, setFilter] = useState('All');

  const filtered = TRANSACTIONS.filter((tx) => {
    if (filter === 'Credits') return tx.type === 'credit';
    if (filter === 'Debits') return tx.type === 'debit';
    return true;
  });

  return (
    <div className="space-y-5 pb-6">
      {/* Balance Hero */}
      <div className="bg-gradient-to-br from-[#1a5cff] to-[#0f4ad0] rounded-[22px] px-6 py-6 text-white relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-52 h-52 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-white/3 pointer-events-none" />

        <p className="text-[0.68rem] text-white/70 font-semibold uppercase tracking-widest mb-1.5">Total Balance</p>

        <div className="flex items-center gap-3 mb-1">
          <p className="text-[2.2rem] font-extrabold tracking-tight leading-none">
            {balanceVisible ? '₦184,500' : '₦ ••••••'}
          </p>
          <button
            onClick={() => setBalanceVisible(!balanceVisible)}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Toggle balance visibility"
          >
            {balanceVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="flex items-center gap-3 text-[0.68rem] text-white/60 mb-5">
          <span>Available <span className="text-white/80 font-semibold">₦122,300</span></span>
          <span className="w-px h-3 bg-white/20" />
          <span>Locked <span className="text-white/80 font-semibold">₦62,200</span></span>
        </div>

        <div className="flex gap-2.5 flex-wrap">
          <button className="flex items-center gap-1.5 bg-white text-[#1a5cff] rounded-full px-5 py-2.5 text-[0.75rem] font-semibold cursor-pointer border-none transition-all hover:bg-[#f0f4ff] active:scale-95 shadow-sm">
            <ArrowDownLeft className="w-3.5 h-3.5" />
            Fund Wallet
          </button>
          <button className="flex items-center gap-1.5 bg-white/15 text-white rounded-full px-5 py-2.5 text-[0.75rem] font-semibold cursor-pointer border border-white/20 transition-all hover:bg-white/25 active:scale-95">
            <ArrowUpRight className="w-3.5 h-3.5" />
            Withdraw
          </button>
        </div>
      </div>

      {/* Virtual Card */}
      <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-[20px] px-6 py-5 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-[#1a5cff]/20 blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#60a5fa]" />
            <span className="text-[0.7rem] font-semibold text-white/60 uppercase tracking-widest">Virtual Card</span>
          </div>
          <span className="text-[0.65rem] bg-[#0f7b4a]/20 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-semibold">Active</span>
        </div>
        <p className="text-[1.1rem] font-mono tracking-[0.25em] text-white/90 mb-4">4258  ••••  ••••  3847</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[0.55rem] text-white/40 uppercase tracking-widest mb-0.5">Card Holder</p>
            <p className="text-[0.8rem] font-semibold">Adaeze Okonkwo</p>
          </div>
          <div>
            <p className="text-[0.55rem] text-white/40 uppercase tracking-widest mb-0.5">Expires</p>
            <p className="text-[0.8rem] font-semibold">12/28</p>
          </div>
          <div>
            <Banknote className="w-8 h-8 text-[#1a5cff]/60" />
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total In', value: '+₦100,000', color: 'text-[#0f7b4a]' },
          { label: 'Total Out', value: '−₦43,500', color: 'text-[#c05a5a]' },
          { label: 'This Month', value: '₦56,500', color: 'text-[#1a5cff]' },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-[#e8ecf1] rounded-[14px] p-3.5 text-center">
            <p className={`text-[0.9rem] font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[0.6rem] text-[#7a8ba3] mt-0.5 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Transactions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[0.9rem] font-semibold text-[#1a1a2e]">Transactions</h3>
          <div className="flex bg-[#e8ecf1] rounded-full p-0.5 gap-0.5">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={cn(
                  'text-[0.65rem] font-semibold px-3 py-1.5 rounded-full transition-all border-none cursor-pointer',
                  filter === tab
                    ? 'bg-white text-[#1a5cff] shadow-sm'
                    : 'text-[#6b7a8f] bg-transparent hover:text-[#1a1a2e]'
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white border border-[#e8ecf1] rounded-[16px] divide-y divide-[#f0f2f5] overflow-hidden">
          {filtered.map((tx, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3.5 hover:bg-[#fafbff] transition-colors cursor-pointer group">
              <div className={cn(
                'w-9 h-9 rounded-full flex items-center justify-center text-[0.7rem] font-bold flex-shrink-0',
                tx.type === 'credit' ? 'bg-[#eef3ff] text-[#1a5cff]' : 'bg-[#fde8e8] text-[#c05a5a]'
              )}>
                {tx.type === 'credit' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[0.82rem] font-semibold text-[#1a1a2e] truncate">{tx.desc}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <StatusIcon status={tx.status} />
                  <p className="text-[0.6rem] text-[#7a8ba3]">{tx.meta}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn(
                  'text-[0.82rem] font-bold flex-shrink-0',
                  tx.type === 'credit' ? 'text-[#0f7b4a]' : 'text-[#c05a5a]'
                )}>
                  {tx.amount}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-[#c8d0db] group-hover:text-[#6b7a8f] transition-colors flex-shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
