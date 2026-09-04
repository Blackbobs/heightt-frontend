'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Bell,
  ChevronDown,
  Settings,
  LogOut,
  User as UserIcon,
  ArrowLeft,
} from 'lucide-react';
import { User } from '@/lib/api/users';
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
  pageTitle = 'Dashboard',
  user: propUser,
  onNotificationClick,
}: DashboardHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const PRIMARY_5_NAV_PATHS = [
    '/dashboard',
    '/dashboard/payments',
    '/dashboard/transactions',
    '/dashboard/receipts',
    '/dashboard/notifications',
  ];

  const isPrimaryNavPage = PRIMARY_5_NAV_PATHS.includes(pathname);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const authUser = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const user = propUser || authUser;

  const { data: unreadCount = 0 } = useUnreadNotificationCount();

  const handleNotificationClick = () => {
    if (onNotificationClick) {
      onNotificationClick();
    } else {
      router.push('/dashboard/notifications');
    }
  };

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    try {
      await logout();
      router.push('/signin');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = () => {
    if (!user?.profile) return 'U';
    const firstName = user.profile.firstName || '';
    const lastName = user.profile.lastName || '';
    return `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase() || 'U';
  };

  const getDisplayName = () => {
    if (!user?.profile) return 'Student User';
    const firstName = user.profile.firstName || '';
    const lastName = user.profile.lastName || '';
    const fullName = `${firstName} ${lastName}`.trim();
    if (fullName) return fullName;
    return user.username || user.email?.split('@')[0] || 'Student User';
  };

  const displayName = getDisplayName();

  return (
    <header className="px-4 sm:px-6 py-3.5 bg-white dark:bg-[#0B1020] border-b border-[#E2E8F0] dark:border-slate-800 flex-shrink-0 sticky top-0 z-20 transition-colors">
      {isPrimaryNavPage ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* On Mobile: Show Logo */}
            <div className="lg:hidden">
              <Logo />
            </div>
            {/* On Desktop: Show Page Title */}
            <h1 className="hidden lg:block text-base sm:text-lg font-bold text-[#0B1020] dark:text-white">
              {pageTitle}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            {/* Notification button */}
            <button
              type="button"
              onClick={handleNotificationClick}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 relative transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#2563EB] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* User Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="w-6 h-6 rounded bg-[#2563EB] text-white text-xs font-bold flex items-center justify-center">
                  {getInitials()}
                </div>
                <span className="text-xs font-semibold hidden sm:inline text-[#0B1020] dark:text-white">
                  {displayName}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 rounded-lg p-1 shadow-md z-50 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      router.push('/dashboard/profile');
                    }}
                    className="w-full text-left px-3 py-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-2 font-medium"
                  >
                    <UserIcon className="w-3.5 h-3.5" />
                    <span>Profile</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      router.push('/dashboard/settings');
                    }}
                    className="w-full text-left px-3 py-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-2 font-medium"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Settings</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 rounded hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 flex items-center gap-2 font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Subpages header with Back button & Title & ThemeToggle */
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined' && window.history.length > 1) {
                  router.back();
                } else {
                  router.push('/dashboard');
                }
              }}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="text-base font-bold text-[#0B1020] dark:text-white">
              {pageTitle}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      )}
    </header>
  );
}