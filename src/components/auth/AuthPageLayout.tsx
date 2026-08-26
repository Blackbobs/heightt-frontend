'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { AuthHeroBanner } from './AuthHeroBanner';
import { BackgroundIcons } from '@/components/hero/BackgroundIcons';
import { Logo } from '@/components/ui/Logo';

interface AuthPageLayoutProps {
  children: React.ReactNode;
}

export function AuthPageLayout({ children }: AuthPageLayoutProps) {
  return (
    <div className="fixed inset-0 flex overflow-hidden">
      {/* ── Left Panel: Hero Banner (desktop only) ── */}
      <div className="hidden lg:flex flex-col h-full w-[44%] shrink-0">
        <AuthHeroBanner />
      </div>

      {/* ── Right Panel: Form with Floating Background Icons ── */}
      <div className="flex-1 h-full bg-[#fafbfc] flex flex-col overflow-y-auto relative bg-dot-pattern">
        {/* Floating Icons Background */}
        <BackgroundIcons />

        {/* Ambient Subtle Glow */}
        <div className="absolute top-1/3 right-1/4 w-[450px] h-[450px] bg-primary/5 rounded-full blur-[130px] pointer-events-none -z-10" />

        {/* Top bar */}
        <div className="flex items-center justify-between px-8 sm:px-12 pt-8 pb-0 shrink-0 relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-primary transition-colors no-underline group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to home</span>
          </Link>

          {/* Mobile brand mark (visible only on mobile when left panel is hidden) */}
          <div className="lg:hidden">
            <Logo />
          </div>
        </div>

        {/* Centered form area */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-12 lg:px-16 py-8 relative z-10">
          <div className="w-full max-w-[480px]">
            {children}
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 px-8 pb-6 text-center relative z-10">
          <span className="text-[0.72rem] text-slate-400">
            &copy; {new Date().getFullYear()} Heightt. All rights reserved.
          </span>
        </div>
      </div>
    </div>
  );
}
