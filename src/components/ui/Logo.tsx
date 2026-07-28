'use client';

import Link from 'next/link';
import { Building2 } from 'lucide-react';

interface LogoProps {
  className?: string;
}

export function Logo({ className = '' }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 text-2xl font-bold text-foreground no-underline flex-shrink-0 ${className}`}>
      <Building2 className="w-7 h-7 text-primary" strokeWidth={1.8} />
      Heightt
    </Link>
  );
}
