'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CreditCard,
  Users,
  ArrowLeftRight,
  MoreHorizontal,
  Receipt,
  Bell,
  Settings,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const PRIMARY_NAV = [
  { label: 'Home', href: '/dashboard', icon: LayoutDashboard, exact: true },
  { label: 'Pay', href: '/dashboard/payments', icon: CreditCard },
  { label: 'Orgs', href: '/dashboard/organizations', icon: Users },
  { label: 'Announcements', href: '/dashboard/announcements', icon: Bell, desc: 'News from your orgs' },
  // { label: 'Activity', href: '/dashboard/transactions', icon: ArrowLeftRight },
];

const MORE_NAV = [
  { label: 'Receipts', href: '/dashboard/receipts', icon: Receipt, desc: 'Download payment receipts' },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings, desc: 'Account & profile' },
];

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function BottomNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  const moreActive = MORE_NAV.some((item) => isActive(pathname, item.href));

  // Close sheet on route change
  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  // Prevent body scroll when sheet is open
  useEffect(() => {
    if (moreOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [moreOpen]);

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden flex justify-around items-center py-2 px-1 pb-[max(0.625rem,env(safe-area-inset-bottom))] bg-white border-t border-[#e8ecf1]">
        {PRIMARY_NAV.map(({ label, href, icon: Icon, exact }) => {
          const active = isActive(pathname, href, exact);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-0.5 min-w-0 flex-1 text-[0.52rem] font-semibold no-underline transition-colors px-0.5',
                active ? 'text-[#1a5cff]' : 'text-[#7a8ba3]',
              )}
            >
              <Icon className="w-[21px] h-[21px] shrink-0" />
              <span className="truncate max-w-full">{label}</span>
            </Link>
          );
        })}

        <button
          type="button"
          onClick={() => setMoreOpen(true)}
          className={cn(
            'flex flex-col items-center gap-0.5 min-w-0 flex-1 text-[0.52rem] font-semibold border-none bg-transparent cursor-pointer px-0.5 transition-colors',
            moreActive || moreOpen ? 'text-[#1a5cff]' : 'text-[#7a8ba3]',
          )}
        >
          <MoreHorizontal className="w-[21px] h-[21px] shrink-0" />
          <span className="truncate max-w-full">More</span>
        </button>
      </nav>

      {moreOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-black/40 border-none cursor-pointer"
            onClick={() => setMoreOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[24px] border-t border-[#e8ecf1] px-4 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-[0_-12px_40px_rgba(0,0,0,0.1)]">
            <div className="w-10 h-1 rounded-full bg-[#e8ecf1] mx-auto mb-4" />
            <div className="flex items-center justify-between mb-4 px-1">
              <p className="text-[0.95rem] font-bold text-[#1a1a2e]">More</p>
              <button
                type="button"
                onClick={() => setMoreOpen(false)}
                className="w-8 h-8 rounded-full bg-[#f0f2f5] flex items-center justify-center border-none cursor-pointer hover:bg-[#e8ecf1] transition-colors"
              >
                <X className="w-4 h-4 text-[#6b7a8f]" />
              </button>
            </div>
            <div className="space-y-2">
              {MORE_NAV.map(({ label, href, icon: Icon, desc }) => {
                const active = isActive(pathname, href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMoreOpen(false)}
                    className={cn(
                      'flex items-center gap-3.5 px-4 py-3.5 rounded-[16px] no-underline transition-colors',
                      active
                        ? 'bg-[#eef3ff] text-[#1a5cff]'
                        : 'bg-[#f8f9fc] text-[#1a1a2e] hover:bg-[#f0f2f5] active:bg-[#eef3ff]',
                    )}
                  >
                    <div
                      className={cn(
                        'w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0',
                        active ? 'bg-white' : 'bg-white border border-[#e8ecf1]',
                      )}
                    >
                      <Icon className={cn('w-5 h-5', active ? 'text-[#1a5cff]' : 'text-[#6b7a8f]')} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[0.85rem] font-semibold">{label}</p>
                      <p className={cn('text-[0.65rem] mt-0.5', active ? 'text-[#1a5cff]/70' : 'text-[#7a8ba3]')}>
                        {desc}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
