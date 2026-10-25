import React, { useState, useEffect } from 'react'
import { Clock, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getStoreStatus } from '@/utils/storeStatus'
import { STORE_INFO } from '@/constants/storeInfo'

export function StoreStatusBadge({ variant = 'compact', className }) {
  const [status, setStatus] = useState(() => getStoreStatus())

  useEffect(() => {
    const update = () => setStatus(getStoreStatus())
    const interval = setInterval(update, 60000)
    return () => clearInterval(interval)
  }, [])

  const isOpen = status.isOpen

  if (variant === 'pill') {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-mono tracking-wider border shadow-2xs select-none',
          isOpen
            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300'
            : 'border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-300',
          className
        )}
      >
        <span
          className={cn(
            'size-2 rounded-full shrink-0',
            isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-amber-600'
          )}
        />
        <span className="font-semibold">{status.badgeText}</span>
        <span className="opacity-40">•</span>
        <span className="opacity-90">{status.detailText}</span>
      </div>
    )
  }

  if (variant === 'detailed') {
    return (
      <div
        className={cn(
          'p-3.5 rounded-2xl border transition-all duration-200 select-none shadow-xs',
          isOpen
            ? 'border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent'
            : 'border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent',
          className
        )}
      >
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'size-2.5 rounded-full shrink-0',
                isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-amber-600'
              )}
            />
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-foreground">
              {status.badgeText}
            </span>
          </div>
          <span className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase">
            Karachi Time (PKT)
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-light">
          <Clock className="size-3.5 text-amber-700 dark:text-amber-400 shrink-0" />
          <span>{status.scheduleText}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/80 font-light mt-1">
          <MapPin className="size-3 text-amber-700 dark:text-amber-400 shrink-0" />
          <span className="truncate">{STORE_INFO.address.short}</span>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono tracking-wider border select-none',
        isOpen
          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300'
          : 'border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-300',
        className
      )}
    >
      <span
        className={cn(
          'size-1.5 rounded-full shrink-0',
          isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-amber-600'
        )}
      />
      <span className="font-semibold">{status.badgeText}</span>
      <span className="opacity-70">({status.detailText})</span>
    </div>
  )
}
