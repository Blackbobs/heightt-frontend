'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { NavLinks } from './NavLinks';
import { MobileMenu } from './MobileMenu';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth-store';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuthStore();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  // Check if user needs onboarding
  const needsOnboarding = user ? !user.profile?.onboardingCompleted : false;
  const dashboardHref = needsOnboarding ? '/onboarding' : '/dashboard';

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 bg-background border-b border-border py-4 px-6 transition-all duration-300 ease-in-out',
          isScrolled && 'bg-white/95 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.04)]'
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-7">
            <NavLinks />
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            {isAuthenticated && user ? (
              <Button variant="primary" size="default" asChild>
                <Link href={dashboardHref}>
                  {needsOnboarding ? 'Complete Onboarding' : 'Dashboard'}
                </Link>
              </Button>
            ) : (
              <>
                <Button variant="outline" size="default" asChild>
                  <Link href="/signin">Sign In</Link>
                </Button>
                <Button variant="primary" size="default" asChild>
                  <Link href="/signup">Create Account</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center gap-2">
            {isAuthenticated && user ? (
              <Button variant="primary" size="sm" className="flex items-center gap-1.5" asChild>
                <Link href={dashboardHref}>
                  {needsOnboarding ? 'Onboarding' : 'Dashboard'}
                </Link>
              </Button>
            ) : (
              <Button variant="primary" size="sm" className="flex items-center gap-1.5" asChild>
                <Link href="/signup">Create Account</Link>
              </Button>
            )}
            <MobileMenu
              isOpen={isMobileMenuOpen}
              onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from hiding behind navbar */}
      <div className="h-20" />
    </>
  );
}