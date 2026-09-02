'use client';

import {
  CreditCard,
  Coins,
  Landmark,
  TrendingUp,
  Receipt,
  GraduationCap,
  Users,
  Building2,
  BookOpen,
  Trophy,
  ShieldCheck,
  Globe,
  Sparkles,
  QrCode,
  FileCheck2,
  School,
  Award,
} from 'lucide-react';

const icons = [
  // Left side cluster
  { Icon: GraduationCap, size: 44, position: 'top-[16%] left-[10%]', delay: '1.2s', rotation: '-rotate-6', opacity: 'text-primary/30' },
  { Icon: Receipt, size: 34, position: 'top-[30%] left-[4%]', delay: '2.5s', rotation: 'rotate-8', opacity: 'text-primary/22' },
  { Icon: QrCode, size: 30, position: 'top-[44%] left-[12%]', delay: '0.8s', rotation: '-rotate-12', opacity: 'text-primary/28' },
  { Icon: Building2, size: 40, position: 'top-[58%] left-[5%]', delay: '3.1s', rotation: 'rotate-6', opacity: 'text-primary/25' },
  { Icon: ShieldCheck, size: 36, position: 'top-[74%] left-[11%]', delay: '1.8s', rotation: '-rotate-8', opacity: 'text-primary/30' },
  { Icon: School, size: 34, position: 'top-[88%] left-[4%]', delay: '2.2s', rotation: 'rotate-10', opacity: 'text-primary/22' },

  // Right side cluster
  { Icon: CreditCard, size: 40, position: 'top-[8%] right-[4%]', delay: '0.5s', rotation: '-rotate-12', opacity: 'text-primary/25' },
  { Icon: Coins, size: 38, position: 'top-[20%] right-[12%]', delay: '2.0s', rotation: 'rotate-6', opacity: 'text-primary/30' },
  { Icon: Users, size: 36, position: 'top-[34%] right-[5%]', delay: '1.5s', rotation: '-rotate-6', opacity: 'text-primary/22' },
  { Icon: TrendingUp, size: 38, position: 'top-[62%] right-[6%]', delay: '0.9s', rotation: '-rotate-10', opacity: 'text-primary/25' },
  { Icon: FileCheck2, size: 32, position: 'top-[76%] right-[11%]', delay: '2.7s', rotation: 'rotate-8', opacity: 'text-primary/30' },
  { Icon: Award, size: 34, position: 'top-[90%] right-[5%]', delay: '1.4s', rotation: '-rotate-6', opacity: 'text-primary/22' },

  // Center subtle accents
  { Icon: Sparkles, size: 26, position: 'top-[10%] left-[28%]', delay: '4.0s', rotation: 'rotate-12', opacity: 'text-primary/20' },
  { Icon: Globe, size: 32, position: 'top-[14%] right-[28%]', delay: '2.2s', rotation: '-rotate-6', opacity: 'text-primary/20' },
  { Icon: BookOpen, size: 30, position: 'top-[70%] left-[24%]', delay: '1.7s', rotation: 'rotate-4', opacity: 'text-primary/20' },
  { Icon: Trophy, size: 28, position: 'top-[68%] right-[24%]', delay: '3.0s', rotation: '-rotate-8', opacity: 'text-primary/20' },
];

export function BackgroundIcons() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {icons.map(({ Icon, size, position, delay, rotation, opacity }, index) => (
        <div
          key={index}
          className={`absolute ${position} ${rotation} ${opacity} transition-all duration-700`}
          style={{
            animationDelay: delay,
          }}
        >
          <Icon
            size={size}
            strokeWidth={1.75}
            className="animate-float-icon drop-shadow-[0_4px_12px_rgba(26,92,255,0.12)]"
          />
        </div>
      ))}
    </div>
  );
}