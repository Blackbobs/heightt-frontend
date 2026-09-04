'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { AuthHeroBanner } from './AuthHeroBanner';
import { BackgroundIcons } from '@/components/hero/BackgroundIcons';
import { Logo } from '@/components/ui/Logo';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

interface AuthPageLayoutProps {
  children: React.ReactNode;
}

export function AuthPageLayout({ children }: AuthPageLayoutProps) {
  return (
    <div className="fixed inset-0 flex overflow-hidden bg-[#F8FAFC] dark:bg-[#0B1020] text-[#0B1020] dark:text-[#F8FAFC] transition-colors">
      {/* ── Left Panel: Hero Banner (desktop only) ── */}
      <div className="hidden lg:flex flex-col h-full w-[44%] shrink-0 border-r border-slate-200 dark:border-slate-800">
        <AuthHeroBanner />
      </div>

      {/* ── Right Panel: Form Area ── */}
      <div className="flex-1 h-full flex flex-col justify-between overflow-y-auto relative p-6 sm:p-10 lg:p-12">
        {/* Floating Icons Background (hidden on mobile to keep form clean and accessible) */}
        <div className="hidden lg:block">
          <BackgroundIcons />
        </div>

        {/* Ambient Glow */}
        <div className="absolute top-1/3 right-1/4 w-[450px] h-[450px] bg-[#2563EB]/5 rounded-full blur-[130px] pointer-events-none -z-10" />

        {/* Top Header */}
        <div className="flex items-center justify-between relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-[#2563EB] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to home</span>
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="lg:hidden">
              <Logo />
            </div>
          </div>
        </div>

        {/* Center Form Box */}
        <div className="my-auto py-8 flex justify-center relative z-10">
          <div className="w-full max-w-md bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 shadow-md">
            {children}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-slate-400 relative z-10">
          © {new Date().getFullYear()} Heightt. Built for African campuses.
        </div>
      </div>
    </div>
  );
}
