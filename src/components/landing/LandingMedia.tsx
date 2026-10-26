'use client';

import { useLayoutEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';

interface SchoolNodeProps {
  code: string;
  location: string;
  name: string;
  x: number;
  y: number;
}

function SchoolNode({ code, location, name, x, y }: SchoolNodeProps) {
  return (
    <g className="school-node" transform={`translate(${x} ${y})`}>
      <title>{name}</title>
      <g className="node-visual">
        <circle className="school-node-ring" r="35" />
        <circle className="school-node-core" r="29" />
        <circle className="school-node-status" cx="23" cy="-23" r="5" />
        <text className="school-node-code" textAnchor="middle" y="5">{code}</text>
        <text className="school-node-name" textAnchor="middle" y="53">{name}</text>
        <text className="school-node-location" textAnchor="middle" y="68">{location}</text>
      </g>
    </g>
  );
}

export function HeroMedia() {
  const networkRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = networkRef.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        '.school-node',
        { opacity: 0, scale: 0.72, transformOrigin: 'center' },
        { opacity: 1, scale: 1, duration: 0.65, stagger: 0.08, ease: 'back.out(1.5)' },
      );
    }, root);

    const nodes = root.querySelectorAll<SVGGElement>('.school-node, .heightt-node');
    const handlers = Array.from(nodes, (node) => {
      const visual = node.querySelector<SVGGElement>('.node-visual');
      const handlePointerEnter = () => {
        gsap.to(visual, {
          scale: 1.035,
          duration: 0.2,
          ease: 'power2.out',
          overwrite: 'auto',
          transformOrigin: 'center',
        });
      };
      const handlePointerLeave = () => {
        gsap.to(visual, {
          scale: 1,
          duration: 0.24,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      };

      node.addEventListener('pointerenter', handlePointerEnter);
      node.addEventListener('pointerleave', handlePointerLeave);
      return { node, handlePointerEnter, handlePointerLeave };
    });

    return () => {
      handlers.forEach(({ node, handlePointerEnter, handlePointerLeave }) => {
        node.removeEventListener('pointerenter', handlePointerEnter);
        node.removeEventListener('pointerleave', handlePointerLeave);
      });
      context.revert();
    };
  }, []);

  return (
    <div ref={networkRef} className="institution-network">
      <div className="network-heading">
        <div>
          <strong>One trusted campus network</strong>
          <span>Institutions connected through shared payment rails</span>
        </div>
        <span>6 campuses</span>
      </div>
      <svg className="network-map" viewBox="0 0 560 470" role="img" aria-labelledby="network-title network-description">
        <title id="network-title">Heightt institution network</title>
        <desc id="network-description">Six university profiles connected through Heightt.</desc>

        <g className="network-links" aria-hidden="true">
          <path d="M280 235 L110 95" />
          <path d="M280 235 L450 90" />
          <path d="M280 235 L85 270" />
          <path d="M280 235 L480 265" />
          <path d="M280 235 L155 390" />
          <path d="M280 235 L405 390" />
          <path className="network-link-secondary" d="M110 95 Q280 40 450 90" />
          <path className="network-link-secondary" d="M85 270 Q95 355 155 390" />
          <path className="network-link-secondary" d="M480 265 Q470 350 405 390" />
        </g>

        <g className="network-pulses" aria-hidden="true">
          <circle r="4"><animateMotion dur="4s" repeatCount="indefinite" path="M110 95 L280 235" /></circle>
          <circle r="4"><animateMotion dur="5s" repeatCount="indefinite" path="M450 90 L280 235" /></circle>
          <circle r="4"><animateMotion dur="4.5s" repeatCount="indefinite" path="M155 390 L280 235" /></circle>
        </g>

        <SchoolNode code="UNILAG" name="University of Lagos" location="Lagos" x={110} y={95} />
        <SchoolNode code="UI" name="University of Ibadan" location="Ibadan" x={450} y={90} />
        <SchoolNode code="OAU" name="Obafemi Awolowo" location="Ile-Ife" x={85} y={270} />
        <SchoolNode code="UNN" name="University of Nigeria" location="Nsukka" x={480} y={265} />
        <SchoolNode code="FUNAAB" name="FUNAAB" location="Abeokuta" x={155} y={390} />
        <SchoolNode code="ABU" name="Ahmadu Bello" location="Zaria" x={405} y={390} />

        <g className="heightt-node" transform="translate(280 235)">
          <g className="node-visual">
            <circle className="heightt-node-ring" r="54" />
            <image
              href="https://res.cloudinary.com/dbcgdaigj/image/upload/v1788250444/logos/in7uxxxzzbxwxgoko64k.png"
              x="-46"
              y="-46"
              width="92"
              height="92"
            />
          </g>
        </g>
      </svg>
    </div>
  );
}

export function CampusMedia() {
  return (
    <div className="campus-media">
      <div className="campus-photo">
        <Image
          src="https://images.unsplash.com/photo-1758270704464-f980b03b9633?auto=format&fit=crop&q=82&w=1600"
          alt="University students using their phones between lectures"
          fill
          sizes="(max-width: 900px) 100vw, 520px"
        />
      </div>
      <div className="campus-media-copy">
        <h2>Made for the people behind every campus payment.</h2>
        <p>From a student paying a due to an executive closing the books, everyone works from the same clear record.</p>
      </div>
    </div>
  );
}
