'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Wallet, PiggyBank, CreditCard, Receipt,
  Bell, CalendarDays, Settings, LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { label: 'Dashboard',     href: '/dashboard',             icon: LayoutDashboard },
  { label: 'Wallet',        href: '/dashboard/wallet',       icon: Wallet },
  { label: 'Savings',       href: '/dashboard/savings',      icon: PiggyBank },
  { label: 'Payments',      href: '/dashboard/payments',     icon: CreditCard },
  { label: 'Receipts',      href: '/dashboard/receipts',     icon: Receipt },
  { label: 'Announcements', href: '/dashboard/announcements',icon: Bell },
  { label: 'Events',        href: '/dashboard/events',       icon: CalendarDays },
];

const BOTTOM_ITEMS = [
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  { label: 'Sign out',  href: '/signin',              icon: LogOut },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-[220px] flex-shrink-0 bg-[#f8f9fc] border-r border-[#e8ecf1] h-screen sticky top-0">
      {/* Logo */}
      <div className="px-5 pt-6 pb-5">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-[1rem] text-[#1a1a2e] no-underline">
          <CampusPayLogo />
          Campus<span className="text-[#1a5cff]">Pay</span>
        </Link>
      </div>

      {/* Primary nav */}
      <nav className="flex-1 px-3 flex flex-col gap-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-[10px] text-[0.82rem] font-medium transition-all duration-150 no-underline',
                active
                  ? 'bg-[#eef3ff] text-[#1a5cff]'
                  : 'text-[#6b7a8f] hover:bg-[#f0f2f5] hover:text-[#1a1a2e]'
              )}
            >
              <Icon
                className={cn('w-[18px] h-[18px] flex-shrink-0', active ? 'opacity-100' : 'opacity-50')}
              />
              {label}
            </Link>
          );
        })}

        <div className="border-t border-[#e8ecf1] my-2 mx-2" />

        {BOTTOM_ITEMS.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-[10px] text-[0.82rem] font-medium text-[#6b7a8f] hover:bg-[#f0f2f5] hover:text-[#1a1a2e] transition-all duration-150 no-underline"
          >
            <Icon className="w-[18px] h-[18px] flex-shrink-0 opacity-50" />
            {label}
          </Link>
        ))}
      </nav>

      {/* User footer */}
      <div className="px-4 py-4 border-t border-[#e8ecf1] flex items-center gap-3">
        <div className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-[#1a5cff] to-[#4a7aff] flex items-center justify-center text-white font-semibold text-[0.7rem] flex-shrink-0">
          AO
        </div>
        <div>
          <p className="text-[0.82rem] font-semibold text-[#1a1a2e] leading-tight">Adaeze O.</p>
          <p className="text-[0.65rem] text-[#7a8ba3] leading-tight">Student · 400L CSC</p>
        </div>
      </div>
    </aside>
  );
}

function CampusPayLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
      <rect x="2" y="6" width="28" height="20" rx="6" stroke="#1a5cff" strokeWidth="2.5" />
      <path d="M10 12h12M10 16h8M10 20h6" stroke="#1a5cff" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="22" cy="20" r="2" fill="#1a5cff" />
    </svg>
  );
}
