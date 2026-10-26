'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowLeft, Bell, ChevronDown, LogOut, Settings, User as UserIcon } from 'lucide-react';
import type { User } from '@/lib/api/users';
import { useAuthStore } from '@/store/auth-store';
import { useUnreadNotificationCount } from '@/hooks/queries/useCommunication';
import { Logo } from '@/components/ui/Logo';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { toast } from 'sonner';

interface DashboardHeaderProps {
  pageTitle?: string;
  user?: User | null;
  onNotificationClick?: () => void;
}

export function DashboardHeader({
  pageTitle = 'Overview',
  user: propUser,
  onNotificationClick,
}: DashboardHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isMainDashboard = (pathname || '').replace(/\/$/, '') === '/dashboard';
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const authUser = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const user = propUser || authUser;
  const { data: unreadCount = 0 } = useUnreadNotificationCount();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initials = (() => {
    const firstName = user?.profile?.firstName || '';
    const lastName = user?.profile?.lastName || '';
    return `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase() || 'U';
  })();

  const displayName = (() => {
    const fullName = `${user?.profile?.firstName || ''} ${user?.profile?.lastName || ''}`.trim();
    return fullName || user?.username || user?.email?.split('@')[0] || 'Student';
  })();

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    try {
      await logout();
      router.push('/signin');
      toast.success('Logged out successfully');
    } catch {
      toast.error('Failed to logout');
    }
  };

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) router.back();
    else router.push('/dashboard');
  };

  return (
    <header className="sticky top-0 z-20 flex h-[64px] flex-shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 transition-colors dark:border-[#30343A] dark:bg-[#181A1D] sm:px-6 lg:h-[72px]">
      <div className="flex min-w-0 items-center gap-3">
        {isMainDashboard ? (
          <div className="lg:hidden"><Logo imgClassName="h-7" /></div>
        ) : (
          <button
            type="button"
            onClick={handleBack}
            className="grid size-9 place-items-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50 dark:border-[#30343A] dark:text-slate-300 dark:hover:bg-[#23262B] lg:hidden"
            aria-label="Go back"
          >
            <ArrowLeft className="size-4" />
          </button>
        )}
        <div className="min-w-0">
          <h1 className="truncate text-base font-semibold tracking-[-0.02em] text-[#0B1020] dark:text-white sm:text-lg">{pageTitle}</h1>
          <p className="hidden text-xs text-slate-500 dark:text-slate-400 lg:block">Manage your Heightt account</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <button
          type="button"
          onClick={() => {
            if (onNotificationClick) onNotificationClick();
            else router.push('/dashboard/notifications');
          }}
          className="relative grid size-9 place-items-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50 dark:border-[#30343A] dark:text-slate-300 dark:hover:bg-[#23262B]"
          aria-label="Notifications"
        >
          <Bell className="size-4" />
          {unreadCount > 0 && <span className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-[#2563EB] text-[9px] font-bold text-white">{unreadCount > 9 ? '9+' : unreadCount}</span>}
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen((current) => !current)}
            className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-1.5 text-slate-700 transition-colors hover:bg-slate-50 dark:border-[#30343A] dark:text-slate-200 dark:hover:bg-[#23262B]"
          >
            <span className="grid size-6 place-items-center rounded-md bg-[#2563EB] text-[10px] font-bold text-white">{initials}</span>
            <span className="hidden max-w-28 truncate text-xs font-semibold sm:block">{displayName}</span>
            <ChevronDown className="hidden size-3.5 text-slate-400 sm:block" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 z-50 mt-2 w-48 rounded-lg border border-slate-200 bg-white p-1 text-xs dark:border-[#30343A] dark:bg-[#202328]">
              <button type="button" onClick={() => { setIsDropdownOpen(false); router.push('/dashboard/profile'); }} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-[#2A2D32]"><UserIcon className="size-3.5" /> Profile</button>
              <button type="button" onClick={() => { setIsDropdownOpen(false); router.push('/dashboard/settings'); }} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-[#2A2D32]"><Settings className="size-3.5" /> Settings</button>
              <button type="button" onClick={handleLogout} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"><LogOut className="size-3.5" /> Log out</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
