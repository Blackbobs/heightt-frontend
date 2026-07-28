'use client';

import { useRef } from 'react';
import {
  Route,
  UserPlus,
  Coins,
  CreditCard,
  Building2,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

const steps = [
  {
    number: '01',
    icon: UserPlus,
    title: 'Create your account',
    description:
      'Sign up as a student or onboard your organization in under 2 minutes.',
  },
  {
    number: '02',
    icon: Coins,
    title: 'Fund or publish',
    description:
      'Students fund their wallet. Orgs publish dues, events, and announcements.',
  },
  {
    number: '03',
    icon: CreditCard,
    title: 'Pay, save, attend',
    description:
      'Settle dues in installments, buy tickets, get digital receipts — instantly.',
  },
  {
    number: '04',
    icon: Building2,
    title: 'Settle to bank',
    description:
      'Organizations request withdrawals to their verified bank accounts.',
  },
];

export function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!sectionRef.current || window.innerWidth <= 768) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    cardsRef.current.forEach((card, index) => {
      if (!card) return;
      const speed = 1.5 + (index % 3) * 0.3;
      const rotateX = y * speed * 0.3;
      const rotateY = x * speed * -0.3;
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
      id="how-it-works"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative overflow-hidden"
    >
      {/* Header */}
      <div className="text-center mb-16 md:mb-20 relative z-10">
        <Badge className="mb-5 inline-flex items-center gap-2 cursor-default hover:bg-primary hover:text-white transition-all duration-300">
          <Route className="w-4 h-4 text-primary group-hover:text-white" />
          How It Works
        </Badge>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-4 leading-tight">
          From sign-up to settlement <br className="hidden sm:inline" />
          <span className="text-primary relative inline-block">
            in four steps.
            <span className="absolute bottom-1 left-0 right-0 h-1.5 md:h-2 bg-primary/15 rounded -z-10" />
          </span>
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Get started in minutes. Here's how the Heightt ecosystem works for everyone.
        </p>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 relative z-10">
        {/* Desktop Connector Line */}
        <div className="hidden lg:block absolute top-[56px] left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-primary via-primary-glow to-border opacity-40 -z-10" />

        {steps.map((step, index) => {
          const Icon = step.icon;

          return (
            <div
              key={index}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              className="step-card bg-card border border-border rounded-2xl p-6 md:p-8 text-center relative overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-primary/40 group flex flex-col items-center"
            >
              {/* Step Circle (Number / Icon Morph) */}
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-br from-muted to-border flex items-center justify-center mb-6 relative transition-all duration-500 group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-[oklch(36%_.18_265)] group-hover:text-white group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-primary/25 cursor-pointer">
                <span className="font-display font-extrabold text-2xl text-primary group-hover:opacity-0 group-hover:scale-50 transition-all duration-300">
                  {step.number}
                </span>
                <Icon className="w-7 h-7 text-white absolute opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300" />
              </div>

              {/* Title & Description */}
              <div className="w-full">
                <h3 className="text-lg md:text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Top Gradient Highlight */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary-glow to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          );
        })}
      </div>
    </section>
  );
}
