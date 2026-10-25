import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export function CardGoldEffect({ active = false, className }) {
  const containerRef = useRef(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const parent = containerRef.current?.parentElement;
    if (!parent) return;

    const onMouseMove = (e) => {
      const rect = parent.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setPos({ x, y });
    };

    const onMouseEnter = () => setIsHovered(true);
    const onMouseLeave = () => setIsHovered(false);

    parent.addEventListener('mousemove', onMouseMove);
    parent.addEventListener('mouseenter', onMouseEnter);
    parent.addEventListener('mouseleave', onMouseLeave);

    return () => {
      parent.removeEventListener('mousemove', onMouseMove);
      parent.removeEventListener('mouseenter', onMouseEnter);
      parent.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn('absolute inset-0 pointer-events-none z-10 overflow-hidden rounded-inherit', className)}
    >
      <div
        className={cn(
          'absolute inset-0 transition-opacity duration-500',
          active || isHovered ? 'opacity-100' : 'opacity-0'
        )}
        style={{
          background: `radial-gradient(420px circle at ${pos.x}% ${pos.y}%, rgba(245, 158, 11, 0.3) 0%, rgba(217, 119, 6, 0.14) 38%, transparent 75%)`,
        }}
      />
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-tr from-amber-500/12 via-transparent to-amber-400/12 transition-opacity duration-500',
          active || isHovered ? 'opacity-100' : 'opacity-0'
        )}
      />
      <div
        className={cn(
          'absolute inset-0 transition-all duration-500 rounded-inherit',
          active
            ? 'ring-1 ring-amber-500/50 shadow-[inset_0_0_25px_rgba(217,119,6,0.25)]'
            : isHovered
            ? 'ring-1 ring-amber-500/40 shadow-[inset_0_0_20px_rgba(217,119,6,0.2)]'
            : 'ring-0'
        )}
      />
    </div>
  );
}
