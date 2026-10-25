import React, { useState } from 'react'
import { Sparkles, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

const NOTES = [
  {
    title: 'Ethical Sourcing',
    text: '100% Conflict-Free Certified Diamonds',
    tag: 'Kimberley Process Compliant',
    position: 'top-[8%] left-[10%] -rotate-3 sm:-rotate-6'
  },
  {
    title: 'Solid Goldcraft',
    text: 'Hand-Hammered 18K & 22K Solid Gold',
    tag: 'Fire Assayed & Hallmarked',
    position: 'top-[4%] left-[45%] rotate-2 sm:rotate-4'
  },
  {
    title: 'Century Atelier',
    text: 'Florence Heritage Workshop Est. 1924',
    tag: 'Via de\' Tornabuoni Archive',
    position: 'top-[6%] left-[20%] -rotate-2'
  },
  {
    title: 'Artisanal Chasing',
    text: 'Renaissance Repoussé & Lost Wax Casting',
    tag: 'Master Goldsmithing Bench',
    position: 'top-[10%] left-[50%] rotate-3'
  },
  {
    title: 'Bespoke Registry',
    text: 'Individually Numbered Vault Pieces',
    tag: 'Lifetime Provenance Dossier',
    position: 'top-[5%] left-[30%] rotate-1'
  }
]

const SurpriseNote = () => {
  const [step, setStep] = useState(0)
  const note = NOTES[step]

  return (
    <div className='relative h-full w-full py-4 flex flex-col justify-between overflow-hidden select-none'>
      <div className='bg-amber-500/25 absolute top-10 right-[10%] left-[10%] h-1 rounded-full' />

      <div
        onMouseEnter={() => setStep(prev => (prev + 1) % NOTES.length)}
        onClick={() => setStep(prev => (prev + 1) % NOTES.length)}
        className={cn(
          'absolute z-10 w-72 sm:w-80 cursor-pointer transition-all duration-500',
          note.position
        )}
      >
        <div className='rounded-2xl bg-white/95 dark:bg-card border border-amber-500/35 p-4 shadow-xl backdrop-blur-md hover:border-amber-500 transition-colors'>
          <div className='flex items-center justify-between mb-1.5'>
            <span className='inline-flex items-center gap-1 text-[10px] uppercase font-mono tracking-widest text-amber-700 font-semibold'>
              <Sparkles className='size-3 text-amber-600' />
              {note.title}
            </span>
            <span className='inline-flex items-center gap-1 text-[10px] text-emerald-700 font-mono'>
              <ShieldCheck className='size-3' />
              Guaranteed
            </span>
          </div>
          <p className='text-sm sm:text-base font-serif font-medium text-foreground leading-snug'>
            {note.text}
          </p>
          <div className='mt-2 pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] text-muted-foreground font-light'>
            <span>{note.tag}</span>
            <span className='text-amber-700 font-mono text-[10px]'>Click to cycle &rarr;</span>
          </div>
        </div>
      </div>

      <div className='mt-auto pt-24 text-center z-10'>
        <p className='text-foreground text-lg sm:text-xl font-normal font-serif'>
          The Hallmark of Florentine Haute Joaillerie
        </p>
        <p className='text-xs text-muted-foreground font-light mt-0.5 tracking-wider uppercase font-mono'>
          Living Heritage &bull; Continuous Handcraft Since 1924
        </p>
      </div>
    </div>
  )
}

export default SurpriseNote
