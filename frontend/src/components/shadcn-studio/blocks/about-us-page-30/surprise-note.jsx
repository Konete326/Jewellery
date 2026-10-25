import React, { useState } from 'react'
import { Sparkles, ShieldCheck, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

const NOTES = [
  {
    category: 'Diamonds',
    title: 'Ethical Sourcing',
    text: '100% Conflict-Free Natural Diamonds',
    tag: 'Certified Clean Natural Stones'
  },
  {
    category: 'Pure Gold',
    title: 'Gold Standards',
    text: 'Handcrafted 18K & 22K Solid Gold',
    tag: 'Tested & Officially Hallmarked'
  },
  {
    category: 'Florence',
    title: 'Historic Atelier',
    text: 'Historic Workshop Via de\' Tornabuoni',
    tag: 'Active In Florence Since 1924'
  },
  {
    category: 'Craft',
    title: 'Master Artistry',
    text: 'Traditional Lost-Wax Casting & Engraving',
    tag: 'Master Goldsmith Certified'
  },
  {
    category: 'Bespoke',
    title: 'Custom Creations',
    text: 'One-of-a-Kind Made to Order Masterpieces',
    tag: 'Certificate of Authenticity'
  }
]

const SurpriseNote = () => {
  const [step, setStep] = useState(0)
  const note = NOTES[step]

  const nextStep = (e) => {
    e.stopPropagation()
    setStep((prev) => (prev + 1) % NOTES.length)
  }

  const prevStep = (e) => {
    e.stopPropagation()
    setStep((prev) => (prev - 1 + NOTES.length) % NOTES.length)
  }

  return (
    <div className='relative h-full w-full flex flex-col justify-between select-none'>
      <div className='flex items-center justify-between gap-2 border-b border-border/60 pb-3'>
        <div className='flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5'>
          {NOTES.map((item, idx) => (
            <button
              key={item.category}
              type='button'
              onClick={() => setStep(idx)}
              className={cn(
                'px-2.5 py-1 rounded-full text-[11px] font-mono tracking-wider transition-all duration-150 cursor-pointer shrink-0',
                idx === step
                  ? 'bg-amber-600 text-white font-medium shadow-xs'
                  : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              {item.category}
            </button>
          ))}
        </div>

        <div className='flex items-center gap-1 shrink-0'>
          <button
            type='button'
            onClick={prevStep}
            aria-label='Previous note'
            className='size-7 rounded-md border border-border/80 bg-background hover:bg-muted flex items-center justify-center text-foreground transition-colors cursor-pointer'
          >
            <ChevronLeft className='size-3.5' />
          </button>
          <span className='text-[10px] font-mono text-muted-foreground px-1'>
            {step + 1}/{NOTES.length}
          </span>
          <button
            type='button'
            onClick={nextStep}
            aria-label='Next note'
            className='size-7 rounded-md border border-border/80 bg-background hover:bg-muted flex items-center justify-center text-foreground transition-colors cursor-pointer'
          >
            <ChevronRight className='size-3.5' />
          </button>
        </div>
      </div>

      <div
        onClick={() => setStep((prev) => (prev + 1) % NOTES.length)}
        className='my-auto py-2 cursor-pointer transition-opacity duration-150'
      >
        <div className='flex items-center justify-between mb-2'>
          <span className='inline-flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-widest text-amber-700 dark:text-amber-400 font-semibold'>
            <Sparkles className='size-3.5 text-amber-600 dark:text-amber-400' />
            <span>{note.title}</span>
          </span>
          <span className='inline-flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-mono font-medium'>
            <ShieldCheck className='size-3.5' />
            <span>Verified</span>
          </span>
        </div>

        <h3 className='font-headline text-xl sm:text-2xl text-foreground font-normal leading-snug tracking-tight mb-2'>
          {note.text}
        </h3>

        <div className='flex items-center justify-between pt-2 border-t border-border/50 text-[11px] text-muted-foreground font-light'>
          <div className='flex items-center gap-1.5'>
            <BookOpen className='size-3 text-amber-600' />
            <span>{note.tag}</span>
          </div>
          <span className='text-amber-700 dark:text-amber-400 font-mono text-[10px] tracking-wider uppercase font-medium'>
            Tap to advance &rarr;
          </span>
        </div>
      </div>
    </div>
  )
}

export default SurpriseNote
