'use client';

import { useState } from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  DollarSign,
  Users,
  History,
  CheckCircle2,
  Clock,
  Search,
  Download,
  ShieldCheck,
  X,
  ArrowUpRight,
} from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

const mockTransactions = [
  {
    name: 'Babatunde Fashola',
    matric: 'CSC/2021/014',
    due: 'Departmental Dues 25/26',
    amount: '₦12,500',
    date: 'Just now',
    status: 'Paid',
    method: 'Online Card',
  },
  {
    name: 'Chioma Okeke',
    matric: 'CSC/2021/042',
    due: 'Departmental Dues 25/26',
    amount: '₦12,500',
    date: '14 mins ago',
    status: 'Paid',
    method: 'Bank Transfer',
  },
  {
    name: 'Emeka Nwosu',
    matric: 'CSC/2021/088',
    due: 'Departmental Dues 25/26',
    amount: '₦12,500',
    date: '1 hour ago',
    status: 'Paid',
    method: 'Online Card',
  },
  {
    name: 'Zainab Danjuma',
    matric: 'CSC/2021/105',
    due: 'Departmental Dues 25/26',
    amount: '₦12,500',
    date: '3 hours ago',
    status: 'Paid',
    method: 'USSD',
  },
];

export function ExecutiveDashboardSection() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTransactions = mockTransactions.filter(
    (tx) =>
      tx.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.matric.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section
      id="dashboard-showcase"
      className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-primary/5 rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* Header */}
      <ScrollReveal direction="up" className="text-center mb-16 md:mb-20 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold shadow-sm mb-4">
          <LayoutDashboard className="w-3.5 h-3.5" />
          One Dashboard
        </div>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-4 leading-tight text-balance">
          Know exactly what's happening <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-glow to-primary">
            with your collections.
          </span>
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Your Heightt dashboard gives you a clear view of your organisation's finances.
        </p>
      </ScrollReveal>

      {/* Framer SaaS Window Mockup */}
      <ScrollReveal delay={150} direction="up" className="mb-12">
        <div className="bg-white border border-border rounded-3xl p-4 sm:p-7 md:p-9 shadow-2xl relative overflow-hidden">
          {/* macOS Style Window Chrome Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 mb-7 border-b border-border gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-400 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
              </div>
              <div className="h-4 w-px bg-border hidden sm:block" />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-foreground text-sm sm:text-base">
                    NACOS Executive Portal
                  </h3>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">Session 2025/2026 · Faculty of Physical Sciences</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button className="px-3.5 py-2 rounded-xl bg-muted border border-border text-xs font-bold text-foreground flex items-center gap-1.5 hover:bg-border transition-colors cursor-pointer">
                <Download className="w-3.5 h-3.5 text-primary" /> Export Financial Report
              </button>
              <div className="text-xs font-semibold text-muted-foreground bg-muted/60 px-3 py-2 rounded-xl border border-border hidden md:flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Auto-Reconciled
              </div>
            </div>
          </div>

          {/* 3 Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
            {/* Total Expected */}
            <div className="bg-muted/40 border border-border rounded-2xl p-5 relative overflow-hidden transition-all hover:border-primary/40">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                Total Expected
              </p>
              <h4 className="text-2xl sm:text-3xl font-extrabold text-foreground font-display mb-1.5">
                ₦12,500,000
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                See how much should be collected from your members.
              </p>
            </div>

            {/* Total Collected (Elevated) */}
            <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-2 border-primary/30 rounded-2xl p-5 relative overflow-hidden shadow-sm">
              <div className="flex justify-between items-start mb-1">
                <p className="text-xs font-bold text-primary uppercase tracking-wider">
                  Total Collected
                </p>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" /> 78.8%
                </span>
              </div>
              <h4 className="text-2xl sm:text-3xl font-extrabold text-primary font-display mb-1.5">
                ₦9,850,000
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Know how much has actually been paid.
              </p>
            </div>

            {/* Outstanding Payments */}
            <div className="bg-muted/40 border border-border rounded-2xl p-5 relative overflow-hidden transition-all hover:border-amber-500/40">
              <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
                Outstanding Payments
              </p>
              <h4 className="text-2xl sm:text-3xl font-extrabold text-foreground font-display mb-1.5">
                ₦2,650,000
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                See how much remains unpaid.
              </p>
            </div>
          </div>

          {/* Member Payment Status & Searchable Transaction Ledger */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-bold text-foreground text-base flex items-center gap-2">
                  <History className="w-4 h-4 text-primary" /> Member Payment Status &amp; Ledger
                </h4>
                <p className="text-xs text-muted-foreground">
                  Keep a central record of payments made through your organisation.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filter by name or matric..."
                    className="bg-muted/70 border border-border rounded-xl pl-8 pr-3 py-2 text-xs text-foreground placeholder-muted-foreground outline-none w-48 sm:w-64 focus:border-primary transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="border border-border rounded-2xl overflow-hidden bg-white">
              <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-3.5 bg-muted/70 text-xs font-bold text-muted-foreground border-b border-border">
                <div className="col-span-4">MEMBER &amp; MATRIC</div>
                <div className="col-span-3">DUE TYPE</div>
                <div className="col-span-2">AMOUNT</div>
                <div className="col-span-2">TIMESTAMP</div>
                <div className="col-span-1 text-right">STATUS</div>
              </div>

              <div className="divide-y divide-border">
                {filteredTransactions.map((tx, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-4 sm:px-5 py-3.5 items-center hover:bg-muted/30 transition-colors text-xs sm:text-sm"
                  >
                    <div className="sm:col-span-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs flex-shrink-0">
                        {tx.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{tx.name}</p>
                        <p className="text-[11px] text-muted-foreground">{tx.matric}</p>
                      </div>
                    </div>

                    <div className="sm:col-span-3 text-muted-foreground text-xs">
                      {tx.due}
                    </div>

                    <div className="sm:col-span-2 font-extrabold text-foreground font-display">
                      {tx.amount}
                    </div>

                    <div className="sm:col-span-2 text-muted-foreground text-xs">
                      {tx.date}
                    </div>

                    <div className="sm:col-span-1 sm:text-right">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> {tx.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* 4 Framing Highlight Pill Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <ScrollReveal delay={50} className="h-full">
          <div className="p-6 rounded-3xl bg-white border border-border flex items-center gap-4 shadow-sm h-full">
            <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center flex-shrink-0">
              <X className="w-5 h-5" />
            </div>
            <span className="text-sm sm:text-base font-bold text-foreground leading-snug">
              No spreadsheet gymnastics.
            </span>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100} className="h-full">
          <div className="p-6 rounded-3xl bg-white border border-border flex items-center gap-4 shadow-sm h-full">
            <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center flex-shrink-0">
              <X className="w-5 h-5" />
            </div>
            <span className="text-sm sm:text-base font-bold text-foreground leading-snug">
              No searching through hundreds of screenshots.
            </span>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={150} className="h-full">
          <div className="p-6 rounded-3xl bg-white border border-border flex items-center gap-4 shadow-sm h-full">
            <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center flex-shrink-0">
              <X className="w-5 h-5" />
            </div>
            <span className="text-sm sm:text-base font-bold text-foreground leading-snug">
              No manually calculating totals.
            </span>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200} className="h-full">
          <div className="p-6 rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/25 flex items-center gap-4 shadow-sm h-full">
            <div className="w-11 h-11 rounded-2xl bg-primary text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-primary/20">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-sm sm:text-base font-extrabold text-foreground leading-snug">
              Just a clearer way to manage finances.
            </span>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
