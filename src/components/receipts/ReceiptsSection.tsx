'use client';

import React from 'react';
import { ShieldCheck, Download, Share2, QrCode, FileText } from 'lucide-react';

export function ReceiptsSection() {
  return (
    <section className="border-b border-slate-200/80 bg-white py-16 dark:border-slate-800 dark:bg-[#0B1020] sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Description */}
          <div className="space-y-6 text-center lg:col-span-6 lg:text-left">
            <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#2563EB]">
              DIGITAL VERIFICATION
            </div>
            <h2 className="text-balance text-3xl font-semibold leading-tight tracking-[-0.045em] text-[#0B1020] dark:text-white sm:text-4xl lg:text-5xl">
              Proof of payment. <br />
              <span className="text-[#2563EB]">Always available.</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Every successful payment creates a verifiable digital receipt. Students can view, share, or download it whenever needed for department clearance.
            </p>
            
            <div className="mx-auto max-w-lg space-y-3 pt-2 text-left lg:mx-0">
              <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Tamper-evident digital signature</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">
                <QrCode className="w-4 h-4 text-[#2563EB] flex-shrink-0" />
                <span>QR Code for instant offline verification</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">
                <FileText className="w-4 h-4 text-slate-500 flex-shrink-0" />
                <span>Instant PDF export formatted for campus clearance</span>
              </div>
            </div>
          </div>

          {/* Right Column: Realistic Receipt Mockup */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-sm rounded-3xl border border-slate-200/90 bg-white p-4 shadow-[0_28px_80px_-38px_rgba(15,42,100,0.38)] dark:border-slate-800 dark:bg-[#131B2E] sm:p-6">
              
              {/* Receipt Surface */}
              <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-4 dark:border-slate-800 dark:bg-[#0B1020] sm:p-5">
                
                {/* Header */}
                <div className="flex justify-between items-start pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <span className="text-base font-extrabold tracking-tight text-[#0B1020] dark:text-white font-mono">HEIGHTT</span>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block uppercase tracking-wider">Payment Receipt</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                    ✓ Payment Verified
                  </span>
                </div>

                {/* Amount */}
                <div className="py-4 text-center border-b border-slate-200 dark:border-slate-800">
                  <span className="text-xs text-slate-500 dark:text-slate-400 block uppercase font-mono">Amount Paid</span>
                  <span className="text-3xl font-extrabold text-[#0B1020] dark:text-white font-mono">₦5,000.00</span>
                  <span className="text-xs font-semibold text-[#2563EB] block mt-1">Departmental Due</span>
                </div>

                {/* Meta details */}
                <div className="py-4 space-y-2.5 text-xs text-slate-600 dark:text-slate-300 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Paid by</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">Ayomide Bello</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Organization</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">Computer Science Dept</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Reference</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">HTT-20260903-92817</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Date</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">03 Sep 2026</span>
                  </div>
                </div>

                {/* QR Code & Verification */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="w-12 h-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded flex items-center justify-center p-1">
                    <QrCode className="w-9 h-9 text-slate-800 dark:text-slate-200" />
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 text-right">
                    Scan QR to verify <br />
                    on Heightt network
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4">
                <button type="button" className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#2563EB] py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#1D4ED8]">
                  <Download className="w-3.5 h-3.5" /> Download PDF
                </button>
                <button type="button" aria-label="Share receipt" className="flex items-center justify-center rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800">
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
