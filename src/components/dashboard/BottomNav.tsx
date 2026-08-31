'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CreditCard,
  Users,
  Receipt,
  Bell,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const PRIMARY_NAV = [
  { label: 'Home', href: '/dashboard', icon: LayoutDashboard, exact: true },
  { label: 'Dues', href: '/dashboard/payments', icon: CreditCard },
  { label: 'Orgs', href: '/dashboard/organizations', icon: Users },
  { label: 'Announcements', href: '/dashboard/announcements', icon: Bell },
  { label: 'Receipts', href: '/dashboard/receipts', icon: Receipt },
];

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function BottomNav() {
  const pathname = usePathname();

  return (
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
    </nav>
  );
}
