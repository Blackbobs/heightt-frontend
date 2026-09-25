'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CreateOrganizationSection } from '@/components/organizations/CreateOrganizationSection';

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

      <CreateOrganizationSection />

    </div>
  );
}
