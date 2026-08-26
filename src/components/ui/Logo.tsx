'use client';

import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  /** Use 'light' on dark backgrounds to invert the logo colours */
  variant?: 'default' | 'light';
}

export function Logo({ className = '', variant = 'default' }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center flex-shrink-0 ${className}`}>
      <Image
        src="/logo.png"
        alt="Heightt"
        width={220}
        height={66}
        className={`h-14 w-auto object-contain ${variant === 'light' ? 'brightness-0 invert' : ''}`}
        priority
      />
    </Link>
  );
}
