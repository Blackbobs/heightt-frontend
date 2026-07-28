'use client';

import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Globe, ArrowRight, Play } from 'lucide-react';

interface HeroContentProps {
  onBadgeRef: (el: HTMLDivElement | null) => void;
  onTitleRef: (el: HTMLHeadingElement | null) => void;
  onDescriptionRef: (el: HTMLParagraphElement | null) => void;
  onActionsRef: (el: HTMLDivElement | null) => void;
  onStatsRef: (el: HTMLDivElement | null) => void;
}

export function HeroContent({
  onBadgeRef,
  onTitleRef,
  onDescriptionRef,
  onActionsRef,
  onStatsRef,
}: HeroContentProps) {
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const numbers = entry.target.querySelectorAll('.stat-number');
            numbers.forEach((num) => {
              const target = parseInt(num.getAttribute('data-count') || '0');
              animateCounter(num as HTMLElement, target);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const animateCounter = (element: HTMLElement, target: number) => {
    let current = 0;
    const increment = Math.ceil(target / 60);
    const duration = 2000;
    const stepTime = Math.floor(duration / 60);

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      if (target === 50000000) {
        const val = Math.floor(current / 1000000);
        element.textContent = '₦' + val + 'M+';
      } else if (target >= 1000) {
        element.textContent = current.toLocaleString() + '+';
      } else {
        element.textContent = current + '+';
      }
    }, stepTime);
  };

  return (
    <div className="flex flex-col gap-6 lg:gap-7">
      <Badge ref={onBadgeRef} className="opacity-0 translate-y-5 w-fit">
        <Globe className="w-4 h-4" />
        Built for African campuses
      </Badge>

      <h1
        ref={onTitleRef}
        className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-foreground opacity-0 translate-y-8 text-balance"
      >
        Student Finance
        <br />
        <span className="text-primary relative">
          Made Simple
          <span className="absolute bottom-1 left-0 right-0 h-1 md:h-1.5 bg-muted rounded -z-10" />
        </span>
      </h1>

      <p
        ref={onDescriptionRef}
        className="text-base md:text-lg lg:text-xl leading-relaxed text-muted-foreground max-w-[520px] opacity-0 translate-y-8"
      >
        Save towards your dues, pay securely, buy event tickets, and stay connected
        with your student community — all in one place.
      </p>

      <div
        ref={onActionsRef}
        className="flex flex-col sm:flex-row gap-4 flex-wrap mt-2 opacity-0 translate-y-8"
      >
        <Button variant="primary" size="lg">
          <ArrowRight className="w-5 h-5" />
          Join Waitlist
        </Button>
      </div>

      <div
        ref={(el) => {
          statsRef.current = el;
          onStatsRef(el);
        }}
        className="flex flex-row items-center justify-between sm:justify-start gap-4 sm:gap-8 md:gap-12 lg:gap-16 pt-6 sm:pt-8 mt-4 border-t-2 border-border opacity-0 translate-y-8"
      >
        <div className="flex flex-col min-w-0">
          <span className="stat-number text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary tracking-tight whitespace-nowrap" data-count="50">
            0
          </span>
          <span className="text-xs sm:text-sm text-muted-foreground font-medium">Institutions</span>
        </div>
        <div className="flex flex-col min-w-0">
          <span className="stat-number text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary tracking-tight whitespace-nowrap" data-count="10000">
            0
          </span>
          <span className="text-xs sm:text-sm text-muted-foreground font-medium">Students</span>
        </div>
        <div className="flex flex-col min-w-0">
          <span className="stat-number text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-primary tracking-tight whitespace-nowrap" data-count="50000000">
            0
          </span>
          <span className="text-xs sm:text-sm text-muted-foreground font-medium">Processed</span>
        </div>
      </div>
    </div>
  );
}