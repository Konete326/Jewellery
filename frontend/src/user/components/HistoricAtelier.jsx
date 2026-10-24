import { NeuralNoise } from '@/components/ui/neural-noise'
import { LuxuryButton } from './LuxuryButton'

export function HistoricAtelier({ onBookClick }) {
  return (
    <section id="atelier" className="relative py-28 md:py-36 px-6 md:px-20 bg-linear-to-b from-[#f9f9f9] via-[#f5f2ea] to-[#f9f9f9] overflow-hidden">
      <NeuralNoise
        position="absolute"
        zIndex={0}
        color={[0.88, 0.70, 0.25]}
        opacity={0.25}
        speed={0.0006}
      />
      <div className="relative z-10 max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
        <div className="w-full lg:w-1/2">
          <span className="text-[#5f5e5e] tracking-[0.2em] uppercase text-xs mb-4 block font-medium">
            Visit the Source
          </span>
          <h2 className="font-headline text-4xl md:text-6xl text-[#2d3435] mb-8 leading-tight font-normal">
            Visit Our <span className="serif-italic">Historic</span> Atelier
          </h2>
          <p className="text-[#5a6061] text-base md:text-lg mb-10 max-w-lg leading-relaxed font-light">
            Located in the heart of Florence, our atelier is more than a showroom—it is a living archive. Witness the creation process and consult with our Master Jeweler for bespoke commissions.
          </p>
          <div className="space-y-6 border-l border-neutral-300 pl-6 mb-10">
            <div>
              <p className="tracking-widest text-[10px] uppercase text-[#5a6061] mb-1 font-medium">
                Location
              </p>
              <p className="font-headline text-xl text-[#2d3435]">
                Via de' Tornabuoni, 14, 50123 Firenze FI
              </p>
            </div>
            <div>
              <p className="tracking-widest text-[10px] uppercase text-[#5a6061] mb-1 font-medium">
                Hours
              </p>
              <p className="font-headline text-xl text-[#2d3435]">
                Mon — Sat: 10:00 - 19:00
              </p>
            </div>
          </div>
          <LuxuryButton onClick={onBookClick} variant="dark">
            Book Private Appointment
          </LuxuryButton>
        </div>
        <div className="w-full lg:w-1/2 relative">
          <div className="bg-[#ebeeef] overflow-hidden shadow-sm">
            <img
              alt="Interior of a luxury antique jewelry atelier"
              className="w-full h-full object-cover"
              src="/images/image-03.jpg"
            />
          </div>
          <div className="absolute -top-10 -left-10 p-6 bg-white/95 backdrop-blur-md hidden md:block border border-neutral-200/60 shadow-lg">
            <div className="flex flex-col gap-1">
              <span className="font-headline text-4xl text-[#5f5e5e] font-light">
                4.9
              </span>
              <div className="flex gap-1 text-[#c1a162]">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className="material-symbols-outlined scale-75"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                ))}
              </div>
              <span className="text-[10px] uppercase tracking-widest text-[#5a6061] mt-1 font-medium">
                Atelier Reviews
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
