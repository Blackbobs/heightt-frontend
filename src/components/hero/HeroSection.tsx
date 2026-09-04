'use client';

import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Check, LockKeyhole, ReceiptText, ScanLine } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';

function HeighttMark() {
  return (
    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#2563EB] text-white" aria-hidden="true">
      <span className="font-mono text-xs font-bold tracking-[-0.08em]">ht</span>
    </span>
  );
}

function PaymentPreview() {
  return (
    <div className="relative w-full max-w-[560px]">
      <div className="absolute -inset-2.5 rounded-[1.75rem] border border-[#2563EB]/10 bg-[#2563EB]/3 sm:-inset-3 sm:rounded-[2rem]" aria-hidden="true" />
      <div className="relative overflow-hidden rounded-[1.4rem] border border-slate-200/90 bg-white shadow-[0_28px_80px_-38px_rgba(15,42,100,0.38)] dark:border-slate-800 dark:bg-[#131B2E]">
        <div className="flex items-center justify-between border-b border-slate-200/80 px-4 py-3.5 dark:border-slate-800 sm:px-6 sm:py-4">
          <div className="flex items-center gap-3">
            <HeighttMark />
            <div>
              <p className="text-sm font-semibold tracking-tight text-[#0B1020] dark:text-white">Heightt Pay</p>
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Student wallet</p>
            </div>
          </div>
          <span className="rounded-full border border-[#2563EB]/15 bg-[#2563EB]/8 px-2.5 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.1em] text-[#2563EB]">Live</span>
        </div>

        <div className="grid md:grid-cols-[1.15fr_0.85fr]">
          <div className="p-4 sm:p-6 md:border-r md:border-slate-200/80 md:dark:border-slate-800">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Next payment</p>
                <p className="mt-2 text-3xl font-bold tracking-[-0.05em] text-[#0B1020] dark:text-white sm:text-4xl">₦5,000</p>
              </div>
              <span className="rounded-lg bg-amber-50 px-2 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.06em] text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">Due Sep 30</span>
            </div>

            <div className="mt-6 space-y-3 border-t border-slate-200/80 pt-4 text-xs dark:border-slate-800 sm:text-sm">
              <div className="flex items-center justify-between gap-4"><span className="text-slate-500 dark:text-slate-400">Departmental dues</span><span className="font-medium text-slate-800 dark:text-slate-200">Computer Science</span></div>
              <div className="flex items-center justify-between gap-4"><span className="text-slate-500 dark:text-slate-400">Academic session</span><span className="font-medium text-slate-800 dark:text-slate-200">2026 / 2027</span></div>
              <div className="flex items-center justify-between gap-4"><span className="text-slate-500 dark:text-slate-400">Assigned level</span><span className="font-medium text-slate-800 dark:text-slate-200">300 Level</span></div>
            </div>

            <button type="button" className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-4 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#1D4ED8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2">
              Pay securely <ArrowUpRight className="size-4" aria-hidden="true" />
            </button>
          </div>

          <div className="hidden flex-col justify-between bg-slate-50/80 p-6 dark:bg-slate-950/20 md:flex">
            <div>
              <div className="flex items-center justify-between">
                <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Recent receipt</p>
                <ReceiptText className="size-4 text-[#2563EB]" aria-hidden="true" />
              </div>
              <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#131B2E]">
                <div className="flex items-center justify-between border-b border-dashed border-slate-200 pb-4 dark:border-slate-700">
                  <div><p className="text-xs font-semibold text-[#0B1020] dark:text-white">Heightt Receipt</p><p className="mt-1 font-mono text-[8px] text-slate-500 dark:text-slate-400">HTT-20260903-92817</p></div>
                  <span className="flex size-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50"><Check className="size-4" aria-hidden="true" /></span>
                </div>
                <div className="space-y-2 pt-4 font-mono text-[9px] uppercase tracking-[0.06em] text-slate-500 dark:text-slate-400">
                  <div className="flex justify-between"><span>Paid</span><span className="font-semibold text-slate-800 dark:text-slate-200">₦5,000.00</span></div>
                  <div className="flex justify-between"><span>Method</span><span className="font-semibold text-slate-800 dark:text-slate-200">Wallet</span></div>
                  <div className="flex justify-between"><span>Status</span><span className="font-semibold text-emerald-600">Verified</span></div>
                </div>
              </div>
            </div>
            <div className="mt-7 flex items-center gap-2 border-t border-slate-200/80 pt-4 text-[11px] text-slate-500 dark:border-slate-800 dark:text-slate-400"><LockKeyhole className="size-3.5 text-[#2563EB]" aria-hidden="true" /> Every payment comes with proof.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HeroSection() {
  const { isAuthenticated, user } = useAuthStore();
  const needsOnboarding = user ? !user.profile?.onboardingCompleted : false;
  const dashboardHref = needsOnboarding ? '/onboarding' : '/dashboard';

  return (
    <section className="relative isolate overflow-hidden border-b border-slate-200/80 bg-[#F8FAFC] dark:border-slate-800 dark:bg-[#0B1020]">
      <div className="hero-grid pointer-events-none absolute inset-0 -z-10 opacity-55 dark:opacity-20" aria-hidden="true" />
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-[#2563EB]/8 blur-3xl lg:left-[20%]" aria-hidden="true" />

      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 xl:gap-20">
          <div className="mx-auto flex max-w-xl flex-col items-center text-center lg:mx-0 lg:items-start lg:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#2563EB]/15 bg-white/70 px-3 py-1.5 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-[#2563EB] shadow-sm backdrop-blur dark:bg-[#131B2E]/70 sm:text-[10px]">
              <ScanLine className="size-3.5" aria-hidden="true" /> Built for campus life
            </div>
            <h1 className="max-w-[680px] text-balance text-[clamp(3.15rem,14vw,5rem)] font-semibold leading-[0.92] tracking-[-0.07em] text-[#0B1020] dark:text-white lg:text-[clamp(4.5rem,6vw,6.15rem)]">
              Campus payments, <span className="text-[#2563EB]">sorted.</span>
            </h1>
            <p className="mt-7 max-w-lg text-pretty text-[15px] leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">Pay dues, keep track of your payments, and access verified receipts from one trusted place.</p>

            <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row lg:justify-start">
              <Link href={isAuthenticated && user ? dashboardHref : '/signup'} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(37,99,235,0.22)] transition-all hover:-translate-y-0.5 hover:bg-[#1D4ED8] sm:w-auto">
                {isAuthenticated && user ? (needsOnboarding ? 'Complete onboarding' : 'Go to dashboard') : 'Get started'}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link href={isAuthenticated && user ? '#how-it-works' : '/signin'} className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:text-[#2563EB] dark:text-slate-300">
                {isAuthenticated && user ? 'See how it works' : 'Sign in'} <span aria-hidden="true">{isAuthenticated && user ? '↓' : '→'}</span>
              </Link>
            </div>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-slate-200/80 pt-5 font-mono text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:border-slate-800 dark:text-slate-400 lg:justify-start sm:text-[10px]">
              <span>For students</span><span>For organisations</span><span className="text-emerald-600">Verified by design</span>
            </div>
          </div>

          <div className="flex w-full justify-center lg:justify-end"><PaymentPreview /></div>
        </div>
      </div>
    </section>
  );
}
