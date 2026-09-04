'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  CreditCard,
  Building2,
  Receipt,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const MOBILE_NAV = [
  { label: 'Home', href: '/dashboard', icon: Home, exact: true },
  { label: 'Dues', href: '/dashboard/payments', icon: CreditCard },
  { label: 'Organizations', href: '/dashboard/organizations', icon: Building2 },
  { label: 'Receipts', href: '/dashboard/receipts', icon: Receipt },
  { label: 'Profile', href: '/dashboard/profile', icon: User },
];

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden flex justify-around items-center py-2.5 px-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-white dark:bg-[#0B1020] border-t border-[#E2E8F0] dark:border-slate-800 transition-colors">
      {MOBILE_NAV.map(({ label, href, icon: Icon, exact }) => {
        const active = isActive(pathname, href, exact);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'mx-0.5 flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-[10px] font-semibold no-underline transition-colors',
              active ? 'bg-[#2563EB]/8 text-[#2563EB]' : 'text-slate-500 dark:text-slate-400'
            )}
          >
            <Icon className={cn('w-5 h-5 shrink-0', active ? 'text-[#2563EB]' : 'text-slate-400')} />
            <span className="truncate">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
