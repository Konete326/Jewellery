import React from 'react';
import { cn } from '@/lib/utils';

export function ShopGrid({ className, children, ...props }) {
  return (
    <ul
      className={cn('grid grid-flow-row gap-4 sm:gap-6', className)}
      {...props}
    >
      {children}
    </ul>
  );
}

export function ShopGridItem({ className, children, ...props }) {
  return (
    <li
      className={cn('aspect-square transition-opacity duration-300 list-none', className)}
      {...props}
    >
      {children}
    </li>
  );
}

ShopGrid.Item = ShopGridItem;
