import React, { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export const LuxuryButton = forwardRef(function LuxuryButton(
  {
    children,
    as: Component = 'button',
    variant = 'dark',
    size = 'default',
    className,
    ...props
  },
  ref
) {
  const isGold = variant === 'gold'

  const sizeClasses = {
    sm: 'min-h-[38px] px-5 py-2 text-[11px]',
    default: 'min-h-[48px] px-8 py-3.5 text-xs',
    lg: 'min-h-[54px] px-10 py-4 text-sm'
  }[size] || 'min-h-[48px] px-8 py-3.5 text-xs'

  const auraColor = isGold ? 'bg-amber-400/35' : 'bg-amber-500/25'
  const borderGradient = isGold
    ? 'bg-gradient-to-b from-amber-100/90 via-amber-300/50 to-amber-950/90'
    : 'bg-gradient-to-b from-white/70 via-amber-400/40 to-black/90'
  const coreBg = isGold
    ? 'bg-gradient-to-b from-[#8c6c23] via-[#75591b] to-[#4e3a0f]'
    : 'bg-[#24292a]'
  const radialGlow = isGold
    ? 'bg-[radial-gradient(circle_at_50%_0%,rgba(255,235,160,0.5)_0%,transparent_70%)]'
    : 'bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.4)_0%,transparent_70%)]'

  return (
    <Component
      ref={ref}
      className={cn(
        'group relative inline-flex items-center justify-center rounded-full cursor-pointer select-none whitespace-nowrap overflow-visible transition-all duration-150 ease-out hover:scale-[1.02] active:scale-95',
        className
      )}
      {...props}
    >
      <div className={cn('absolute -inset-1 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out pointer-events-none', auraColor)} />
      <div className={cn('absolute inset-0 rounded-full p-[1.5px] pointer-events-none', borderGradient)}>
        <div className={cn('relative w-full h-full rounded-full overflow-hidden flex items-center justify-center transition-all duration-150 group-hover:brightness-110', coreBg)}>
          <div className={cn('absolute inset-0 pointer-events-none', radialGlow)} />
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
          <div className="absolute inset-0 rounded-full shadow-[inset_0_2px_10px_rgba(255,255,255,0.18),inset_0_-2px_10px_rgba(0,0,0,0.6)] pointer-events-none" />
        </div>
      </div>
      <span className={cn('relative z-10 w-full text-white font-medium tracking-widest uppercase opacity-95 group-hover:opacity-100 transition-opacity duration-150 flex items-center justify-center gap-2.5', sizeClasses)}>
        {children}
      </span>
    </Component>
  )
})
