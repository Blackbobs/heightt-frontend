'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/store/auth-store';

export function FinalCTASection() {
  const { isAuthenticated, user } = useAuthStore();
  const needsOnboarding = user ? !user.profile?.onboardingCompleted : false;
  const dashboardHref = needsOnboarding ? '/onboarding' : '/dashboard';

  return (
    <section className="bg-[#0B1020] text-white py-16 sm:py-24 border-b border-slate-800 transition-colors overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              Your campus payments. <br />
              <span className="text-[#2563EB]">Finally organised.</span>
            </h2>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
              Join Heightt and keep every due, payment and receipt in one place. Less time chasing payments, zero spreadsheet head-aches.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              {isAuthenticated && user ? (
                <Link
                  href={dashboardHref}
                  className="px-8 py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-lg text-sm transition-colors"
                >
                  {needsOnboarding ? 'Complete Onboarding' : 'Go to Dashboard'}
                </Link>
              ) : (
                <>
                  <Link
                    href="/signup"
                    className="px-8 py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-lg text-sm transition-colors"
                  >
                    Create your account
                  </Link>
                  <Link
                    href="/signin"
                    className="px-6 py-3.5 text-slate-300 hover:text-white font-semibold text-sm transition-colors inline-flex items-center gap-1"
                  >
                    <span>Already have an account? Sign in</span>
                    <span>→</span>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Right Image Column */}
          <div className="lg:col-span-5 relative w-full h-[300px] sm:h-[380px] lg:h-[420px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
            <Image
              src="/196920 (1).png"
              alt="Heightt Mobile & Web Platform"
              fill
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover object-center"
              priority
            />
          </div>

        </div>
      </div>
    </section>
  );
}
