'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { X, Menu } from 'lucide-react';
import { NavLinks } from './NavLinks';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth-store';

import { ThemeToggle } from '@/components/ui/ThemeToggle';

interface MobileMenuProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function MobileMenu({ isOpen, onToggle }: MobileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, user } = useAuthStore();

  const needsOnboarding = user ? !user.profile?.onboardingCompleted : false;
  const dashboardHref = needsOnboarding ? '/onboarding' : '/dashboard';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        if (isOpen) onToggle();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onToggle]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      <button
        onClick={onToggle}
        className="lg:hidden p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        {isOpen ? <X className="w-5 h-5 text-[#2563EB]" /> : <Menu className="w-5 h-5" />}
      </button>

      <div
        ref={menuRef}
        className={cn(
          'fixed inset-x-0 top-0 bg-white dark:bg-[#0B1020] border-b border-slate-200 dark:border-slate-800 p-6 z-50 transition-all duration-200 lg:hidden max-h-[90vh] overflow-y-auto',
          isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-4 pointer-events-none'
        )}
      >
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
          <Logo />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={onToggle}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold"
              aria-label="Close menu"
            >
              <X className="w-4 h-4 text-[#2563EB]" />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <NavLinks
            className="flex-col items-start gap-4 w-full"
            onClick={onToggle}
          />
          <div className="flex flex-col gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            {isAuthenticated && user ? (
              <Button variant="primary" size="default" className="w-full justify-center" asChild onClick={onToggle}>
                <Link href={dashboardHref}>
                  {needsOnboarding ? 'Complete Onboarding' : 'Dashboard'}
                </Link>
              </Button>
            ) : (
              <>
                <Link
                  href="/signin"
                  onClick={onToggle}
                  className="w-full py-2.5 text-center text-sm font-semibold border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Sign In
                </Link>
                <Button variant="primary" size="default" className="w-full justify-center" asChild onClick={onToggle}>
                  <Link href="/signup">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
    </>
  );
}