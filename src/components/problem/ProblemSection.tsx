'use client';

import Image from 'next/image';
import {
  FileSpreadsheet,
  Image as ImageIcon,
  MessageSquareWarning,
  Clock,
  Sparkles,
} from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

const painPoints = [
  {
    icon: ImageIcon,
    title: 'Payment screenshots everywhere',
    description: 'Students send transfer proofs through WhatsApp, forcing executives to verify each receipt manually.',
  },
  {
    icon: FileSpreadsheet,
    title: 'Endless spreadsheets',
    description: 'Names, matric numbers, and amounts have to be entered and reconciled row by row.',
  },
  {
    icon: MessageSquareWarning,
    title: '“Have you paid?”',
    description: 'Executives constantly chase students and search bank statements just to know who is cleared.',
  },
  {
    icon: Clock,
    title: 'Reporting takes hours',
    description: 'Scattered chats and spreadsheets make financial handovers and audits exhausting.',
  },
];

export function ProblemSection() {
  return (
    <section
      id="problem"
      className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative overflow-hidden"
    >
      {/* Background Accent */}
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* 2-Column Split: Image alone on the Left, Clean Scannable Text on the Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        {/* Left: Image Alone with responsive height */}
        <ScrollReveal direction="right" className="lg:col-span-6 w-full">
          <div className="relative w-full h-[360px] sm:h-[460px] lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-border/80 group bg-slate-950">
            <Image
              src="/Page 19.png"
              alt="Heightt Platform Mockup"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              priority
            />
          </div>
        </ScrollReveal>

        {/* Right: Clean, High-Scannability Text */}
        <ScrollReveal direction="left" className="lg:col-span-6 flex flex-col gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              The Old Way is Exhausting
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.65rem] font-extrabold tracking-tight text-foreground leading-[1.12]">
              Managing student dues shouldn't{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-glow to-primary">
                feel like a full-time job.
              </span>
            </h2>

            <p className="text-sm sm:text-base text-muted-foreground mt-3 leading-relaxed">
              Collecting dues still means bank transfers, WhatsApp group chats, and manually updating spreadsheets. It works — until you're dealing with hundreds of students.
            </p>
          </div>

          {/* 4 Clean Scannable Points */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {painPoints.map((item, idx) => {
              const Icon = item.icon;

              return (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white border border-border/70 shadow-sm hover:border-primary/30 transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-2.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground mb-1 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Bottom Highlight Callout */}
          <div className="pt-2">
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-primary bg-primary/5 border border-primary/15 px-4 py-2.5 rounded-xl">
              <Sparkles className="w-4 h-4 text-primary shrink-0" />
              <span>Heightt brings everything together into one automated system.</span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
