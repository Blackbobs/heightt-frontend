'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export function FinalCTASection() {
  return (
    <section className="w-full relative overflow-hidden">
      <ScrollReveal direction="up">
        <div className="bg-white border-y border-border shadow-[0_8px_48px_rgba(0,0,0,0.06)] relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">

            {/* Left: CTA Text Content */}
            <div className="lg:col-span-7 p-8 sm:p-14 md:p-20 lg:pl-24 xl:pl-32 flex flex-col justify-center gap-6 relative">
              {/* Subtle ambient glow */}
              <div className="absolute -top-20 -left-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col gap-5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold w-fit">
                  <Sparkles className="w-3.5 h-3.5" />
                  Simple setup · No card required to start
                </div>

                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[1.1]">
                  Still managing dues <br className="hidden sm:inline" />
                  with spreadsheets?
                </h2>

                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-lg">
                  There's a better way. Bring your organisation to Heightt and spend less time chasing payments, updating spreadsheets and verifying screenshots.
                </p>

                <p className="text-sm font-semibold text-foreground">
                  Let Heightt handle the records while you focus on running your organisation.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-1">
                  <Button
                    variant="primary"
                    size="lg"
                    className="font-bold rounded-2xl px-8 py-3.5 shadow-[0_10px_30px_rgba(26,92,255,0.3)] hover:shadow-[0_14px_36px_rgba(26,92,255,0.4)] hover:scale-105 transition-all duration-300 cursor-pointer"
                    asChild
                  >
                    <Link href="/signup">
                      Get Started with Heightt
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="font-bold rounded-2xl px-8 py-3.5 cursor-pointer"
                    asChild
                  >
                    <Link href="/signin">Sign In</Link>
                  </Button>
                </div>

                {/* Reassurance pills */}
                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Free for students
                  </span>
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Instant verifiable receipts
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> 2-min onboarding
                  </span>
                </div>
              </div>
            </div>

            {/* Right: 196920 (1).png image */}
            <div className="lg:col-span-5 relative min-h-[320px] lg:min-h-0">
              <Image
                src="/196920 (1).png"
                alt="Heightt Platform Preview"
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover object-center"
                priority
              />
            </div>

          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
