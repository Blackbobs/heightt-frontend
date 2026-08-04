'use client';

import { useRef } from 'react';
import {
  Sparkles,
  HandCoins,
  Store,
  Users,
  GraduationCap,
  Landmark,
  CreditCard,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

const roadmapFeatures = [
  {
    icon: HandCoins,
    title: 'Student Loans',
    description: 'Campus-backed micro-loans for emergencies.',
    status: 'In development',
    statusDot: 'bg-primary animate-pulse',
    isFullWidth: false,
  },
  {
    icon: Store,
    title: 'Marketplace',
    description: 'Buy & sell textbooks, gowns, and gadgets in-app.',
    status: 'Planning',
    statusDot: 'bg-amber-500',
    isFullWidth: false,
  },
  {
    icon: Users,
    title: 'Group Savings (Esusu)',
    description: 'Pool funds with classmates for shared goals.',
    status: 'In development',
    statusDot: 'bg-primary animate-pulse',
    isFullWidth: false,
  },
  {
    icon: GraduationCap,
    title: 'Scholarship Wallets',
    description: 'Restricted wallets funded by sponsors & alumni.',
    status: 'Coming next',
    statusDot: 'bg-emerald-500',
    isFullWidth: true,
  },
  {
    icon: Landmark,
    title: 'Bursary Integrations',
    description: 'Direct deposits from school bursary.',
    status: 'Planning',
    statusDot: 'bg-amber-500',
    isFullWidth: false,
  },
  {
    icon: CreditCard,
    title: 'Cards & Tap-to-Pay',
    description: 'A Heightt card to spend at campus vendors.',
    status: 'In development',
    statusDot: 'bg-primary animate-pulse',
    isFullWidth: false,
  },
];

export function RoadmapSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!sectionRef.current || window.innerWidth <= 768) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    cardsRef.current.forEach((card) => {
      if (!card) return;
      const rotateX = y * 5;
      const rotateY = x * -5;
      card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
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
      id="roadmap"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative overflow-hidden"
    >
      {/* Header */}
      <div className="text-center mb-14 md:mb-18 relative z-10">
        <Badge className="mb-4 inline-flex items-center gap-2 cursor-default hover:bg-primary hover:text-white transition-all duration-300">
          <Sparkles className="w-4 h-4 text-primary group-hover:text-white" />
          Coming Soon
        </Badge>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-4 leading-tight">
          The roadmap <br className="hidden sm:inline" />
          <span className="text-primary relative inline-block">
            our students asked for.
            <span className="absolute bottom-1 left-0 right-0 h-1.5 md:h-2 bg-primary/15 rounded -z-10" />
          </span>
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Features we're building next — all based on student feedback.
        </p>
      </div>

      {/* Roadmap Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 relative z-10">
        {roadmapFeatures.map((feature, index) => {
          const Icon = feature.icon;

          if (feature.isFullWidth) {
            return (
              <div
                key={index}
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
                className="roadmap-card col-span-1 sm:col-span-2 lg:col-span-3 bg-card border border-border rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all duration-500 hover:shadow-2xl hover:border-primary/40 group"
              >
                <div className="flex items-start md:items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-muted border border-border flex items-center justify-center flex-shrink-0 transition-all duration-400 group-hover:bg-primary group-hover:text-white group-hover:scale-105 group-hover:-rotate-3 shadow-sm">
                    <Icon className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-muted px-3 py-1 rounded-full border border-border group-hover:bg-primary group-hover:text-white transition-all">
                        Soon
                      </span>
                    </div>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground pt-3 md:pt-0 border-t md:border-t-0 border-border w-full md:w-auto">
                  <span className={`w-2.5 h-2.5 rounded-full ${feature.statusDot}`} />
                  <span>{feature.status}</span>
                </div>
              </div>
            );
          }

          return (
            <div
              key={index}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              className="roadmap-card bg-card border border-border rounded-2xl p-6 relative overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:border-primary/40 group flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-muted border border-border flex items-center justify-center transition-all duration-400 group-hover:bg-primary group-hover:text-white group-hover:scale-105 group-hover:-rotate-3 shadow-sm">
                    <Icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-muted px-3 py-1 rounded-full border border-border group-hover:bg-primary group-hover:text-white transition-all">
                    Soon
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground pt-4 mt-4 border-t border-border">
                <span className={`w-2.5 h-2.5 rounded-full ${feature.statusDot}`} />
                <span>{feature.status}</span>
              </div>

              {/* Hover top border gradient */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary-glow to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          );
        })}
      </div>
    </section>
  );
}
