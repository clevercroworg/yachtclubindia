import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility to merge Tailwind CSS classes safely without conflicts.
 * Essential for building reusable UI components where users might pass custom classNames.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
