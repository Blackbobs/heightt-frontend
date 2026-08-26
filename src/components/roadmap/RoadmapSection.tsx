'use client';

import {
  Sparkles,
  Wallet,
  Ticket,
  FileText,
  Megaphone,
  Users2,
  Store,
  GraduationCap,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

const upcomingFeatures = [
  {
    icon: Wallet,
    title: 'Wallets & Savings',
    description: 'Fund your Heightt wallet and save gradually towards upcoming campus expenses.',
    status: 'Coming Soon',
    badgeClass: 'bg-primary/10 text-primary border-primary/20',
    dotClass: 'bg-primary animate-pulse',
  },
  {
    icon: Ticket,
    title: 'Event Tickets',
    description: 'Create campus events, sell tickets and verify attendees digitally.',
    status: 'Coming Soon',
    badgeClass: 'bg-primary/10 text-primary border-primary/20',
    dotClass: 'bg-primary animate-pulse',
  },
  {
    icon: FileText,
    title: 'Financial Reporting',
    description: 'Generate and export structured financial reports for your organisation.',
    status: 'Coming Soon',
    badgeClass: 'bg-primary/10 text-primary border-primary/20',
    dotClass: 'bg-primary animate-pulse',
  },
  {
    icon: Megaphone,
    title: 'Announcements',
    description: 'Give organisations a central way to communicate important updates to their members.',
    status: 'Coming Soon',
    badgeClass: 'bg-primary/10 text-primary border-primary/20',
    dotClass: 'bg-primary animate-pulse',
  },
  {
    icon: Users2,
    title: 'Group Savings',
    description: 'Save towards shared goals with friends, classmates and student communities.',
    status: 'Planned',
    badgeClass: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
    dotClass: 'bg-amber-500',
  },
  {
    icon: Store,
    title: 'Marketplace',
    description: 'A campus marketplace for textbooks, gadgets and other student essentials.',
    status: 'Planned',
    badgeClass: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
    dotClass: 'bg-amber-500',
  },
  {
    icon: GraduationCap,
    title: 'Scholarships & Sponsored Funds',
    description: 'Infrastructure for sponsors and organisations to distribute funds directly to eligible students.',
    status: 'Planned',
    badgeClass: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
    dotClass: 'bg-amber-500',
  },
  {
    icon: Layers,
    title: 'More Financial Tools',
    description: 'We\'re building more ways for students and student organisations to manage money across campus.',
    status: 'On the Roadmap',
    badgeClass: 'bg-muted text-muted-foreground border-border',
    dotClass: 'bg-muted-foreground',
  },
];

export function RoadmapSection() {
  return (
    <section
      id="coming-soon"
      className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute top-1/3 left-1/3 w-[600px] h-[400px] bg-primary/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Header */}
      <ScrollReveal direction="up" className="text-center mb-16 md:mb-20 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold shadow-sm mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          What's Next
        </div>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-4 leading-tight text-balance">
          Dues are only <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-glow to-primary">
            the beginning.
          </span>
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          We're starting with one of the biggest problems student organisations face: collecting and managing payments. But we're building Heightt into a broader financial infrastructure for student communities.
        </p>
      </ScrollReveal>

      {/* Grid of 8 Features in Framer Bento Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {upcomingFeatures.map((item, index) => {
          const Icon = item.icon;

          return (
            <ScrollReveal key={index} delay={index * 60} className="h-full">
              <div className="bg-white border border-border rounded-3xl p-6 relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-2xl hover:border-primary/40 hover:-translate-y-1.5 transition-all duration-300 group flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-muted border border-border flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white shadow-sm">
                      <Icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                    </div>

                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${item.badgeClass}`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Status footer with colored live dot */}
                <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground pt-5 mt-5 border-t border-border/80">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${item.dotClass}`} />
                    <span>{item.status}</span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
