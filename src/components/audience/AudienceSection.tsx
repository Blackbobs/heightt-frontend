'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Plus } from 'lucide-react';

export function AudienceSection() {
  return (
    <div className="w-full">
      
      {/* ── 10. FOR STUDENTS SECTION ── */}
      <section id="for-students" className="border-b border-slate-200/80 bg-white py-16 dark:border-slate-800 dark:bg-[#0B1020] sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          
          <div className="text-center font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#2563EB] lg:text-left">
            FOR STUDENTS
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headline & Bullet points */}
            <div className="space-y-6 text-center lg:col-span-6 lg:text-left">
              <h2 className="text-balance text-3xl font-semibold leading-tight tracking-[-0.045em] text-[#0B1020] dark:text-white sm:text-4xl lg:text-5xl">
                Everything you&apos;ve paid for. <br />
                <span className="text-[#2563EB]">One place.</span>
              </h2>

              <ul className="mx-auto max-w-lg space-y-3 pt-2 text-left lg:mx-0">
                {[
                  'Pay dues online securely with instant feedback',
                  'Know exactly what you owe and when it is due',
                  'Access verified digital receipts anytime',
                  'See your complete payment history across semesters',
                  'Never search through WhatsApp screenshots again',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                    <span className="w-5 h-5 rounded bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center font-bold text-xs mt-0.5 flex-shrink-0">
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-3">
                <Link
                  href="/signup"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(37,99,235,0.18)] transition-all hover:-translate-y-0.5 hover:bg-[#1D4ED8] sm:w-auto"
                >
                  <span>Get Started as Student</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Column: Actual Product Interface Mockup */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl border border-slate-200/90 bg-[#F8FAFC] p-4 shadow-[0_24px_70px_-40px_rgba(15,42,100,0.35)] dark:border-slate-800 dark:bg-[#131B2E] sm:p-6">
                
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-4">
                  <div>
                    <h3 className="text-base font-bold text-[#0B1020] dark:text-white">Your Dues</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">2026/2027 Academic Session</p>
                  </div>
                  <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    3 Dues Assigned
                  </span>
                </div>

                <div className="space-y-3">
                  {/* Due item 1 */}
                  <div className="bg-white dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#0B1020] dark:text-white">Departmental Due</span>
                        <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                          Pending
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Computer Science Department • Due Sep 30</p>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-slate-800">
                      <span className="text-base font-extrabold text-[#0B1020] dark:text-white font-mono">₦5,000</span>
                      <button type="button" className="px-3.5 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-md transition-colors">
                        Pay now
                      </button>
                    </div>
                  </div>

                  {/* Due item 2 */}
                  <div className="bg-white dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#0B1020] dark:text-white">Faculty Due</span>
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                          ✓ Paid
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Faculty of Science • Paid Aug 24</p>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-slate-800">
                      <span className="text-base font-extrabold text-[#0B1020] dark:text-white font-mono">₦3,000</span>
                      <button type="button" className="px-3.5 py-1.5 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        View receipt
                      </button>
                    </div>
                  </div>

                  {/* Due item 3 */}
                  <div className="bg-white dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#0B1020] dark:text-white">Level Due</span>
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                          ✓ Paid
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">300 Level Association • Paid Aug 15</p>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-slate-800">
                      <span className="text-base font-extrabold text-[#0B1020] dark:text-white font-mono">₦2,500</span>
                      <button type="button" className="px-3.5 py-1.5 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        View receipt
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 11. FOR EXECUTIVES SECTION (Dark Navy Background, No Gradient) ── */}
      <section id="for-executives" className="relative overflow-hidden border-b border-slate-800 bg-[#0B1020] py-16 text-white sm:py-24">
        <div className="hero-grid pointer-events-none absolute inset-0 opacity-10" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          
          <div className="text-center font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-400 lg:text-left">
            FOR EXECUTIVES & ORGANISATIONS
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Capabilities */}
            <div className="space-y-6 text-center lg:col-span-5 lg:text-left">
              <h2 className="text-balance text-3xl font-semibold leading-tight tracking-[-0.045em] text-white sm:text-4xl lg:text-5xl">
                Less chasing payments. <br />
                <span className="text-[#2563EB]">More visibility.</span>
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Heightt gives departmental associations, faculties, and clubs complete control over their dues collection.
              </p>

              <div className="grid grid-cols-2 gap-2 pt-2 text-left">
                {[
                  'Create dues',
                  'Assign dues to levels',
                  'Track live collections',
                  'Monitor outstanding payments',
                  'Generate audit reports',
                  'Verify student transactions',
                  'Export CSV records',
                ].map((cap) => (
                  <div key={cap} className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 p-2.5 text-[11px] font-medium text-slate-300 sm:text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                    <span>{cap}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <Link
                  href="/signup"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-6 py-3.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#1D4ED8] sm:w-auto"
                >
                  <span>Onboard Executive Account</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Column: Restrained Admin Preview Mockup */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl border border-slate-800 bg-[#131B2E] p-4 text-slate-100 shadow-2xl shadow-black/20 sm:p-6">
                
                {/* Admin Header */}
                <div className="mb-4 flex flex-col gap-3 border-b border-slate-800 pb-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-400">NACOS EXCO DASHBOARD</div>
                    <div className="text-base font-bold text-white">Computer Science Department</div>
                  </div>
                  <div className="flex gap-2 self-start sm:self-auto">
                    <button type="button" className="px-3 py-1.5 bg-[#2563EB] text-white text-xs font-semibold rounded flex items-center gap-1">
                      <Plus className="w-3.5 h-3.5" /> Create Due
                    </button>
                  </div>
                </div>

                {/* Collections summary */}
                <div className="mb-4 grid grid-cols-1 gap-2 min-[430px]:grid-cols-3 sm:gap-3">
                  <div className="bg-[#0B1020] border border-slate-800 p-3 rounded-lg">
                    <span className="text-[10px] font-semibold text-slate-400 block uppercase">Total Collected</span>
                    <span className="block break-words font-mono text-base font-bold text-white sm:text-lg">₦2,450,000</span>
                  </div>
                  <div className="bg-[#0B1020] border border-slate-800 p-3 rounded-lg">
                    <span className="text-[10px] font-semibold text-slate-400 block uppercase">Cleared Students</span>
                    <span className="block font-mono text-base font-bold text-emerald-400 sm:text-lg">490 / 600</span>
                  </div>
                  <div className="bg-[#0B1020] border border-slate-800 p-3 rounded-lg">
                    <span className="text-[10px] font-semibold text-slate-400 block uppercase">Outstanding</span>
                    <span className="block font-mono text-base font-bold text-amber-400 sm:text-lg">₦550,000</span>
                  </div>
                </div>

                {/* Table preview */}
                <div className="border border-slate-800 rounded-lg overflow-hidden text-xs">
                  <div className="bg-[#0B1020] px-4 py-2.5 font-semibold text-slate-400 flex justify-between border-b border-slate-800">
                    <span>Recent Collections</span>
                    <span>Status</span>
                  </div>
                  <div className="divide-y divide-slate-800/60 bg-[#131B2E]">
                    <div className="flex flex-col gap-1 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
                      <div>
                        <span className="font-semibold text-white">Ayomide Bello</span>
                        <span className="text-slate-400 text-[11px] block">CSC/2021/049 • Departmental Due</span>
                      </div>
                      <span className="font-mono text-[11px] font-semibold text-emerald-400 sm:text-xs">₦5,000 (Verified)</span>
                    </div>
                    <div className="flex flex-col gap-1 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
                      <div>
                        <span className="font-semibold text-white">Chidi Nnamdi</span>
                        <span className="text-slate-400 text-[11px] block">CSC/2022/102 • Departmental Due</span>
                      </div>
                      <span className="font-mono text-[11px] font-semibold text-emerald-400 sm:text-xs">₦5,000 (Verified)</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
