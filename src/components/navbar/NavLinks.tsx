'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

const navItems: NavItem[] = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Transparency', href: '#transparency' },
  { label: 'Study Tool', href: 'https://www.studyhelp.site', external: true },
  { label: 'FAQ', href: '#faq' },
];

interface NavLinksProps {
  className?: string;
  onClick?: () => void;
}

export function NavLinks({ className = '', onClick }: NavLinksProps) {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    if (pathname !== '/') return;

    const handleScroll = () => {
      const sections = navItems
        .filter((item) => item.href.startsWith('#'))
        .map((item) => item.href.replace('#', ''))
        .filter(Boolean);

      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(`#${sectionId}`);
            return;
          }
        }
      }

      if (window.scrollY < 300) {
        setActiveSection('');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: NavItem
  ) => {
    if (onClick) onClick();

    if (item.external) {
      return;
    }

    if (item.href.startsWith('#')) {
      e.preventDefault();
      const targetId = item.href.replace('#', '');
      const element = document.getElementById(targetId);

      if (element) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    }
  };

  return (
    <ul className={`flex items-center gap-7 list-none ${className}`}>
      {navItems.map((item) => {
        const isActive =
          activeSection === item.href ||
          pathname === item.href;

        return (
          <li key={item.href}>
            <Link
              href={item.href}
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noopener noreferrer' : undefined}
              onClick={(e) => handleClick(e, item)}
              className={cn(
                'text-sm font-medium text-muted-foreground transition-all duration-300 ease-in-out py-2 relative no-underline hover:text-foreground cursor-pointer',
                isActive && 'text-primary font-semibold'
              )}
            >
              {item.label}
              {isActive && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
