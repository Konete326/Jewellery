'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

const FOUNDER_SLIDES = [
  {
    src: '/assets/about/founder.png',
    title: 'Mr. Khalil Ahmed',
    subtitle: 'Founder & Master Jeweler • Est. 1992'
  },
  {
    src: '/assets/about/founder-poster.jpg',
    title: 'Master Goldsmithing',
    subtitle: 'Over 3 Decades of Artisanal Artistry'
  },
  {
    src: '/assets/about/brand-poster.jpg',
    title: 'Fine Jewellery Boutique',
    subtitle: 'Murshid Sunaar Tower, Saddar, Karachi'
  },
  {
    src: '/assets/about/shop-front.jpg',
    title: 'Artisanal Workshop',
    subtitle: 'Shop #2, Dr. Daud Pota Road, Karachi'
  }
]

const ProfileCarousel = () => {
  const [index, setIndex] = useState(0)

  const goPrev = () => setIndex(prev => (prev - 1 + FOUNDER_SLIDES.length) % FOUNDER_SLIDES.length)
  const goNext = () => setIndex(prev => (prev + 1) % FOUNDER_SLIDES.length)

  return (
    <div className='relative h-full min-h-[480px] lg:min-h-full overflow-hidden rounded-3xl bg-neutral-900 border border-border/80 shadow-md'>
      {FOUNDER_SLIDES.map((slide, i) => (
        <div
          key={slide.src}
          className={cn(
            'absolute inset-0 size-full transition-opacity duration-700',
            i === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
          )}
        >
          <img
            src={slide.src}
            alt={slide.title}
            loading='lazy'
            className='size-full object-cover object-top'
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent' />
          <div className='absolute bottom-6 left-6 right-6 z-10'>
            <span className='text-[10px] uppercase tracking-widest text-amber-400 font-mono font-medium block mb-1'>
              Handcrafted in Karachi • Est. 1992
            </span>
            <h3 className='font-headline text-2xl text-white font-normal'>
              {slide.title}
            </h3>
            <p className='text-xs text-white/80 font-light mt-0.5'>
              {slide.subtitle}
            </p>
          </div>
        </div>
      ))}

      <div className='absolute top-6 right-6 z-10 flex gap-1.5'>
        {FOUNDER_SLIDES.map((_, i) => (
          <span
            key={i}
            className={cn(
              'block h-1 rounded-full transition-all duration-300',
              i === index ? 'w-6 bg-amber-400' : 'w-2 bg-white/40'
            )}
          />
        ))}
      </div>

      <button
        type='button'
        onClick={goPrev}
        className='group/prev absolute inset-y-0 left-0 flex w-1/4 items-center justify-start pl-3 outline-none cursor-pointer z-20'
        aria-label='Previous slide'
      >
        <span className='absolute inset-0 bg-linear-to-r from-black/30 to-transparent opacity-0 backdrop-blur-xs transition-opacity duration-300 group-hover/prev:opacity-100' />
        <ChevronLeftIcon className='relative size-6 -translate-x-1 text-white opacity-70 transition-all duration-300 group-hover/prev:translate-x-0 group-hover/prev:opacity-100' />
      </button>

      <button
        type='button'
        onClick={goNext}
        className='group/next absolute inset-y-0 right-0 flex w-1/4 items-center justify-end pr-3 outline-none cursor-pointer z-20'
        aria-label='Next slide'
      >
        <span className='absolute inset-0 bg-linear-to-l from-black/30 to-transparent opacity-0 backdrop-blur-xs transition-opacity duration-300 group-hover/next:opacity-100' />
        <ChevronRightIcon className='relative size-6 translate-x-1 text-white opacity-70 transition-all duration-300 group-hover/next:translate-x-0 group-hover/next:opacity-100' />
      </button>
    </div>
  )
}

export default ProfileCarousel
