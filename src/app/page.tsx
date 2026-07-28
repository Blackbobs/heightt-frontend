'use client';

import { HeroSection } from '@/components/hero/HeroSection';
import { ForStudentsSection } from '@/components/students/ForStudentsSection';
import { HowItWorksSection } from '@/components/how-it-works/HowItWorksSection';
import { TransparencySection } from '@/components/transparency/TransparencySection';
import { SavingsSection } from '@/components/savings/SavingsSection';
import { RoadmapSection } from '@/components/roadmap/RoadmapSection';
import { FAQSection } from '@/components/faq/FAQSection';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ForStudentsSection />
      <HowItWorksSection />
      <TransparencySection />
      <SavingsSection />
      <RoadmapSection />
      <FAQSection />
    </main>
  );
}
