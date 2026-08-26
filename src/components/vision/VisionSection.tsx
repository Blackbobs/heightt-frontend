'use client';

import { Globe, Sparkles, Compass } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export function VisionSection() {
  return (
    <section
      id="vision"
      className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative overflow-hidden"
    >
      <ScrollReveal direction="up">
        <div className="relative rounded-[36px] bg-gradient-to-br from-[#0b0f19] via-[#111728] to-[#070a12] text-white p-8 sm:p-12 md:p-16 lg:p-24 overflow-hidden shadow-2xl border border-white/10">
          {/* Background Radial Glow Blobs */}
          <div className="absolute -top-32 -right-32 w-[450px] h-[450px] bg-primary/30 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-[450px] h-[450px] bg-primary-glow/20 rounded-full blur-[140px] pointer-events-none" />

          {/* Subtle grid pattern inside dark container */}
          <div className="absolute inset-0 bg-grid-pattern-dark opacity-30 pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center gap-7">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-bold backdrop-blur-md">
              <Globe className="w-3.5 h-3.5 text-primary-glow" />
              The Bigger Picture
            </div>

            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] text-balance">
              Building the financial infrastructure for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-primary-glow to-white">
                African campuses.
              </span>
            </h2>

            <p className="text-base sm:text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl font-normal">
              Heightt is starting with student dues because that's where we see an immediate problem we can solve.
            </p>

            <p className="text-base sm:text-lg text-white/70 leading-relaxed max-w-2xl font-normal">
              But the vision is bigger. We want to build the financial layer that connects students, student organisations and eventually institutions — making it easier to collect, manage, track and move money across campus.
            </p>

            {/* Framer Core Vision Callout Container */}
            <div className="mt-4 p-6 sm:p-7 rounded-3xl bg-white/5 border border-white/15 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 w-full shadow-inner">
              <div className="flex items-center gap-2.5 font-display text-base sm:text-lg font-extrabold text-white">
                <Sparkles className="w-5 h-5 text-primary-glow flex-shrink-0 animate-pulse" />
                <span>We’re starting with dues.</span>
              </div>
              <span className="hidden sm:inline text-white/30">•</span>
              <div className="flex items-center gap-2.5 font-display text-base sm:text-lg font-extrabold text-white/90">
                <Compass className="w-5 h-5 text-primary-glow flex-shrink-0" />
                <span>We’re building for everything that comes after.</span>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
