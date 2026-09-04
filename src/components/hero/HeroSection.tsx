'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ShieldCheck, FileText, QrCode } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { BackgroundIcons } from './BackgroundIcons';

export function HeroSection() {
  const { isAuthenticated, user } = useAuthStore();
  const needsOnboarding = user ? !user.profile?.onboardingCompleted : false;
  const dashboardHref = needsOnboarding ? '/onboarding' : '/dashboard';

  return (
    <section className="relative bg-[#F8FAFC] dark:bg-[#0B1020] border-b border-[#E2E8F0] dark:border-slate-800 pt-12 pb-16 lg:pt-20 lg:pb-24 transition-colors overflow-hidden">
      {/* Background Floating Financial & Campus Icons */}
      <BackgroundIcons />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT: 50/50 Split Editorial Content */}
          <div className="lg:col-span-6 flex flex-col items-start text-left space-y-6">
            
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#2563EB]/10 text-[#2563EB] dark:bg-[#2563EB]/20 text-xs font-bold tracking-wider uppercase border border-[#2563EB]/20">
              FINANCIAL INFRASTRUCTURE FOR CAMPUS LIFE
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-[#0B1020] dark:text-white leading-[1.12] tracking-tight">
              Campus payments, <br />
              <span className="text-[#2563EB]">without the chaos.</span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
              Pay dues, keep track of your payments, and access verified receipts from one place.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {isAuthenticated && user ? (
                <Link
                  href={dashboardHref}
                  className="px-6 py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-lg text-sm transition-colors inline-flex items-center gap-2"
                >
                  <span>{needsOnboarding ? 'Complete Onboarding' : 'Go to Dashboard'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/signup"
                    className="px-6 py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-lg text-sm transition-colors inline-flex items-center gap-2"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/signin"
                    className="px-5 py-3.5 text-slate-700 dark:text-slate-200 hover:text-[#2563EB] font-semibold text-sm transition-colors inline-flex items-center gap-1"
                  >
                    <span>Sign in</span>
                    <span>→</span>
                  </Link>
                </>
              )}
            </div>

            {/* Subtext */}
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium pt-1">
              Built for students and student organisations across Africa.
            </p>
          </div>

          {/* RIGHT: Structured Product Mockup Composition */}
          <div className="lg:col-span-6 relative flex justify-center">
            
            {/* Background Layered Card (Receipt Preview) */}
            <div className="absolute -top-4 -right-2 sm:-right-4 w-[85%] sm:w-[320px] bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-sm opacity-95 pointer-events-none transform translate-x-2 translate-y-2">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 mb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#2563EB]" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase">Heightt Receipt</span>
                </div>
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                  Verified
                </span>
              </div>
              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 font-mono">
                <div className="flex justify-between">
                  <span>REF:</span>
                  <span className="text-slate-900 dark:text-slate-200 font-semibold">HTT-20260903-92817</span>
                </div>
                <div className="flex justify-between">
                  <span>Student:</span>
                  <span className="text-slate-900 dark:text-slate-200 font-semibold">Ayomide Bello</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span className="text-slate-900 dark:text-slate-200 font-semibold">₦5,000.00</span>
                </div>
              </div>
            </div>

            {/* Foreground Main Product Interface Mockup */}
            <div className="relative w-full max-w-md bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm z-10">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-[#0B1020] dark:text-white">Departmental Due</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Computer Science Department</p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                  Payment Due
                </span>
              </div>

              {/* Body details */}
              <div className="py-5 space-y-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Amount Due</span>
                  <span className="text-2xl font-extrabold text-[#0B1020] dark:text-white font-mono">₦5,000</span>
                </div>

                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="flex justify-between py-1">
                    <span>Academic Session</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">2026/2027</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Assigned To</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">300 Level</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Due Date</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">Sep 30, 2026</span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-2">
                <button
                  type="button"
                  className="w-full py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-lg text-sm transition-colors text-center"
                >
                  Pay ₦5,000
                </button>
              </div>

              {/* Verification badge footer inside mockup */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Verified Heightt Security</span>
                </div>
                <div className="flex items-center gap-1">
                  <QrCode className="w-3.5 h-3.5 text-slate-400" />
                  <span>Instant Receipt</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}