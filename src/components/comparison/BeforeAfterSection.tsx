'use client';

import { XCircle, CheckCircle2, Sparkles, ArrowRight, Zap } from 'lucide-react';
import Link from 'next/link';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

const withoutItems = [
  'Bank transfers',
  'Payment screenshots',
  'WhatsApp confirmations',
  'Manually updated spreadsheets',
  'Searching for payment records',
  'Constant "have you paid?" messages',
  'Hours spent reconciling transactions',
  'Messy administration handovers',
];

const withItems = [
  'One place to collect dues',
  'Automatic payment records',
  'Real-time payment tracking',
  'Organised member records',
  'Clear outstanding balances',
  'Searchable transaction history',
  'Simpler reconciliation',
  'Better financial continuity',
];

export function BeforeAfterSection() {
  return (
    <section
      id="why-heightt"
      className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative overflow-hidden"
    >
      {/* Background Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Header */}
      <ScrollReveal direction="up" className="text-center mb-16 md:mb-20 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold shadow-sm mb-4">
          <Zap className="w-3.5 h-3.5" />
          Why Heightt
        </div>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-4 leading-tight text-balance">
          From manual collection to <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-glow to-primary">
            organised finance.
          </span>
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          See the direct transformation when your student organisation switches to Heightt.
        </p>
      </ScrollReveal>

      {/* Side-by-Side Framer Contrast Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch relative z-10">
        {/* Without Heightt Card */}
        <ScrollReveal delay={100} direction="right" className="h-full">
          <div className="bg-white border border-rose-200 rounded-3xl p-6 sm:p-8 md:p-10 relative overflow-hidden flex flex-col justify-between shadow-[0_4px_20px_rgba(244,63,94,0.06)] h-full">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-rose-500/50" />

            <div>
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-border">
                <div>
                  <span className="text-xs font-bold text-rose-600 uppercase tracking-wider bg-rose-50 border border-rose-200 px-3 py-1 rounded-full">
                    The Old Way
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground mt-2.5 font-display">
                    Without Heightt
                  </h3>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <XCircle className="w-6 h-6" />
                </div>
              </div>

              <ul className="space-y-3 list-none p-0">
                {withoutItems.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-3 text-sm sm:text-base text-muted-foreground bg-rose-50/40 p-3 rounded-2xl border border-rose-100"
                  >
                    <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                    <span className="line-through decoration-rose-400/60 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-border text-xs font-bold text-rose-600/80 text-center">
              Prone to human error, missed payments &amp; missing handover logs
            </div>
          </div>
        </ScrollReveal>

        {/* With Heightt Card (High Elevation & Glow) */}
        <ScrollReveal delay={150} direction="left" className="h-full">
          <div className="bg-white border-2 border-primary rounded-3xl p-6 sm:p-8 md:p-10 relative overflow-hidden flex flex-col justify-between shadow-[0_20px_50px_rgba(26,92,255,0.15)] h-full">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary via-primary-glow to-primary" />

            <div>
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-border">
                <div>
                  <span className="text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 border border-primary/20 px-3 py-1 rounded-full flex items-center gap-1.5 w-fit">
                    <Sparkles className="w-3.5 h-3.5" /> Modern Standard
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground mt-2.5 font-display">
                    With Heightt
                  </h3>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/30">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>

              <ul className="space-y-3 list-none p-0">
                {withItems.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-3 text-sm sm:text-base text-foreground font-semibold bg-primary/5 hover:bg-primary/10 p-3 rounded-2xl border border-primary/15 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-border flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                ✓ Automated, verifiable &amp; stress-free
              </span>
              <Link
                href="/signup"
                className="inline-flex items-center text-xs sm:text-sm font-bold text-primary hover:text-[oklch(36%_.18_265)] group"
              >
                Get started
                <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
