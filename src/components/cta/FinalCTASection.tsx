'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, LockKeyhole } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';

export function FinalCTASection() {
  const { isAuthenticated, user } = useAuthStore();
  const needsOnboarding = user ? !user.profile?.onboardingCompleted : false;
  const dashboardHref = needsOnboarding ? '/onboarding' : '/dashboard';

  return (
    <section className="relative isolate overflow-hidden border-b border-slate-800 bg-[#0B1020] py-20 text-white sm:py-28">
      <div className="hero-grid pointer-events-none absolute inset-0 -z-10 opacity-10" aria-hidden="true" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2563EB]/15 blur-3xl" aria-hidden="true" />
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-400">Ready when you are</div>
          <div className="mt-4 space-y-6">
            <h2 className="text-balance text-4xl font-semibold leading-[0.96] tracking-[-0.06em] text-white sm:text-5xl md:text-6xl">
              Your campus payments. <br />
              <span className="text-[#2563EB]">Finally organised.</span>
            </h2>

            <p className="mx-auto max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
              Keep every due, payment, and receipt in one trusted place. No chasing. No spreadsheets. No missing proof.
            </p>

            <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
              {isAuthenticated && user ? (
                <Link
                  href={dashboardHref}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(37,99,235,0.25)] transition-all hover:-translate-y-0.5 hover:bg-[#1D4ED8] sm:w-auto"
                >
                  {needsOnboarding ? 'Complete Onboarding' : 'Go to Dashboard'}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/signup"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(37,99,235,0.25)] transition-all hover:-translate-y-0.5 hover:bg-[#1D4ED8] sm:w-auto"
                  >
                    Create your account
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                  <Link
                    href="/signin"
                    className="inline-flex items-center gap-1 px-4 py-3 text-sm font-semibold text-slate-300 transition-colors hover:text-white"
                  >
                    <span>Already have an account? Sign in</span>
                    <span>→</span>
                  </Link>
                </>
              )}
            </div>
            <p className="flex items-center justify-center gap-2 font-mono text-[9px] uppercase tracking-[0.12em] text-slate-500 sm:text-[10px]"><LockKeyhole className="size-3.5 text-blue-400" aria-hidden="true" /> Secure payments. Verified receipts.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
