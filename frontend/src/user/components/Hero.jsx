import { NeuralNoise } from '@/components/ui/neural-noise'
import { LuxuryButton } from './LuxuryButton'

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
      </div>
      <NeuralNoise
        position="absolute"
        zIndex={1}
        color={[0.92, 0.74, 0.28]}
        opacity={0.38}
        speed={0.0009}
      />
      <div className="relative z-10 max-w-3xl pt-20">
        <span className="tracking-[0.2em] uppercase text-xs text-white/90 mb-4 block font-medium">
          Est. 1924 • Florence
        </span>
        <h1 className="font-headline text-5xl md:text-8xl text-white leading-[1.08] mb-8 tracking-tight font-light">
          The Soul of <br />
          <span className="serif-italic">Hand-Wrought</span> Gold
        </h1>
        <p className="text-white/85 text-lg md:text-xl max-w-lg mb-10 leading-relaxed font-light">
          Preserving the silent language of the goldsmith. Every piece at Khalil & Sons is a testament to the patient art of craftsmanship.
        </p>
        <div>
          <LuxuryButton onClick={onExploreClick} variant="gold">
            Explore Atelier
          </LuxuryButton>
        </div>
      </div>
    </section>
  )
}
