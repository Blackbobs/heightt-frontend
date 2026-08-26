'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function useScrollReveal() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    if (!container) return;

    // Find all reveal targets inside container or use container itself
    const targets = container.querySelectorAll('.reveal-on-scroll');
    const elementsToAnimate = targets.length > 0 ? targets : [container];

    const ctx = gsap.context(() => {
      elementsToAnimate.forEach((el, index) => {
        gsap.fromTo(
          el,
          {
            opacity: 0,
            y: 35,
            scale: 0.98,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            delay: (index % 4) * 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    }, container);

    return () => {
      ctx.revert();
    };
  }, []);

  return containerRef;
}
