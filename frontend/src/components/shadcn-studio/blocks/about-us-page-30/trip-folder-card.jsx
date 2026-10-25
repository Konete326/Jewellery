import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { ArrowUpRight } from 'lucide-react'

const JEWELRY_PHOTOS = [
  {
    src: '/assets/products/choker-ruby-01.jpg',
    collapsed: 'rotate-2 -translate-y-[48%]',
    hover: 'group-hover/folder:rotate-4 group-hover/folder:-translate-y-[54%] group-hover/folder:translate-x-2',
    expanded: '-translate-x-12 sm:-translate-x-20 -translate-y-12 sm:-translate-y-16 -rotate-12 scale-100 sm:scale-105'
  },
  {
    src: '/assets/products/guluband-01.jpg',
    collapsed: '-translate-y-[42%]',
    hover: 'group-hover/folder:-translate-y-[48%]',
    expanded: '-translate-y-14 sm:-translate-y-18 scale-100 sm:scale-105'
  },
  {
    src: '/assets/products/jhumka-01.jpg',
    collapsed: '-rotate-2 -translate-y-[36%]',
    hover: 'group-hover/folder:-rotate-4 group-hover/folder:-translate-y-[42%] group-hover/folder:-translate-x-2',
    expanded: 'translate-x-12 sm:translate-x-20 -translate-y-10 sm:-translate-y-14 rotate-12 scale-100 sm:scale-105'
  }
]

const TripFolderCard = () => {
  const [expanded, setExpanded] = useState(false)
  const navigate = useNavigate()

  const handleCardClick = () => {
    if (expanded) {
      navigate('/gallery')
    } else {
      setExpanded(true)
    }
  }

  return (
    <Card
      onClick={handleCardClick}
      className='ring-foreground/10 bg-card cursor-pointer justify-between overflow-visible rounded-3xl p-5 shadow-xs ring-1 transition-all hover:ring-amber-500/40 border-border flex flex-col gap-4 h-[310px]'
    >
      <div className='group/folder relative flex h-48 items-end justify-center pt-4 overflow-visible'>
        <div className='border-foreground/15 bg-muted/70 absolute bottom-0 left-1/2 z-0 h-36 w-52 sm:h-40 sm:w-64 -translate-x-1/2 rounded-2xl border shadow-inner' />

        {JEWELRY_PHOTOS.map((photo, i) => (
          <div
            key={photo.src}
            style={{ zIndex: i + 1 }}
            className={cn(
              'absolute aspect-4/3 w-36 sm:w-44 rounded-xl overflow-hidden shadow-lg transition-all duration-500 border border-border/80 bg-neutral-900',
              expanded ? photo.expanded : cn(photo.collapsed, photo.hover)
            )}
          >
            <img
              src={photo.src}
              alt='Haute Joaillerie showcase'
              loading='lazy'
              className='size-full object-cover'
            />
          </div>
        ))}

        <div
          className={cn(
            'relative z-10 origin-bottom transition-transform duration-500',
            'transform-[perspective(2000px)_rotateX(-25deg)]',
            !expanded && 'hover:transform-[perspective(3000px)_rotateX(-35deg)]',
            expanded && 'transform-[perspective(4000px)_rotateX(-45deg)]'
          )}
        >
          <div className='w-48 sm:w-56 h-14 sm:h-16 bg-amber-500/20 border border-amber-500/40 rounded-2xl backdrop-blur-md flex flex-col items-center justify-center shadow-md px-4'>
            <span className='text-xs uppercase font-mono tracking-widest text-amber-900 font-bold'>
              Atelier Vault
            </span>
            <span className='text-[10px] text-amber-800/80 font-mono tracking-wider'>
              Curated Dossier
            </span>
          </div>
        </div>
      </div>

      <div className='flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/60'>
        <div className='flex items-center gap-2'>
          <p className='text-foreground text-base sm:text-lg font-medium font-serif'>
            Masterpieces
          </p>
          <Badge
            variant='secondary'
            className='text-foreground h-6 rounded-md bg-muted font-light text-[11px] px-2'
          >
            Curated
          </Badge>
        </div>
        <button
          type='button'
          onClick={(e) => {
            e.stopPropagation()
            navigate('/gallery')
          }}
          className='inline-flex items-center gap-1 text-xs font-medium text-amber-700 hover:text-amber-800 transition-colors cursor-pointer'
        >
          <span>Exhibition</span>
          <ArrowUpRight className='size-3.5' />
        </button>
      </div>
    </Card>
  )
}

export default TripFolderCard
