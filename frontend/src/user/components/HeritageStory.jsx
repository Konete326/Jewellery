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
            Our Story
          </span>
          <h2 className="font-headline text-4xl md:text-6xl text-[#2d3435] leading-tight font-normal">
            Over 100 Years of <span className="serif-italic">Fine</span> Craftsmanship
          </h2>
          <div className="space-y-5 text-[#5a6061] leading-relaxed text-base md:text-lg font-light">
            <p>
              At Khalil & Sons, we believe jewellery should hold lasting beauty and personal meaning. Our skilled jewelers use time-tested methods — hand-engraving, lost-wax casting, and pure gold alloys that give each design a warm, natural shine.
            </p>
            <p>
              We never mass-produce. Every month, only a few handmade pieces leave our workshop, crafted with care for customers who appreciate real quality.
            </p>
          </div>
          <div className="pt-4">
            <a
              href="#atelier"
              className="text-[#2d3435] tracking-widest uppercase text-xs border-b border-neutral-400 pb-1 hover:border-black transition-colors"
            >
              Learn More About Us
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
