'use client';

import { useEffect, useRef } from 'react';
import { BackgroundIcons } from './BackgroundIcons';
import { HeroContent } from './HeroContent';
import { PhoneFrame } from './PhoneFrame';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const phoneWrapperRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
      defaults: {
        ease: 'power3.out',
        duration: 1,
      },
    });

    // Animate content
    if (badgeRef.current) {
      tl.to(badgeRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
      });
    }

    if (titleRef.current) {
      tl.to(
        titleRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
        },
        '-=0.3'
      );
    }

    if (descriptionRef.current) {
      tl.to(
        descriptionRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
        },
        '-=0.5'
      );
    }

    if (actionsRef.current) {
      tl.to(
        actionsRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
        },
        '-=0.4'
      );
    }

    if (statsRef.current) {
      tl.to(
        statsRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
        },
        '-=0.4'
      );
    }

    // Animate phone with more delay
    if (phoneWrapperRef.current) {
      tl.to(
        phoneWrapperRef.current,
        {
          opacity: 1,
          scale: 1,
          rotate: 0,
          duration: 1.2,
          ease: 'back.out(1.7)',
        },
        '-=0.3'
      );
    }

    // Phone float animation
    if (phoneRef.current) {
      gsap.to(phoneRef.current, {
        y: -15,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });
    }

    // Scroll animations
    if (phoneRef.current) {
      gsap.to(phoneRef.current, {
        scale: 0.95,
        opacity: 0.6,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'bottom bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }

    const contentEl = document.querySelector('.hero-content-wrapper');
    if (contentEl) {
      gsap.to(contentEl, {
        opacity: 0.3,
        y: -30,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'bottom bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen flex items-center bg-background py-16 sm:py-24 lg:py-32 px-4 sm:px-6 md:px-8 lg:px-12 relative overflow-hidden"
    >
      <BackgroundIcons />

      <div className="max-w-7xl mx-auto w-full relative z-1">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 xl:gap-32 items-center">
          <div className="hero-content-wrapper order-1 lg:order-1">
            <HeroContent
              onBadgeRef={(el) => (badgeRef.current = el)}
              onTitleRef={(el) => (titleRef.current = el)}
              onDescriptionRef={(el) => (descriptionRef.current = el)}
              onActionsRef={(el) => (actionsRef.current = el)}
              onStatsRef={(el) => (statsRef.current = el)}
            />
          </div>

          <div
            ref={phoneWrapperRef}
            className="order-2 lg:order-2 opacity-0 scale-90 -rotate-2 flex justify-center lg:justify-end"
          >
            <PhoneFrame />
          </div>
        </div>
      </div>
    </section>
  );
}