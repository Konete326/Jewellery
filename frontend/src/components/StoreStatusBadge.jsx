import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Clock, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getStoreStatus } from '@/utils/storeStatus'
import { STORE_INFO } from '@/constants/storeInfo'

export function StoreStatusBadge({ variant = 'compact', className }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [status, setStatus] = useState(() => getStoreStatus())

  useEffect(() => {
    const update = () => setStatus(getStoreStatus())
    const interval = setInterval(update, 60000)
    return () => clearInterval(interval)
  }, [])

  const isOpen = status.isOpen

  const handleNavigateToHours = (e) => {
    e.preventDefault()
    if (location.pathname === '/about') {
      const el = document.getElementById('visiting-hours')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        return
      }
    }
    navigate('/about#visiting-hours')
  }

  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={handleNavigateToHours}
        title="Boutique Hours: Click for full schedule"
        className={cn(
          'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono tracking-wider border shadow-2xs select-none transition-all duration-200 cursor-pointer',
          isOpen
            ? 'border-border/80 bg-muted/40 text-foreground hover:bg-muted/70 hover:border-border'
            : 'border-border/60 bg-muted/20 text-muted-foreground hover:bg-muted/40',
          className
        )}
      >
        <span
          className={cn(
            'size-1.5 rounded-full shrink-0',
            isOpen ? 'bg-amber-600 dark:bg-amber-400' : 'bg-muted-foreground'
          )}
        />
        <span className="font-semibold">{isOpen ? 'Open Now' : 'Closed'}</span>
      </button>
    )
  }

  if (variant === 'detailed') {
    return (
      <div
        onClick={handleNavigateToHours}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleNavigateToHours(e)
          }
        }}
        className={cn(
          'p-3.5 rounded-2xl border border-border/80 bg-card transition-all duration-200 select-none shadow-xs cursor-pointer hover:border-amber-500/40',
          className
        )}
      >
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'size-2 rounded-full shrink-0',
                isOpen ? 'bg-amber-600 dark:bg-amber-400' : 'bg-muted-foreground'
              )}
            />
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-foreground">
              {isOpen ? 'Open Now' : 'Closed'}
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
    <button
      type="button"
      onClick={handleNavigateToHours}
      title="Boutique Hours: Click for full schedule"
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider border select-none transition-all duration-200 cursor-pointer',
        isOpen
          ? 'border-border/80 bg-muted/40 text-foreground hover:bg-muted/70'
          : 'border-border/60 bg-muted/20 text-muted-foreground hover:bg-muted/40',
        className
      )}
    >
      <span
        className={cn(
          'size-1.5 rounded-full shrink-0',
          isOpen ? 'bg-amber-600 dark:bg-amber-400' : 'bg-muted-foreground'
        )}
      />
      <span className="font-semibold">{isOpen ? 'Open Now' : 'Closed'}</span>
    </button>
  )
}
