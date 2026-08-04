'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Wallet, CalendarDays, User,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV = [
  { label: 'Home',   href: '/dashboard',         icon: LayoutDashboard },
  { label: 'Pay',    href: '/dashboard/payments', icon: Wallet },
  { label: 'Events', href: '/dashboard/events',   icon: CalendarDays },
  { label: 'Profile',href: '/dashboard/profile',  icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden flex justify-around items-center py-2.5 px-4 pb-[max(0.625rem,env(safe-area-inset-bottom))] bg-white border-t border-[#e8ecf1]">
      {NAV.map(({ label, href, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex flex-col items-center gap-0.5 text-[0.55rem] font-medium no-underline transition-colors',
              active ? 'text-[#1a5cff]' : 'text-[#7a8ba3]'
            )}
          >
            <Icon className="w-[22px] h-[22px]" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
