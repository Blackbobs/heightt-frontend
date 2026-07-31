'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { AuthHeroBanner } from './AuthHeroBanner';

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

      {/* ── Right Panel: Form ── */}
      <div className="flex-1 h-full bg-white flex flex-col overflow-y-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between px-8 sm:px-12 pt-8 pb-0 shrink-0">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-[#1a5cff] transition-colors no-underline group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to home</span>
          </Link>

          {/* Mobile brand mark (visible only on mobile when left panel is hidden) */}
          <div className="lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#1a5cff] to-[#60a5fa] flex items-center justify-center shadow-[0_4px_12px_rgba(26,92,255,0.4)]">
              <span className="font-extrabold text-sm text-white leading-none">H</span>
            </div>
            <span className="font-display font-extrabold text-lg tracking-tight text-[#0b1a33]">Heightt</span>
          </div>
        </div>

        {/* Centered form area */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-12 lg:px-16 py-8">
          <div className="w-full max-w-[480px]">
            {children}
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 px-8 pb-6 text-center">
          <span className="text-[0.72rem] text-slate-300">
            &copy; {new Date().getFullYear()} Heightt. All rights reserved.
          </span>
        </div>
      </div>
    </div>
  );
}
