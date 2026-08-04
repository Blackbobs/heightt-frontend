'use client';

import { useRef } from 'react';
import {
  GraduationCap,
  Wallet,
  Target,
  Ticket,
  Megaphone,
  Receipt,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

const studentFeatures = [
  {
    number: '01',
    icon: Wallet,
    title: 'Smart Wallet',
    description:
      'Fund once. Pay dues, buy tickets, settle anything inside Heightt instantly.',
    isFullWidth: false,
  },
  {
    number: '02',
    icon: Target,
    title: 'Goal-based Savings',
    description:
      'Lock funds towards departmental dues, faculty fees, or a graduation gown.',
    isFullWidth: false,
  },
  {
    number: '03',
    icon: Ticket,
    title: 'Digital Event Tickets',
    description:
      'Buy gala and conference tickets. Get a QR ticket you can flash at the door.',
    isFullWidth: false,
  },
  {
    number: '04',
    icon: Megaphone,
    title: 'Campus Announcements',
    description:
      'Department, faculty and union updates — never miss a deadline again.',
    isFullWidth: false,
  },
  {
    number: '05',
    icon: Receipt,
    title: 'Receipts & History',
    description:
      'Every payment gets a verifiable digital receipt you can download anytime.',
    isFullWidth: false,
  },
  {
    number: '06',
    icon: ShieldCheck,
    title: 'Refund Protection',
    description:
      'If an event is cancelled, refunds flow straight back to your wallet. No stress, no delays.',
    isFullWidth: true,
  },
];

export function ForStudentsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    cardsRef.current.forEach((card, index) => {
      if (!card || card.classList.contains('feature-full')) return;
      const speed = 2 + (index % 3) * 0.5;
      const rotateX = y * speed * 0.5;
      const rotateY = x * speed * -0.5;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });
  };

  const handleMouseLeave = () => {
    cardsRef.current.forEach((card) => {
      if (!card) return;
      card.style.transform = '';
    });
  };

  return (
    <section
      ref={sectionRef}
      id="features"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative overflow-hidden"
    >
      {/* Header */}
      <div className="text-center mb-14 md:mb-20 relative z-10">
        <Badge className="mb-5 inline-flex items-center gap-2 cursor-default hover:bg-primary hover:text-white transition-all duration-300">
          <GraduationCap className="w-4 h-4 text-primary group-hover:text-white" />
          For Students
        </Badge>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-4 leading-tight">
          A finance companion <br className="hidden sm:inline" />
          <span className="text-primary relative inline-block">
            built for campus life.
            <span className="absolute bottom-1 left-0 right-0 h-1.5 md:h-2 bg-primary/15 rounded -z-10" />
          </span>
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Everything you need to manage your money, pay dues, buy tickets, and
          stay connected — all in one place.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 relative z-10">
        {studentFeatures.map((feature, index) => {
          const Icon = feature.icon;

          if (feature.isFullWidth) {
            return (
              <div
                key={index}
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
                className="feature-full col-span-1 md:col-span-2 lg:col-span-3 bg-card border border-border rounded-2xl p-6 sm:p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center gap-6 sm:gap-8 transition-all duration-500 hover:shadow-2xl hover:border-primary/40 group"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-3 shadow-lg shadow-primary/20">
                  <Icon className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <ArrowRight className="w-5 h-5 text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </div>
                  <p className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl">
                    {feature.description}
                  </p>
                </div>
                <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-border group-hover:text-primary/40 transition-colors font-display self-end md:self-center">
                  {feature.number}
                </span>
              </div>
            );
          }

          return (
            <div
              key={index}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              className="feature-card bg-card border border-border rounded-2xl p-6 sm:p-8 relative overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-primary/40 group flex flex-col justify-between"
            >
              {/* Number tag */}
              <span className="absolute top-4 right-5 text-xs sm:text-sm font-bold text-muted-foreground/50 group-hover:text-primary transition-colors font-display">
                {feature.number}
              </span>

              <div>
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-muted border border-border flex items-center justify-center mb-6 transition-all duration-500 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-105 group-hover:-rotate-3 shadow-sm group-hover:shadow-lg group-hover:shadow-primary/20">
                  <Icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 flex items-center gap-2 group-hover:text-primary transition-colors">
                  {feature.title}
                  <ArrowRight className="w-4 h-4 text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </h3>

                {/* Description */}
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Hover top border gradient glow */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary-glow to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          );
        })}
      </div>
    </section>
  );
}
