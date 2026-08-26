'use client';

import Link from 'next/link';
import {
  Briefcase,
  PlusCircle,
  Activity,
  Users,
  FolderLock,
  FileCheck2,
  TrendingDown,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

const executiveFeatures = [
  {
    icon: PlusCircle,
    title: 'Create & Manage Dues',
    description:
      'Set the amount, provide the details and make the due available to members of your organisation.',
    badge: '1-Min Setup',
    stat: 'Custom levels & departments',
  },
  {
    icon: Activity,
    title: 'Track Payments Automatically',
    description:
      'See payments as they happen instead of manually updating a spreadsheet every time someone pays.',
    badge: 'Real-time Webhooks',
    stat: 'Zero delay confirmations',
  },
  {
    icon: Users,
    title: 'Know Who Has Paid',
    description:
      'Get a clear view of paid and outstanding members without searching through chats, screenshots or bank statements.',
    badge: 'Live Member Audit',
    stat: '1-click filter by matric',
  },
  {
    icon: FolderLock,
    title: 'Manage Your Members',
    description:
      'Keep your organisation\'s members and their payment records organised in one place.',
    badge: 'Central Directory',
    stat: 'Department-wide roster',
  },
  {
    icon: FileCheck2,
    title: 'Keep Better Financial Records',
    description:
      'Build a reliable digital payment history that makes reconciliation and financial reporting easier.',
    badge: 'Tamper-evident',
    stat: 'Audit-ready history',
  },
  {
    icon: TrendingDown,
    title: 'Reduce Administrative Work',
    description:
      'Spend less time verifying payments and maintaining records — and more time actually running your organisation.',
    badge: '90% Less Admin',
    stat: 'Save 15+ hours weekly',
  },
];

export function ForExecutivesSection() {
  return (
    <section
      id="for-executives"
      className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative overflow-hidden"
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 right-0 w-[550px] h-[550px] bg-primary/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Header */}
      <ScrollReveal direction="up" className="text-center mb-16 md:mb-20 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold shadow-sm mb-4">
          <Briefcase className="w-3.5 h-3.5" />
          Built for Executives
        </div>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-4 leading-tight text-balance">
          Your tenure shouldn't be spent <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-glow to-primary">
            updating spreadsheets.
          </span>
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Heightt gives student executives a central dashboard for managing dues and keeping track of payments. Create a due once and let Heightt handle the records as students pay.
        </p>
      </ScrollReveal>

      {/* 6 Bento Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 relative z-10">
        {executiveFeatures.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <ScrollReveal key={index} delay={index * 70} className="h-full">
              <div className="bg-white border border-border rounded-3xl p-7 relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-2xl hover:border-primary/40 hover:-translate-y-1.5 transition-all duration-300 group flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-13 h-13 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white shadow-sm">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold text-primary bg-primary/5 border border-primary/15 px-3 py-1 rounded-full">
                      {feature.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-2.5 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border/80 flex items-center justify-between text-xs font-semibold text-muted-foreground">
                  <span className="text-foreground">{feature.stat}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>

      {/* Onboarding Callout Banner */}
      <ScrollReveal delay={200} className="mt-14 relative z-10">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-foreground via-[oklch(18%_.02_260)] to-foreground text-white border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col gap-2.5 text-center md:text-left relative z-10">
            <div className="inline-flex items-center justify-center md:justify-start gap-2 text-primary-glow font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" /> Ready for your departmental or faculty team
            </div>
            <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">
              Set up your organisation in under 2 minutes.
            </h3>
            <p className="text-sm sm:text-base text-white/70 max-w-xl">
              Invite fellow executives, publish your first due, and enjoy transparent, automated collections.
            </p>
          </div>

          <Button
            variant="primary"
            size="lg"
            className="bg-primary hover:bg-primary-glow text-white font-bold rounded-2xl px-9 py-4 shadow-[0_12px_32px_rgba(26,92,255,0.4)] hover:scale-105 transition-all flex-shrink-0 relative z-10 cursor-pointer"
            asChild
          >
            <Link href="/signup">
              Onboard Your Organisation
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </ScrollReveal>
    </section>
  );
}
