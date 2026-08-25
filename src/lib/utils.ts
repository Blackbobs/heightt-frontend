import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts an amount in Naira (NGN) to Kobo.
 * 1 Naira = 100 Kobo. Rounded to the nearest Kobo to avoid
 * floating-point precision errors (e.g. 0.29 * 100 !== 29).
 */
export function nairaToKobo(naira: number): number {
  return Math.round(naira * 100);
}