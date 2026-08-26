'use client';

import { HeroSection } from '@/components/hero/HeroSection';
import { ProblemSection } from '@/components/problem/ProblemSection';
import { AudienceSection } from '@/components/audience/AudienceSection';
import { HowItWorksSection } from '@/components/how-it-works/HowItWorksSection';
import { FinalCTASection } from '@/components/cta/FinalCTASection';
import { FAQSection } from '@/components/faq/FAQSection';

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* HERO */}
      <HeroSection />

      {/* THE PROBLEM */}
      <ProblemSection />

      {/* FOR STUDENTS + FOR EXECUTIVES (toggle) */}
      <AudienceSection />

      {/* HOW IT WORKS */}
      <HowItWorksSection />

      {/* FAQ */}
      <FAQSection />

      {/* FINAL CTA */}
      <FinalCTASection />
    </main>
  );
}
