import Link from 'next/link';
import Image from 'next/image';
import { HEIGHTT_LOGO_URL } from '@/lib/assets';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  /** Use 'light' on dark backgrounds to invert the logo colours */
  variant?: 'default' | 'light';
}

export function Logo({ className = '', variant = 'default' }: LogoProps) {
  return (
    <Link href="/" className={cn('flex items-center flex-shrink-0', className)}>
      <Image
        src={HEIGHTT_LOGO_URL}
        alt="Heightt"
        width={220}
        height={66}
        className={cn(
          'h-16 w-auto object-contain transition-all',
          variant === 'light'
            ? 'brightness-0 invert'
            : 'dark:brightness-0 dark:invert'
        )}
        priority
      />
    </Link>
  );
}
