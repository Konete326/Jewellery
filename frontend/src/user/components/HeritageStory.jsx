export function HeritageStory() {
  return (
    <section id="heritage" className="py-28 md:py-36 px-6 md:px-20 bg-[#f9f9f9]">
      <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center">
        <div className="md:col-span-5 relative">
          <div className="bg-[#f2f4f4] p-4 aspect-[3/4] shadow-sm">
            <img
              alt="Vintage photograph of a traditional jewelry workshop"
              className="w-full h-full object-cover grayscale brightness-90"
              src="/images/image-01.jpg"
            />
          </div>
          <div className="absolute -bottom-8 -right-6 md:-right-8 w-44 h-44 md:w-52 md:h-52 bg-white p-2.5 hidden sm:block shadow-md">
            <img
              alt="Macrophotography of a gold ring detail"
              className="w-full h-full object-cover"
              src="/images/image-02.jpg"
            />
          </div>
        </div>
        <div className="md:col-span-6 md:col-start-7 space-y-6">
          <span className="text-[#5f5e5e] tracking-[0.2em] uppercase text-xs block font-medium">
            The Heritage Story
          </span>
          <h2 className="font-headline text-4xl md:text-6xl text-[#2d3435] leading-tight font-normal">
            A Century of <span className="serif-italic">Unseen</span> Details
          </h2>
          <div className="space-y-5 text-[#5a6061] leading-relaxed text-base md:text-lg font-light">
            <p>
              At Khalil & Sons, we believe jewelry should carry the weight of time. Not in heaviness, but in history. Our artisans employ techniques unchanged since the Renaissance—hand-engraving, wax casting, and secret alloy blends that give our gold its distinct moonlit glow.
            </p>
            <p>
              We do not mass-produce. We curate. Each month, only a handful of "Masterpieces" leave our benches, destined for those who understand that true luxury is found in the artist's touch.
            </p>
          </div>
          <div className="pt-4">
            <a
              href="#atelier"
              className="text-[#2d3435] tracking-widest uppercase text-xs border-b border-neutral-400 pb-1 hover:border-black transition-colors"
            >
              Our Philosophy
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
