'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  CreditCard,
  Building2,
  Receipt,
  Bell,
  User,
  Settings,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth-store';
import { useCurrentUser } from '@/hooks/queries/useUser';
import { Logo } from '@/components/ui/Logo';

const NAV_ITEMS = [
  { label: 'Home', href: '/dashboard', icon: Home, exact: true },
  { label: 'Dues', href: '/dashboard/payments', icon: CreditCard },
  { label: 'Organizations', href: '/dashboard/organizations', icon: Building2 },
  { label: 'Receipts', href: '/dashboard/receipts', icon: Receipt },
  { label: 'Notifications', href: '/dashboard/notifications', icon: Bell },
];

const BOTTOM_NAV_ITEMS = [
  { label: 'Profile', href: '/dashboard/profile', icon: User },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { data: userData } = useCurrentUser();

  const currentUser = user || userData;

  const getDisplayName = () => {
    if (!currentUser?.profile) return 'Student User';
    const firstName = currentUser.profile.firstName || '';
    const lastName = currentUser.profile.lastName || '';
    const fullName = `${firstName} ${lastName}`.trim();
    if (fullName) return fullName;
    return currentUser.username || currentUser.email?.split('@')[0] || 'Student User';
  };

  const getAcademicInfo = () => {
    const student = currentUser?.studentProfile;
    const level = student?.currentAcademicLevel?.name || '300 Level';
    return `Computer Science • ${level}`;
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/signin');
    } catch {
      router.push('/signin');
    }
  };

  return (
    <aside className="hidden lg:flex flex-col w-[220px] flex-shrink-0 bg-white dark:bg-[#0B1020] border-r border-[#E2E8F0] dark:border-slate-800 h-screen sticky top-0 font-sans transition-colors">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[#E2E8F0] dark:border-slate-800">
        <Logo />
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ label, href, icon: Icon, exact }) => {
          const active = exact
            ? pathname === href
            : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors no-underline',
                active
                  ? 'bg-[#2563EB] text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0B1020] dark:hover:text-white'
              )}
            >
              <Icon className={cn('w-4 h-4 flex-shrink-0', active ? 'text-white' : 'text-slate-400')} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-3 border-t border-[#E2E8F0] dark:border-slate-800 space-y-1">
        {BOTTOM_NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors no-underline',
                active
                  ? 'bg-[#2563EB] text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#0B1020] dark:hover:text-white'
              )}
            >
              <Icon className={cn('w-4 h-4 flex-shrink-0', active ? 'text-white' : 'text-slate-400')} />
              <span>{label}</span>
            </Link>
          );
        })}

        {/* Student info box */}
        <div className="mt-3 p-3 rounded-lg bg-[#F8FAFC] dark:bg-[#131B2E] border border-[#E2E8F0] dark:border-slate-800 text-xs">
          <p className="font-bold text-[#0B1020] dark:text-white truncate">
            {getDisplayName()}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
            {getAcademicInfo()}
          </p>
          
          <button
            type="button"
            onClick={handleLogout}
            className="mt-3 w-full py-1.5 px-2 bg-transparent text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
