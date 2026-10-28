import React from 'react';
import { cn } from '@/lib/utils';

export function getMonogramTone(name) {
  const clean = (name || 'P').trim();
  const charCode = (clean.charAt(0) || 'P').toUpperCase().charCodeAt(0);
  const index = Math.abs(charCode) % 3;
  if (index === 0) {
    return 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:bg-amber-500/15 dark:border-amber-500/35 dark:text-amber-300';
  }
  if (index === 1) {
    return 'bg-rose-500/10 border-rose-500/30 text-rose-900 dark:bg-rose-500/15 dark:border-rose-500/35 dark:text-rose-300';
  }
  return 'bg-orange-500/10 border-orange-500/30 text-orange-950 dark:bg-orange-500/15 dark:border-orange-500/35 dark:text-orange-300';
}

export function PatronMonogram({ name, size = 'size-7', className }) {
  const initial = ((name || 'P').trim().charAt(0) || 'P').toUpperCase();
  const toneClass = getMonogramTone(name);

  return (
    <div
      className={cn(
        size,
        'rounded-full border font-serif font-semibold text-xs flex items-center justify-center shrink-0 select-none shadow-xs',
        toneClass,
        className
      )}
    >
      {initial}
    </div>
  );
}
