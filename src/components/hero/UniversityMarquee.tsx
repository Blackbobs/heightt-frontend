'use client';

import React from 'react';
import {
  GraduationCap,
  Building,
  Landmark,
  BookOpen,
  Award,
  Shield,
  School,
  Compass,
} from 'lucide-react';

interface University {
  name: string;
  shortName: string;
  location: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
}

const universities: University[] = [
  {
    name: 'University of Lagos',
    shortName: 'UNILAG',
    location: 'Akoka, Lagos',
    icon: Landmark,
  },
  {
    name: 'University of Ibadan',
    shortName: 'UI',
    location: 'Ibadan, Oyo',
    icon: School,
  },
  {
    name: 'Obafemi Awolowo University',
    shortName: 'OAU',
    location: 'Ile-Ife, Osun',
    icon: Building,
  },
  {
    name: 'Covenant University',
    shortName: 'CU',
    location: 'Ota, Ogun',
    icon: Award,
  },
  {
    name: 'University of Nigeria, Nsukka',
    shortName: 'UNN',
    location: 'Nsukka, Enugu',
    icon: Shield,
  },
  {
    name: 'Ahmadu Bello University',
    shortName: 'ABU',
    location: 'Zaria, Kaduna',
    icon: BookOpen,
  },
  {
    name: 'Fed. Univ. of Tech. Akure',
    shortName: 'FUTA',
    location: 'Akure, Ondo',
    icon: Compass,
  },
  {
    name: 'University of Benin',
    shortName: 'UNIBEN',
    location: 'Benin City, Edo',
    icon: GraduationCap,
  },
  {
    name: 'Lagos State University',
    shortName: 'LASU',
    location: 'Ojo, Lagos',
    icon: Landmark,
  },
  {
    name: 'Babcock University',
    shortName: 'BABCOCK',
    location: 'Ilishan-Remo, Ogun',
    icon: School,
  },
];

export function UniversityMarquee() {
  // Quadruple array to guarantee infinite loop on wide displays
  const marqueeItems = [
    ...universities,
    ...universities,
    ...universities,
    ...universities,
  ];

  return (
    <div className="w-full pt-10 sm:pt-12 flex flex-col items-center relative z-20">
      {/* Subtle Label */}
      <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-muted-foreground/70 mb-4 sm:mb-5 text-center px-4">
        Trusted by student organisations across leading African universities
      </p>

      {/* Full-width Marquee Track with Horizontal Edge Fade Masks */}
      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent_0%,black_8%,black_92%,transparent_100%)]">
        <div className="animate-marquee flex items-center gap-5 sm:gap-8 py-2">
          {marqueeItems.map((uni, idx) => {
            const Icon = uni.icon;

            return (
              <div
                key={idx}
                className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/70 hover:bg-white border border-border/70 hover:border-primary/40 transition-all duration-300 group cursor-default shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-lg shrink-0 backdrop-blur-sm"
              >
                <div className="w-8 h-8 rounded-xl bg-muted/80 group-hover:bg-primary/10 border border-border/70 group-hover:border-primary/20 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                  <Icon size={16} />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-600 group-hover:text-foreground tracking-tight transition-colors">
                    {uni.shortName}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                    {uni.name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
