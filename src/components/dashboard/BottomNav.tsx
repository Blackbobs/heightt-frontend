'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CreditCard,
  Users,
  MoreHorizontal,
  Receipt,
  Bell,
  Settings,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const PRIMARY_NAV = [
  { label: 'Home', href: '/dashboard', icon: LayoutDashboard, exact: true },
  { label: 'Dues', href: '/dashboard/payments', icon: CreditCard },
  { label: 'Orgs', href: '/dashboard/organizations', icon: Users },
  { label: 'Announcements', href: '/dashboard/announcements', icon: Bell, desc: 'News from your orgs' },
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
      <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden flex justify-around items-center py-2 px-1 pb-[max(0.625rem,env(safe-area-inset-bottom))] bg-white/95 backdrop-blur-md border-t border-border shadow-lg">
        {PRIMARY_NAV.map(({ label, href, icon: Icon, exact }) => {
          const active = isActive(pathname, href, exact);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-0.5 min-w-0 flex-1 text-[0.6rem] font-semibold no-underline transition-colors px-0.5',
                active ? 'text-primary' : 'text-muted-foreground',
              )}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="truncate max-w-full">{label}</span>
            </Link>
          );
        })}

        <button
          type="button"
          onClick={() => setMoreOpen(true)}
          className={cn(
            'flex flex-col items-center gap-0.5 min-w-0 flex-1 text-[0.6rem] font-semibold border-none bg-transparent cursor-pointer px-0.5 transition-colors',
            moreActive || moreOpen ? 'text-primary' : 'text-muted-foreground',
          )}
        >
          <MoreHorizontal className="w-5 h-5 shrink-0" />
          <span className="truncate max-w-full">More</span>
        </button>
      </nav>

      {moreOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-black/50 backdrop-blur-xs border-none cursor-pointer"
            onClick={() => setMoreOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[28px] border-t border-border px-5 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl">
            <div className="w-10 h-1 rounded-full bg-border mx-auto mb-4" />
            <div className="flex items-center justify-between mb-4 px-1">
              <p className="text-sm font-bold text-foreground">More Options</p>
              <button
                type="button"
                onClick={() => setMoreOpen(false)}
                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center border-none cursor-pointer hover:bg-muted/80 transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
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
                      'flex items-center gap-3.5 px-4 py-3 rounded-2xl no-underline transition-all',
                      active
                        ? 'bg-primary/10 text-primary font-bold'
                        : 'bg-muted/50 text-foreground hover:bg-muted active:bg-primary/5',
                    )}
                  >
                    <div
                      className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                        active ? 'bg-white text-primary shadow-sm' : 'bg-white border border-border text-muted-foreground',
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold">{label}</p>
                      <p className={cn('text-[11px] mt-0.5', active ? 'text-primary/75' : 'text-muted-foreground')}>
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
