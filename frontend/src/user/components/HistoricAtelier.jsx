import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Star, ArrowRight, Navigation } from 'lucide-react'
import { LuxuryButton } from './LuxuryButton'
import { NeuralNoise } from '@/components/ui/neural-noise'
import InkHeadline from '@/components/ui/ink-headline'
import { galleryApi } from '@/api/galleryApi'
import { STORE_INFO } from '@/constants/storeInfo'
import { StoreStatusBadge } from '@/components/StoreStatusBadge'

export function HistoricAtelier({ onBookClick }) {
  const navigate = useNavigate()
  const [piece, setPiece] = useState(null)

  useEffect(() => {
    let isMounted = true

    const fetchBestPiece = async () => {
      try {
        const res = await galleryApi.getAll()
        if (!isMounted) return
        if (Array.isArray(res?.data) && res.data.length > 0) {
          const sorted = [...res.data].sort((a, b) => {
            const rA = Number(a.averageRating ?? a.rating ?? 0)
            const rB = Number(b.averageRating ?? b.rating ?? 0)
            return rB - rA
          })
          setPiece(sorted[0])
        }
      } catch {
        if (isMounted) setPiece(null)
      }
    }

    fetchBestPiece()
    return () => {
      isMounted = false
    }
  }, [])

  const targetId = piece?._id || piece?.id
  const hasRating = Boolean(piece?.averageRating || piece?.rating)
  const displayRating = hasRating ? Number(piece.averageRating || piece.rating).toFixed(1) : '5.0'

  return (
    <section id="atelier" className="relative py-28 md:py-36 px-6 md:px-20 bg-linear-to-b from-[#f9f9f9] via-[#f5f2ea] to-[#f9f9f9] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <NeuralNoise
          opacity={0.24}
          speed={0.0006}
          position="absolute"
          className="absolute inset-0 size-full pointer-events-none"
          zIndex={0}
        />
      </div>
      <div className="relative z-10 max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
        <div className="w-full lg:w-1/2">
          <span className="text-[#5f5e5e] tracking-[0.2em] uppercase text-xs mb-4 block font-medium">
            Visit Our Store
          </span>
          <InkHeadline
            as="h2"
            by="word"
            trigger="inView"
            duration={1600}
            stagger={220}
            inkColor="#2d3435"
            className="font-headline text-4xl md:text-6xl text-[#2d3435] mb-8 leading-tight font-normal"
          >
            Visit Our Boutique in Karachi
          </InkHeadline>
          <p className="text-[#5a6061] text-base md:text-lg mb-10 max-w-lg leading-relaxed font-light">
            Located in Murshid Sunaar Tower on Dr. Daud Pota Road in Saddar, Karachi, our boutique welcomes you to experience certified 22K and 24K pure gold jewellery, custom bridal heirlooms, and bespoke design consultations.
          </p>
          <div className="space-y-6 border-l border-neutral-300 pl-6 mb-10">
            <div>
              <p className="tracking-widest text-[10px] uppercase text-[#5a6061] mb-1 font-medium font-mono">
                Store Location
              </p>
              <p className="font-headline text-lg sm:text-xl text-[#2d3435]">
                {STORE_INFO.address.full}
              </p>
            </div>
            <div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <p className="tracking-widest text-[10px] uppercase text-[#5a6061] font-medium font-mono">
                  Business Hours
                </p>
                <StoreStatusBadge variant="compact" />
              </div>
              <p className="font-headline text-base sm:text-lg text-[#2d3435]">
                {STORE_INFO.hours.summary}
              </p>
              <p className="text-xs text-[#5a6061] mt-0.5 font-light">Sunday: Closed</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <LuxuryButton onClick={onBookClick} variant="gold">
              <Calendar className="size-3.5 text-amber-200" />
              <span>Book an Appointment</span>
            </LuxuryButton>
            <a
              href={STORE_INFO.social.googleMapsDirections}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 min-h-[48px] px-6 py-3.5 rounded-full border border-neutral-300 hover:border-amber-600 bg-white/90 hover:bg-white text-xs font-mono uppercase tracking-wider text-[#2d3435] transition-all cursor-pointer shadow-2xs"
            >
              <Navigation className="size-3.5 text-amber-700" />
              <span>Get Directions</span>
            </a>
          </div>
        </div>
        <div className="w-full lg:w-1/2 relative">
          <div
            onClick={() => {
              if (targetId) {
                navigate(`/gallery/${targetId}`)
              } else {
                navigate('/gallery')
              }
            }}
            className="group cursor-pointer bg-[#ebeeef] overflow-hidden shadow-2xl rounded-2xl relative aspect-[4/5] sm:aspect-square border border-neutral-300/70"
          >
            <img
              alt={piece?.title || 'Khalil & Sons Jewellery Atelier'}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              src={piece?.imageUrl || piece?.src || '/images/image-03.jpg'}
              onError={(e) => {
                e.currentTarget.onerror = null
                e.currentTarget.src = '/images/image-03.jpg'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-5 left-5 right-5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-amber-300 block">
                  Featured Gallery Masterpiece
                </span>
                <span className="text-sm font-serif font-light text-white truncate block">
                  {piece?.title || 'Explore Atelier Gallery'}
                </span>
              </div>
              <div className="size-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
                <ArrowRight className="size-4" />
              </div>
            </div>
          </div>
          <div className="absolute -top-8 -left-6 md:-top-10 md:-left-10 p-5 sm:p-6 bg-white/95 backdrop-blur-md border border-neutral-200/80 shadow-xl rounded-xl max-w-[240px]">
            {hasRating ? (
              <div className="flex flex-col gap-1">
                <span className="font-headline text-3xl sm:text-4xl text-[#2d3435] font-light">
                  {displayRating}
                </span>
                <div className="flex gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="size-3.5 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <span className="text-[10px] uppercase tracking-widest text-[#5a6061] mt-1 font-mono font-medium truncate block">
                  {piece?.title || 'Customer Reviews'}
                </span>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                <span className="text-xs font-serif font-medium text-[#2d3435] line-clamp-2 leading-snug">
                  {piece?.title || 'Certified 22K Gold Boutique'}
                </span>
                <div className="flex gap-1 text-amber-500 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="size-3.5 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <span className="text-[10px] uppercase tracking-widest text-amber-800 font-mono font-medium mt-1">
                  Karachi • Est. 1992
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
