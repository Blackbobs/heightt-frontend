// src/components/dashboard/Sidebar.tsx

"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Receipt,
  Bell,
  Settings,
  LogOut,
  CreditCard,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth-store';
import { useCurrentUser } from '@/hooks/queries/useUser';
import { Logo } from '@/components/ui/Logo';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, exact: true },
  { label: 'Dues', href: '/dashboard/payments', icon: CreditCard },
  { label: 'Organizations', href: '/dashboard/organizations', icon: Users },
  { label: 'Receipts', href: '/dashboard/receipts', icon: Receipt },
  { label: 'Announcements', href: '/dashboard/announcements', icon: Bell },
];

const BOTTOM_ITEMS = [
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { data: userData } = useCurrentUser();

  // Use user from store or from hook
  const currentUser = user || userData;

  const getInitials = () => {
    if (!currentUser?.profile) return 'U';
    const firstName = currentUser.profile.firstName || '';
    const lastName = currentUser.profile.lastName || '';
    return `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase() || 'U';
  };

  const getDisplayName = () => {
    if (!currentUser?.profile) return 'User';
    const firstName = currentUser.profile.firstName || '';
    const lastName = currentUser.profile.lastName || '';
    const fullName = `${firstName} ${lastName}`.trim();
    if (fullName) return fullName;
    return currentUser.username || currentUser.email?.split('@')[0] || 'User';
  };

  const getStudentInfo = () => {
    if (!currentUser?.studentProfile) return 'Student';
    const level = currentUser.studentProfile.currentAcademicLevelId || '';
    const department = currentUser.studentProfile.departmentId || '';
    if (level && department) {
      return `${level}L · ${department}`;
    }
    if (level) return `${level}L`;
    if (department) return department;
    return 'Student';
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/signin');
    } catch (error) {
      console.error('Logout failed:', error);
      router.push('/signin');
    }
  };

  const initials = getInitials();
  const displayName = getDisplayName();
  const studentInfo = getStudentInfo();

  return (
    <aside className="hidden lg:flex flex-col w-[230px] flex-shrink-0 bg-[#F8FAFC] border-r border-border h-screen sticky top-0 font-sans">
      {/* Logo */}
      <div className="px-5 pt-6 pb-5">
        <Logo />
      </div>

      {/* Primary nav */}
      <nav className="flex-1 px-3 flex flex-col gap-1 overflow-y-auto">
        {NAV_ITEMS.map(({ label, href, icon: Icon, exact }) => {
          const active = exact
            ? pathname === href
            : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[0.82rem] font-semibold transition-all duration-150 no-underline',
                active
                  ? 'bg-primary/10 text-primary font-bold shadow-sm'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon
                className={cn('w-[18px] h-[18px] flex-shrink-0', active ? 'text-primary' : 'opacity-60')}
              />
              {label}
            </Link>
          );
        })}

        <div className="border-t border-border my-2 mx-2" />

        {BOTTOM_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[0.82rem] font-semibold transition-all duration-150 no-underline',
                active
                  ? 'bg-primary/10 text-primary font-bold'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className={cn('w-[18px] h-[18px] flex-shrink-0', active ? 'text-primary' : 'opacity-60')} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User footer with logout button */}
      <div className="px-4 py-4 border-t border-border bg-white/50">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-[34px] h-[34px] rounded-xl bg-primary text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-foreground leading-tight truncate">
              {displayName}
            </p>
            <p className="text-[11px] text-muted-foreground leading-tight truncate mt-0.5">
              {studentInfo}
            </p>
          </div>
        </div>
        
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-destructive hover:bg-destructive/10 transition-all w-full border-none cursor-pointer"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          Sign out
        </button>
      </div>
    </aside>
  );
}