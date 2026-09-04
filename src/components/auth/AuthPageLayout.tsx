'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { AuthHeroBanner } from './AuthHeroBanner';
import { Logo } from '@/components/ui/Logo';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

interface AuthPageLayoutProps {
  children: React.ReactNode;
}

export function AuthPageLayout({ children }: AuthPageLayoutProps) {
  return (
    <div className="fixed inset-0 flex overflow-hidden bg-[#F8FAFC] text-[#0B1020] dark:bg-[#0B1020] dark:text-[#F8FAFC]">
      {/* ── Left Panel: Hero Banner (desktop only) ── */}
      <div className="hidden lg:flex flex-col h-full w-[44%] shrink-0 border-r border-slate-200 dark:border-slate-800">
        <AuthHeroBanner />
      </div>

      {/* ── Right Panel: Form Area ── */}
      <div className="relative flex h-full flex-1 flex-col justify-between overflow-y-auto p-5 sm:p-8 lg:p-12">
        <div className="hero-grid pointer-events-none absolute inset-0 opacity-35 dark:opacity-10" aria-hidden="true" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-[#2563EB]/8 blur-3xl" aria-hidden="true" />

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
        <div className="relative z-10 my-auto flex justify-center py-8">
          <div className="w-full max-w-md rounded-3xl border border-slate-200/90 bg-white p-0 shadow-[0_24px_70px_rgba(15,42,100,0.10)] sm:p-8">
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
