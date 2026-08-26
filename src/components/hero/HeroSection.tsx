'use client';

import { useEffect, useRef } from 'react';
import { HeroContent } from './HeroContent';
import { BackgroundIcons } from './BackgroundIcons';
import { UniversityMarquee } from './UniversityMarquee';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
      defaults: {
        ease: 'power3.out',
        duration: 0.8,
      },
    });

    if (titleRef.current) {
      tl.to(titleRef.current, { opacity: 1, y: 0, duration: 0.7 });
    }

    if (descriptionRef.current) {
      tl.to(descriptionRef.current, { opacity: 1, y: 0, duration: 0.7 }, '-=0.4');
    }

    if (actionsRef.current) {
      tl.to(actionsRef.current, { opacity: 1, y: 0, duration: 0.6 }, '-=0.3');
    }

    if (statsRef.current) {
      tl.to(statsRef.current, { opacity: 1, y: 0, duration: 0.6 }, '-=0.3');
    }

    if (marqueeRef.current) {
      tl.to(marqueeRef.current, { opacity: 1, y: 0, duration: 0.6 }, '-=0.2');
    }

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center bg-background pt-20 sm:pt-24 lg:pt-28 pb-28 sm:pb-36 lg:pb-44 relative overflow-hidden bg-dot-pattern"
    >
      {/* Background Floating Financial & Campus Icons */}
      <BackgroundIcons />

      {/* Ambient background light orbs */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-primary/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Centered Hero Content */}
      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 md:px-8 lg:px-12 relative z-10">
        <HeroContent
          onTitleRef={(el) => (titleRef.current = el)}
          onDescriptionRef={(el) => (descriptionRef.current = el)}
          onActionsRef={(el) => (actionsRef.current = el)}
          onStatsRef={(el) => (statsRef.current = el)}
        />
      </div>

      {/* Full-width University Marquee spanning 100% of the screen */}
      <div ref={marqueeRef} className="w-full opacity-0 translate-y-6">
        <UniversityMarquee />
      </div>

      {/* Layered Blue Wave Divider at the bottom of Hero */}
      <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-10 pointer-events-none">
        <svg
          className="relative block w-full h-14 sm:h-20 md:h-28"
          viewBox="0 0 1440 120"
          fill="none"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="hero-blue-wave-1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1a5cff" stopOpacity="0.18" />
              <stop offset="50%" stopColor="#638fff" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#1a5cff" stopOpacity="0.18" />
            </linearGradient>
            <linearGradient id="hero-blue-wave-2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1a5cff" stopOpacity="0.08" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#1a5cff" stopOpacity="0.08" />
            </linearGradient>
          </defs>

          {/* Deep soft blue wave */}
          <path
            d="M0,32 C240,96 480,8 720,56 C960,104 1200,24 1440,64 L1440,120 L0,120 Z"
            fill="url(#hero-blue-wave-2)"
          />

          {/* Crisp primary glow wave */}
          <path
            d="M0,56 C320,112 560,32 800,72 C1040,112 1280,48 1440,80 L1440,120 L0,120 Z"
            fill="url(#hero-blue-wave-1)"
          />

          {/* Subtle top crest stroke line */}
          <path
            d="M0,56 C320,112 560,32 800,72 C1040,112 1280,48 1440,80"
            stroke="#1a5cff"
            strokeOpacity="0.25"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      </div>
    </section>
  );
}