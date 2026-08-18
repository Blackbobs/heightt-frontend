'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { X, Menu } from 'lucide-react';
import { NavLinks } from './NavLinks';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth-store';

interface MobileMenuProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function MobileMenu({ isOpen, onToggle }: MobileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, user } = useAuthStore();

  // Check if user needs onboarding
  const needsOnboarding = user ? !user.profile?.onboardingCompleted : false;
  const dashboardHref = needsOnboarding ? '/onboarding' : '/dashboard';

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        if (isOpen) onToggle();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onToggle]);

  // Prevent body scroll when menu is open
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
      {/* Toggle Button in Navbar */}
      <button
        onClick={onToggle}
        className="lg:hidden bg-muted hover:bg-border rounded-lg border border-border p-2 text-foreground cursor-pointer transition-colors flex items-center justify-center"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        {isOpen ? <X className="w-5 h-5 text-primary" /> : <Menu className="w-5 h-5 text-foreground" />}
      </button>

      {/* Mobile Menu Overlay Drawer */}
      <div
        ref={menuRef}
        className={cn(
          'fixed inset-x-0 top-0 bg-background/98 backdrop-blur-xl border-b border-border p-6 z-50 transition-all duration-300 ease-in-out lg:hidden shadow-2xl max-h-[90vh] overflow-y-auto',
          isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-4 pointer-events-none'
        )}
      >
        {/* Header inside mobile menu */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-border">
          <Logo />
          <button
            onClick={onToggle}
            className="p-2 rounded-lg bg-muted text-foreground hover:bg-border transition-colors flex items-center gap-1 text-xs font-semibold border border-border cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-4 h-4 text-primary" />
            <span>Close</span>
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <NavLinks
            className="flex-col items-start gap-4 w-full"
            onClick={onToggle}
          />
          <div className="flex flex-col gap-3 pt-4 border-t border-border">
            {isAuthenticated && user ? (
              <>
                <Button variant="primary" size="default" className="w-full justify-center" asChild onClick={onToggle}>
                  <Link href={dashboardHref}>
                    {needsOnboarding ? 'Complete Onboarding' : 'Dashboard'}
                  </Link>
                </Button>
                <Button variant="outline" size="default" className="w-full justify-center" asChild onClick={onToggle}>
                  <Link href="/signin">Sign Out</Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="default" className="w-full justify-center" asChild onClick={onToggle}>
                  <Link href="/signin">Sign In</Link>
                </Button>
                <Button variant="primary" size="default" className="w-full justify-center" asChild onClick={onToggle}>
                  <Link href="/signup">Create Account</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
    </>
  );
}