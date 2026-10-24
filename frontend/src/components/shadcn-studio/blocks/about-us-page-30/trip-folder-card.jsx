'use client'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { ArrowUpRight } from 'lucide-react'

const PHOTOS = [
  {
    src: 'https://cdn.shadcnstudio.com/ss-assets/template/landing-page/zolt/folder-01.png',
    collapsed: 'rotate-2 -translate-y-[48%]',
    hover:
      'group-hover/folder:rotate-3 group-hover/folder:-translate-y-[52%] group-hover/folder:translate-x-1 group-hover/folder:scale-90',
    expanded: '-translate-x-16 -translate-y-18 -rotate-[10deg] scale-110'
  },
  {
    src: 'https://cdn.shadcnstudio.com/ss-assets/template/landing-page/zolt/folder-02.png',
    collapsed: '-translate-y-[43%]',
    hover: 'group-hover/folder:-translate-y-[47%] group-hover/folder:scale-90',
    expanded: '-translate-y-18 scale-110'
  },
  {
    src: 'https://cdn.shadcnstudio.com/ss-assets/template/landing-page/zolt/folder-03.png',
    collapsed: '-rotate-2 -translate-y-[38%]',
    hover:
      'group-hover/folder:-rotate-3 group-hover/folder:-translate-y-[42%] group-hover/folder:-translate-x-1 group-hover/folder:scale-90',
    expanded: 'translate-x-16 -translate-y-16 rotate-[10deg] scale-110'
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
      className='ring-foreground/10 bg-muted cursor-pointer justify-end gap-5 overflow-visible rounded-3xl shadow-none ring-1 transition-all hover:ring-amber-500/40'
    >
      <CardContent>
        <div className='group/folder relative flex aspect-video items-end justify-center'>
          <div className='border-foreground/10 bg-muted absolute bottom-0 left-1/2 z-0 h-36 w-40 -translate-x-1/2 rounded-xl border' />

          {PHOTOS.map((photo, i) => (
            <div
              key={photo.src}
              style={{ zIndex: i + 1 }}
              className={cn(
                'absolute aspect-290/230 h-auto w-36 overflow-hidden transition-all duration-500',
                expanded ? photo.expanded : cn(photo.collapsed, photo.hover)
              )}
            >
              <img
                src={photo.src}
                alt='Haute horlogerie and high jewellery showcase'
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
            <img
              src='https://cdn.shadcnstudio.com/ss-assets/template/landing-page/zolt/folder-front.png'
              alt=''
              aria-hidden='true'
              loading='lazy'
              className='w-40'
            />
          </div>
        </div>
      </CardContent>

      <CardContent>
        <div className='flex items-center justify-between px-2'>
          <div className='flex items-center gap-2'>
            <p className='text-foreground text-lg font-medium text-nowrap font-serif xl:text-xl'>Atelier Gallery</p>
            <Badge
              variant='secondary'
              className='text-foreground dark:bg-background dark:text-primary/70 h-6.5 rounded-sm bg-white font-light text-xs'
            >
              76 Masterpieces
            </Badge>
          </div>
          <button
            type='button'
            onClick={(e) => {
              e.stopPropagation()
              navigate('/gallery')
            }}
            className='inline-flex items-center gap-1 text-xs font-medium text-amber-600 hover:text-amber-700 transition-colors'
          >
            <span>View Gallery</span>
            <ArrowUpRight className='size-3.5' />
          </button>
        </div>
      </CardContent>
    </Card>
  )
}

export default TripFolderCard
