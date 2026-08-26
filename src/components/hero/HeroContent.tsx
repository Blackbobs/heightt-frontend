'use client';

import { useEffect, useRef } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth-store';

interface HeroContentProps {
  onTitleRef: (el: HTMLHeadingElement | null) => void;
  onDescriptionRef: (el: HTMLParagraphElement | null) => void;
  onActionsRef: (el: HTMLDivElement | null) => void;
  onStatsRef: (el: HTMLDivElement | null) => void;
}

export function HeroContent({
  onTitleRef,
  onDescriptionRef,
  onActionsRef,
  onStatsRef,
}: HeroContentProps) {
  const statsRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, user } = useAuthStore();

  const needsOnboarding = user ? !user.profile?.onboardingCompleted : false;
  const dashboardHref = needsOnboarding ? '/onboarding' : '/dashboard';

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
      { threshold: 0.2 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const animateCounter = (element: HTMLElement, target: number) => {
    let current = 0;
    const increment = Math.ceil(target / 40);
    const duration = 1600;
    const stepTime = Math.floor(duration / 40);

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      if (target >= 1000) {
        element.textContent = current.toLocaleString() + '+';
      } else {
        element.textContent = current + '+';
      }
    }, stepTime);
  };

  return (
    <div className="flex flex-col items-center text-center gap-7 lg:gap-8 max-w-4xl mx-auto">
      {/* Main Display Headline */}
      <h1
        ref={onTitleRef}
        className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-[4.75rem] font-extrabold tracking-tight text-foreground opacity-0 translate-y-6 leading-[1.03] text-balance max-w-4xl pt-2 sm:pt-4"
      >
        Stop Chasing Dues.{' '}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-glow to-primary relative inline-block">
          Start Managing Them.
        </span>
      </h1>

      {/* Subtitle description */}
      <p
        ref={onDescriptionRef}
        className="text-base sm:text-lg md:text-xl leading-relaxed text-muted-foreground opacity-0 translate-y-6 max-w-2xl font-normal"
      >
        Heightt gives student organisations a simpler way to collect dues, track payments, manage members, and keep financial records — without spreadsheets, paper receipts, or endless payment screenshots.
      </p>

      {/* Reassurance value props */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-xs sm:text-sm text-foreground font-medium">
        <div className="flex items-center gap-2.5 bg-muted/60 px-4 py-2.5 rounded-2xl border border-border/80 backdrop-blur-sm shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Students get a straightforward way to pay.</span>
        </div>
        <div className="flex items-center gap-2.5 bg-muted/60 px-4 py-2.5 rounded-2xl border border-border/80 backdrop-blur-sm shadow-sm">
          <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0" />
          <span>Executives get the tools to stay organised.</span>
        </div>
      </div>

      {/* CTA Buttons */}
      <div ref={onActionsRef} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 w-full sm:w-auto">
        {isAuthenticated && user ? (
          <Link
            href={dashboardHref}
            className="inline-flex items-center justify-center px-10 py-4 text-base font-bold text-white bg-primary rounded-2xl hover:bg-[oklch(38%_.18_265)] transition-all duration-300 shadow-[0_12px_32px_rgba(26,92,255,0.35)] hover:shadow-[0_16px_40px_rgba(26,92,255,0.45)] hover:-translate-y-0.5 group cursor-pointer w-full sm:w-auto"
          >
            {needsOnboarding ? 'Complete Onboarding' : 'Go to Dashboard'}
            <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        ) : (
          <>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-10 py-4 text-base font-bold text-white bg-primary rounded-2xl hover:bg-[oklch(38%_.18_265)] transition-all duration-300 shadow-[0_12px_32px_rgba(26,92,255,0.35)] hover:shadow-[0_16px_40px_rgba(26,92,255,0.45)] hover:-translate-y-0.5 group cursor-pointer w-full sm:w-auto"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/signin"
              className="inline-flex items-center justify-center px-10 py-4 text-base font-bold text-foreground bg-white border border-border rounded-2xl hover:bg-muted hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer w-full sm:w-auto"
            >
              Sign In
            </Link>
          </>
        )}
      </div>

      {/* Hero Stats Bento Highlights */}
      <div
        ref={(el) => {
          statsRef.current = el;
          onStatsRef(el);
        }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-6 w-full max-w-4xl opacity-0 translate-y-6"
      >
        <div className="p-5 rounded-3xl bg-white border border-border/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col items-center justify-center text-center">
          <span className="stat-number text-2xl sm:text-3xl font-extrabold text-foreground font-display" data-count="100">
            0
          </span>
          <span className="text-xs text-muted-foreground font-medium mt-0.5">Student Organisations</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-border/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col items-center justify-center text-center">
          <span className="stat-number text-2xl sm:text-3xl font-extrabold text-primary font-display" data-count="25000">
            0
          </span>
          <span className="text-xs text-muted-foreground font-medium mt-0.5">Students Enrolled</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-border/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col items-center justify-center text-center">
          <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-display">
            100%
          </span>
          <span className="text-xs text-muted-foreground font-medium mt-0.5">Automated Records</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-border/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col items-center justify-center text-center">
          <span className="text-2xl sm:text-3xl font-extrabold text-foreground font-display">
            0
          </span>
          <span className="text-xs text-muted-foreground font-medium mt-0.5">Spreadsheets Needed</span>
        </div>
      </div>
    </div>
  );
}