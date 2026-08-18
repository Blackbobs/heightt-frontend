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
  Building2,
  CreditCard,
  ArrowLeftRight,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth-store';
import { useCurrentUser } from '@/hooks/queries/useUser';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, exact: true },
  { label: 'Payments', href: '/dashboard/payments', icon: CreditCard },
  // { label: 'Transactions', href: '/dashboard/transactions', icon: ArrowLeftRight },
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
  const { user, logout, isAuthenticated } = useAuthStore();
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
      console.log('Logging out...');
      await logout();
      console.log('Logout successful, redirecting to signin');
      router.push('/signin');
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout fails, clear local state and redirect
      router.push('/signin');
    }
  };

  const initials = getInitials();
  const displayName = getDisplayName();
  const studentInfo = getStudentInfo();

  return (
    <aside className="hidden lg:flex flex-col w-[220px] flex-shrink-0 bg-[#f8f9fc] border-r border-[#e8ecf1] h-screen sticky top-0">
      {/* Logo */}
      <div className="px-5 pt-6 pb-5">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-2xl text-[#1a1a2e] no-underline">
          <Building2 className="w-7 h-7 text-[#1a5cff]" strokeWidth={1.8} />
          Heightt
        </Link>
      </div>

      {/* Primary nav */}
      <nav className="flex-1 px-3 flex flex-col gap-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ label, href, icon: Icon, exact }) => {
          const active = exact
            ? pathname === href
            : pathname === href || pathname.startsWith(`${href}/`);
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

        {BOTTOM_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
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
              <Icon className={cn('w-[18px] h-[18px] flex-shrink-0', active ? 'opacity-100' : 'opacity-50')} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User footer with logout button */}
      <div className="px-4 py-4 border-t border-[#e8ecf1]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-[#1a5cff] to-[#4a7aff] flex items-center justify-center text-white font-semibold text-[0.7rem] flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[0.82rem] font-semibold text-[#1a1a2e] leading-tight truncate">
              {displayName}
            </p>
            <p className="text-[0.65rem] text-[#7a8ba3] leading-tight truncate">
              {studentInfo}
            </p>
          </div>
        </div>
        
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-[10px] text-[0.82rem] font-medium text-red-600 hover:bg-red-50 transition-all duration-150 w-full border-none cursor-pointer"
        >
          <LogOut className="w-[18px] h-[18px] flex-shrink-0 opacity-70" />
          Sign out
        </button>
      </div>
    </aside>
  );
}