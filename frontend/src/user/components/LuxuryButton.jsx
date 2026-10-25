import React, { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export const LuxuryButton = forwardRef(function LuxuryButton(
  {
    children,
    as: Component = 'button',
    variant = 'gold',
    size = 'default',
    icon,
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

  const borderGradient = isGold
    ? 'bg-gradient-to-b from-amber-100 via-amber-300/80 to-amber-900'
    : 'bg-gradient-to-b from-amber-400/60 via-neutral-600/40 to-neutral-900'
  const coreBg = isGold
    ? 'bg-gradient-to-b from-[#9a772c] via-[#816321] to-[#564213]'
    : 'bg-gradient-to-b from-[#2e3334] via-[#222627] to-[#181a1b]'
  const radialGlow = isGold
    ? 'bg-[radial-gradient(circle_at_50%_0%,rgba(255,245,190,0.55)_0%,transparent_70%)]'
    : 'bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.25)_0%,transparent_70%)]'

  return (
    <Component
      ref={ref}
      className={cn(
        'group relative inline-flex items-center justify-center rounded-full cursor-pointer select-none whitespace-nowrap overflow-visible transition-all duration-150 ease-out hover:scale-[1.02] active:scale-95 active:opacity-90 shadow-none hover:shadow-none',
        className
      )}
      {...props}
    >
      <div className={cn('absolute inset-0 rounded-full p-[1.5px] pointer-events-none', borderGradient)}>
        <div className={cn('relative w-full h-full rounded-full overflow-hidden flex items-center justify-center transition-all duration-150 group-hover:brightness-110', coreBg)}>
          <div className={cn('absolute inset-0 pointer-events-none', radialGlow)} />
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent pointer-events-none" />
          <div className="absolute inset-0 rounded-full shadow-[inset_0_2px_8px_rgba(255,255,255,0.2),inset_0_-2px_8px_rgba(0,0,0,0.5)] pointer-events-none" />
        </div>
      </div>
      <span className={cn('relative z-10 w-full text-white font-medium tracking-widest uppercase opacity-95 group-hover:opacity-100 transition-opacity duration-150 flex items-center justify-center gap-2.5', sizeClasses)}>
        {icon && <span className="inline-flex shrink-0 items-center justify-center">{icon}</span>}
        {children}
      </span>
    </Component>
  )
})
