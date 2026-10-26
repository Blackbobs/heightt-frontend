'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  CircleUserRound,
  LayoutDashboard,
  ReceiptText,
  UsersRound,
  WalletCards,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const MOBILE_NAV = [
  { label: 'Home', href: '/dashboard', icon: LayoutDashboard, exact: true },
  { label: 'Payments', href: '/dashboard/payments', icon: WalletCards },
  { label: 'Groups', href: '/dashboard/organizations', icon: UsersRound },
  { label: 'Receipts', href: '/dashboard/receipts', icon: ReceiptText },
  { label: 'Profile', href: '/dashboard/profile', icon: CircleUserRound },
];

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-5 border-t border-slate-200 bg-white px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] dark:border-[#30343A] dark:bg-[#181A1D] lg:hidden">
      {MOBILE_NAV.map(({ label, href, icon: Icon, exact }) => {
        const active = isActive(pathname, href, exact);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'relative flex min-w-0 flex-col items-center gap-1 border-t-2 px-1 pb-1 pt-2 text-[10px] font-semibold no-underline transition-colors',
              active
                ? 'border-[#2563EB] text-[#2563EB]'
                : 'border-transparent text-slate-500 dark:text-slate-400'
            )}
            aria-current={active ? 'page' : undefined}
          >
            <Icon className={cn('h-5 w-5 shrink-0', active ? 'stroke-[2.25]' : 'stroke-[1.75]')} />
            <span className="truncate">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
