import { LuxuryButton } from './LuxuryButton'
import { NeuralNoise } from '@/components/ui/neural-noise'
import InkHeadline from '@/components/ui/ink-headline'
import { STORE_INFO } from '@/constants/storeInfo'

export function Hero({ onExploreClick }) {
  return (
    <section className="relative min-h-[560px] sm:min-h-[640px] md:min-h-[720px] lg:h-[90vh] py-16 sm:py-24 md:py-32 flex items-center px-4 sm:px-8 md:px-20 overflow-hidden">
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
      <div className="relative z-10 max-w-3xl pt-8 sm:pt-14 md:pt-20">
        <span className="tracking-[0.2em] uppercase text-[10px] sm:text-xs text-white/90 mb-3 sm:mb-4 block font-medium font-mono">
          Est. {STORE_INFO.established} • Saddar, Karachi
        </span>
        <InkHeadline
          as="h1"
          by="word"
          trigger="inView"
          duration={1600}
          stagger={220}
          inkColor="#ffffff"
          className="font-headline text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl text-white leading-[1.12] sm:leading-[1.08] mb-5 sm:mb-8 tracking-tight font-light"
        >
          You dream, we made it come true.
        </InkHeadline>
        <p className="text-white/85 text-sm sm:text-base md:text-xl max-w-lg mb-6 sm:mb-10 leading-relaxed font-light">
          Fine gold jewellery since 1992 in Saddar, Karachi. Certified 22K, 21K, and 18K gold bridal sets, rings, and polki jewellery.
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
