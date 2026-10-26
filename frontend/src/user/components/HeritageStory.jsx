import React from 'react'
import { Link } from 'react-router-dom'
import InkHeadline from '@/components/ui/ink-headline'
import { STORE_INFO } from '@/constants/storeInfo'

export function HeritageStory() {
  return (
    <section id="heritage" className="py-28 md:py-36 px-6 md:px-20 bg-[#f9f9f9]">
      <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center">
        <div className="md:col-span-5 relative">
          <div className="bg-[#f2f4f4] p-4 aspect-[3/4] shadow-sm rounded-xl overflow-hidden border border-neutral-200/70">
            <img
              alt="Artisanal gold workshop of Khalil & Sons"
              className="w-full h-full object-cover"
              src="/assets/about/founder-poster.jpg"
              onError={(e) => {
                e.currentTarget.onerror = null
                e.currentTarget.src = '/images/image-01.jpg'
              }}
            />
          </div>
          <div className="absolute -bottom-8 md:-bottom-10 left-0 right-0 w-full h-44 md:h-52 bg-white p-2.5 hidden sm:block shadow-xl rounded-xl border border-neutral-200/80 overflow-hidden">
            <img
              alt="Detailed craftsmanship of bridal gold jewelry"
              className="w-full h-full object-cover"
              src="/assets/about/brand-poster.jpg"
              onError={(e) => {
                e.currentTarget.onerror = null
                e.currentTarget.src = '/images/image-02.jpg'
              }}
            />
          </div>
        </div>
        <div className="md:col-span-6 md:col-start-7 space-y-6">
          <span className="text-[#5f5e5e] tracking-[0.2em] uppercase text-xs block font-medium font-mono">
            Our Heritage • Est. {STORE_INFO.established}
          </span>
          <InkHeadline
            as="h2"
            by="word"
            trigger="inView"
            duration={1600}
            stagger={220}
            inkColor="#2d3435"
            className="font-headline text-4xl md:text-6xl text-[#2d3435] leading-tight font-normal"
          >
            Master Goldsmithing Since 1992
          </InkHeadline>
          <div className="space-y-5 text-[#5a6061] leading-relaxed text-base md:text-lg font-light">
            <p>
              Founded in 1992 by Mr. Khalil Ahmed in Murshid Bazaar, Saddar, Karachi, Khalil & Sons Jewellers preserves authentic artisanal goldsmithing and bridal jewelry across generations.
            </p>
            <p>
              We specialize in certified 22K (.916) and 24K pure gold, hand-set natural diamonds, Polki heirlooms, and custom bridal jewelry crafted with care for families who value lasting quality and certified purity.
            </p>
          </div>
          <div className="pt-4">
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-[#2d3435] tracking-widest uppercase text-xs border-b border-neutral-400 pb-1 hover:border-black hover:text-amber-800 transition-colors"
            >
              <span>Discover Our Story & Workshop</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
