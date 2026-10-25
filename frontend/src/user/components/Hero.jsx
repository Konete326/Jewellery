import { LuxuryButton } from './LuxuryButton'
import { NeuralNoise } from '@/components/ui/neural-noise'
import { STORE_INFO } from '@/constants/storeInfo'

export function Hero({ onExploreClick }) {
  return (
    <section className="relative h-[850px] md:h-[920px] flex items-center px-6 md:px-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          alt="Close up of artisan hands working on gold jewelry"
          className="w-full h-full object-cover"
          src="/images/banner.jpg"
        />
        <div className="absolute inset-0 bg-stone-900/40 backdrop-brightness-95"></div>
        <NeuralNoise
          opacity={0.35}
          speed={0.0008}
          position="absolute"
          className="absolute inset-0 size-full pointer-events-none"
          zIndex={1}
        />
        <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-amber-500/15 blur-[120px] rounded-full pointer-events-none" />
      </div>
      <div className="relative z-10 max-w-3xl pt-20">
        <span className="tracking-[0.2em] uppercase text-xs text-white/90 mb-4 block font-medium font-mono">
          Est. {STORE_INFO.established} • Saddar, Karachi
        </span>
        <h1 className="font-headline text-5xl md:text-8xl text-white leading-[1.08] mb-8 tracking-tight font-light">
          The Art of <br />
          <span className="serif-italic">Handcrafted</span> Gold
        </h1>
        <p className="text-white/85 text-lg md:text-xl max-w-lg mb-10 leading-relaxed font-light">
          Master goldsmithing since 1992 in Saddar, Karachi. Crafting certified 22K and 24K gold bridal jewelry, solitaires, and polki heirlooms.
        </p>
        <div>
          <LuxuryButton onClick={onExploreClick} variant="gold">
            Explore Collection
          </LuxuryButton>
        </div>
      </div>
    </section>
  )
}
