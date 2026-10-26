'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  CircleUserRound,
  Bell,
  LayoutDashboard,
  ReceiptText,
  Settings,
  LogOut,
  UsersRound,
  WalletCards,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth-store';
import { useCurrentUser } from '@/hooks/queries/useUser';
import { Logo } from '@/components/ui/Logo';
import { institutionsApi, type AcademicLevel, type Department } from '@/lib/api/institutions';
import { queryKeys } from '@/lib/api/keys';

const NAV_ITEMS = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard, exact: true },
  { label: 'Payments', href: '/dashboard/payments', icon: WalletCards },
  { label: 'Organizations', href: '/dashboard/organizations', icon: UsersRound },
  { label: 'Receipts', href: '/dashboard/receipts', icon: ReceiptText },
  { label: 'Notifications', href: '/dashboard/notifications', icon: Bell },
];

const BOTTOM_NAV_ITEMS = [
  { label: 'Profile', href: '/dashboard/profile', icon: CircleUserRound },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { data: userData } = useCurrentUser();

  const currentUser = userData || user;
  const student = currentUser?.studentProfile;

  const { data: departmentsResponse } = useQuery({
    queryKey: queryKeys.institutions.departments(student?.facultyId || ''),
    queryFn: () => institutionsApi.getDepartmentsByFaculty(student?.facultyId || ''),
    enabled: Boolean(student?.facultyId && student.departmentId),
    staleTime: 10 * 60 * 1000,
  });

  const departments = Array.isArray(departmentsResponse)
    ? departmentsResponse as Department[]
    : ((departmentsResponse as { data?: Department[] } | undefined)?.data || []);
  const department = departments.find((item) => item.id === student?.departmentId);

  const { data: academicLevelsResponse } = useQuery({
    queryKey: ['institutions', 'departments', student?.departmentId, 'academic-levels'],
    queryFn: () => institutionsApi.getAcademicLevelsByDepartment(student?.departmentId || ''),
    enabled: Boolean(student?.departmentId && !student.currentAcademicLevel),
    staleTime: 10 * 60 * 1000,
  });

  const academicLevels = Array.isArray(academicLevelsResponse)
    ? academicLevelsResponse as AcademicLevel[]
    : ((academicLevelsResponse as { data?: AcademicLevel[] } | undefined)?.data || []);
  const academicLevel = student?.currentAcademicLevel || academicLevels.find(
    (level) => level.id === student?.currentAcademicLevelId,
  );

  const getDisplayName = () => {
    if (!currentUser?.profile) return 'Student User';
    const firstName = currentUser.profile.firstName || '';
    const lastName = currentUser.profile.lastName || '';
    const fullName = `${firstName} ${lastName}`.trim();
    if (fullName) return fullName;
    return currentUser.username || currentUser.email?.split('@')[0] || 'Student User';
  };

  const getAcademicInfo = () => {
    const details = [department?.name, academicLevel?.name].filter(Boolean);
    return details.length ? details.join(' • ') : 'Academic profile incomplete';
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
    <aside className="hidden lg:flex h-screen w-[248px] flex-shrink-0 flex-col border-r border-slate-200 bg-white font-sans transition-colors dark:border-[#30343A] dark:bg-[#181A1D]">
      {/* Logo */}
      <div className="flex h-[72px] items-center border-b border-slate-200 px-6 dark:border-[#30343A]">
        <Logo />
      </div>

      {/* Main Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
        {NAV_ITEMS.map(({ label, href, icon: Icon, exact }) => {
          const active = exact
            ? pathname === href
            : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors no-underline',
                active
                  ? 'bg-blue-50 text-[#1D4ED8] dark:bg-[#1D2941] dark:text-blue-300'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-[#0B1020] dark:text-slate-400 dark:hover:bg-[#23262B] dark:hover:text-white'
              )}
            >
              <Icon className={cn('h-[18px] w-[18px] flex-shrink-0', active ? 'text-[#2563EB]' : 'text-slate-400')} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="space-y-1 border-t border-slate-200 p-3 dark:border-[#30343A]">
        {BOTTOM_NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors no-underline',
                active
                  ? 'bg-blue-50 text-[#1D4ED8] dark:bg-[#1D2941] dark:text-blue-300'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-[#0B1020] dark:text-slate-400 dark:hover:bg-[#23262B] dark:hover:text-white'
              )}
            >
              <Icon className={cn('h-[18px] w-[18px] flex-shrink-0', active ? 'text-[#2563EB]' : 'text-slate-400')} />
              <span>{label}</span>
            </Link>
          );
        })}

        {/* Student info box */}
        <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs dark:border-[#30343A] dark:bg-[#202328]">
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
