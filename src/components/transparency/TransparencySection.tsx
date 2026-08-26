'use client';

import {
  ShieldCheck,
  History,
  Users,
  Database,
  Sparkles,
} from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

const continuityPillars = [
  {
    icon: Users,
    role: 'For Current Executives',
    benefit: 'Easier management and instant automated records without manual reconciliation stress.',
    highlight: 'Zero Lost Receipts',
  },
  {
    icon: History,
    role: 'For Future Executives',
    benefit: 'Seamless financial continuity with complete historical records from past tenures.',
    highlight: '1-Click Handover',
  },
  {
    icon: ShieldCheck,
    role: 'For Students',
    benefit: 'Greater confidence and verifiable digital proof for how payments are recorded.',
    highlight: 'Full Confidence',
  },
];

export function TransparencySection() {
  return (
    <section
      id="transparency"
      className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative overflow-hidden"
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-0 w-[550px] h-[550px] bg-primary/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Header */}
      <ScrollReveal direction="up" className="text-center mb-16 md:mb-20 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold shadow-sm mb-4">
          <ShieldCheck className="w-3.5 h-3.5" />
          Better Records. Better Accountability.
        </div>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-4 leading-tight text-balance">
          Financial records shouldn't disappear <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-glow to-primary">
            when an administration leaves.
          </span>
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Student organisations change leadership regularly. Financial records shouldn't have to start from scratch every time they do.
        </p>
      </ScrollReveal>

      {/* Grid: 2 Column Layout with Framer Handover Archive Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        {/* Left Column: Mission Description & 3 Core Roles */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <ScrollReveal delay={50}>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Heightt creates a structured digital history of dues and payments, helping organisations maintain better records across administrations.
            </p>
          </ScrollReveal>

          <div className="space-y-4">
            {continuityPillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <ScrollReveal key={idx} delay={100 + idx * 80}>
                  <div className="p-6 rounded-3xl bg-white border border-border flex items-start gap-4 transition-all duration-300 hover:border-primary/40 hover:shadow-xl group">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white shadow-sm">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-foreground text-base group-hover:text-primary transition-colors">
                          {pillar.role}
                        </h4>
                        <span className="text-[10px] font-bold text-primary bg-primary/5 px-2.5 py-0.5 rounded-full border border-primary/10">
                          {pillar.highlight}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {pillar.benefit}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>

        {/* Right Column: Multi-Tenure Handover Ledger Card */}
        <ScrollReveal delay={150} direction="left" className="lg:col-span-6">
          <div className="bg-white border border-border rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-sm">Permanent Tenure Archive</h4>
                  <p className="text-xs text-muted-foreground">Immutable audit logs &amp; financial continuity</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-200">
                Verified Ledger
              </span>
            </div>

            {/* Timeline Nodes */}
            <div className="space-y-4 relative">
              {/* 2025/2026 Active */}
              <div className="p-4 sm:p-5 rounded-2xl bg-primary/5 border-2 border-primary/30 relative">
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-bold text-sm text-foreground">2025/2026 Administration</span>
                  </div>
                  <span className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                    Current Active Tenure
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">President: O. Adeleke · Treasurer: F. Ibrahim</p>
                <div className="flex justify-between text-xs pt-2 border-t border-primary/15 font-semibold text-foreground">
                  <span>Collections: ₦9,850,000 (78.8%)</span>
                  <span className="text-emerald-600">394 Verified Records</span>
                </div>
              </div>

              {/* 2024/2025 Handover Archive */}
              <div className="p-4 sm:p-5 rounded-2xl bg-muted/40 border border-border">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-bold text-sm text-foreground">2024/2025 Administration</span>
                  <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full border border-border">
                    Handover Complete
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">President: C. Eze · Treasurer: A. Bello</p>
                <div className="flex justify-between text-xs pt-2 border-t border-border text-muted-foreground">
                  <span>Total Collected: ₦11,200,000 (100%)</span>
                  <span>Full Audit PDF Archived</span>
                </div>
              </div>

              {/* 2023/2024 Handover Archive */}
              <div className="p-4 rounded-2xl bg-muted/20 border border-border/70 text-muted-foreground text-xs flex justify-between items-center">
                <div>
                  <span className="font-bold text-foreground">2023/2024 Administration</span>
                  <p className="text-[11px]">Total Collected: ₦9,400,000</p>
                </div>
                <span className="text-[10px] font-semibold text-primary">Archived &amp; Locked</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" /> Zero data loss across transitions
              </span>
              <span className="font-bold text-primary">100% Continuity</span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
