'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { NavLinks } from './NavLinks';
import { MobileMenu } from './MobileMenu';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useAuthStore } from '@/store/auth-store';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  const needsOnboarding = user ? !user.profile?.onboardingCompleted : false;
  const dashboardHref = needsOnboarding ? '/onboarding' : '/dashboard';

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-16 sm:h-18 bg-white dark:bg-[#0B1020] border-b border-[#E2E8F0] dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Logo Left */}
          <Logo />

          {/* Desktop Navigation Center */}
          <div className="hidden lg:flex items-center gap-8">
            <NavLinks />
          </div>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
            <ThemeToggle />
            {isAuthenticated && user ? (
              <Button variant="primary" size="sm" asChild>
                <Link href={dashboardHref}>
                  {needsOnboarding ? 'Complete Onboarding' : 'Dashboard'}
                </Link>
              </Button>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-[#2563EB] transition-colors"
                >
                  Sign In
                </Link>
                <Button variant="primary" size="sm" asChild>
                  <Link href="/signup">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu & Action Button */}
          <div className="lg:hidden flex items-center gap-2">
            {isAuthenticated && user ? (
              <Button variant="primary" size="sm" className="text-xs px-3" asChild>
                <Link href={dashboardHref}>
                  {needsOnboarding ? 'Onboarding' : 'Dashboard'}
                </Link>
              </Button>
            ) : (
              <Button variant="primary" size="sm" className="text-xs px-3" asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            )}
            <MobileMenu
              isOpen={isMobileMenuOpen}
              onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </div>
        </div>
      </header>

      {/* Spacer matching fixed navbar height */}
      <div className="h-16 sm:h-18" />
    </>
  );
}