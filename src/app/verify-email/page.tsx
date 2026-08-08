import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { VerifyEmailCard } from '@/components/auth/VerifyEmailCard';

export const metadata: Metadata = {
  title: 'Verify your email — Heightt',
  description: 'Check your inbox and enter the verification code to activate your Heightt account.',
};

export default function VerifyEmailPage() {
  return (
    <div className="fixed inset-0 bg-white flex flex-col">
      {/* Back button only — no navbar, no footer */}
      <div className="shrink-0 px-6 sm:px-10 pt-7">
        <Link
          href="/signup"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-[#1a5cff] transition-colors no-underline group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to sign up</span>
        </Link>
      </div>

      {/* Centered card */}
      <div className="flex-1 flex items-center justify-center px-6 sm:px-12 py-8 overflow-y-auto">
        <div className="w-full max-w-[480px]">
          <Suspense fallback={<div className="text-center py-12 text-slate-400 text-sm">Loading verification...</div>}>
            <VerifyEmailCard />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
