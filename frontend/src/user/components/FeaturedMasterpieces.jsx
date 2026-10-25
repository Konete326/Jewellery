import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Star, ArrowRight, Eye } from 'lucide-react'
import { LuxuryButton } from './LuxuryButton'
import { galleryApi } from '@/api/galleryApi'
import { DEFAULT_SKIPER_IMAGES } from './Skiper54'

function shuffleArray(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export function FeaturedMasterpieces() {
  const navigate = useNavigate()
  const [pieces, setPieces] = useState(() => {
    const shuffled = shuffleArray(DEFAULT_SKIPER_IMAGES)
    const badges = ['Featured', 'Limited Edition', 'One of One', 'Atelier Masterpiece']
    return shuffled.slice(0, 3).map((item, idx) => ({
      id: item._id || item.id || `default-${idx + 1}`,
      name: item.title,
      material: item.description || 'Handcrafted 22K Solid Gold',
      image: item.imageUrl || item.src,
      badge: badges[idx % badges.length],
      rating: 5.0,
      offset: idx === 1
    }))
  })

  useEffect(() => {
    const loadDynamicGallery = async () => {
      try {
        const res = await galleryApi.getAll()
        const pool = [
          ...(res?.data && res.data.length > 0 ? res.data : []),
          ...DEFAULT_SKIPER_IMAGES
        ]

        const uniqueItems = Array.from(
          new Map(pool.map((item) => [item._id || item.id || item.title, item])).values()
        )

        const shuffled = shuffleArray(uniqueItems)
        const selected = shuffled.slice(0, 3)
        const badges = ['Featured Piece', 'Limited Edition', 'Atelier Heritage', 'Masterwork']

        setPieces(
          selected.map((item, idx) => {
            const rawRating = Number(item.averageRating || item.rating)
            const displayRating = rawRating >= 4 ? rawRating : 4.9

            return {
              id: item._id || item.id || `gallery-${idx + 1}`,
              name: item.title,
              material: item.description || 'Handcrafted 22K Solid Gold',
              image: item.imageUrl || item.src,
              badge: badges[idx % badges.length],
              rating: displayRating,
              offset: idx === 1
            }
          })
        )
      } catch {}
    }

    loadDynamicGallery()
  }, [])

  return (
    <section id="collections" className="py-24 px-6 md:px-20 bg-[#f2f4f4]">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <span className="text-[#5f5e5e] tracking-[0.2em] uppercase text-xs mb-2 block font-medium">
              Our Collection
            </span>
            <h2 className="font-headline text-4xl md:text-5xl text-[#2d3435] font-normal">
              Featured <span className="serif-italic">Jewellery</span>
            </h2>
          </div>
          <button
            type="button"
            onClick={() => navigate('/gallery')}
            className="text-[#5a6061] hover:text-[#2d3435] text-xs tracking-widest uppercase inline-flex items-center gap-1.5 transition-colors cursor-pointer group"
          >
            <span>View All Gallery Pieces</span>
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {pieces.map((piece) => {
            const hasQualifyingRating = piece.rating && piece.rating >= 4

            return (
              <div
                key={piece.id}
                onClick={() => navigate(`/gallery/${piece.id}`)}
                className={`group cursor-pointer ${piece.offset ? 'translate-y-0 md:translate-y-12' : ''}`}
              >
                <div className="bg-white aspect-square p-10 flex items-center justify-center relative mb-6 shadow-sm overflow-hidden border border-neutral-200/60 rounded-xl">
                  <img
                    alt={piece.name}
                    className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-700"
                    src={piece.image}
                    onError={(e) => {
                      e.currentTarget.onerror = null
                      e.currentTarget.src = DEFAULT_SKIPER_IMAGES[0].imageUrl
                    }}
                  />
                  {piece.badge && (
                    <span className="absolute top-6 right-6 bg-[#e4e9ea] px-3 py-1 text-[10px] tracking-widest uppercase font-medium rounded-sm">
                      {piece.badge}
                    </span>
                  )}
                  <div className="absolute bottom-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <LuxuryButton
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/gallery/${piece.id}`)
                      }}
                      size="sm"
                      variant="dark"
                    >
                      <Eye className="size-3.5 text-amber-400" />
                      <span>View Piece</span>
                    </LuxuryButton>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-headline text-2xl text-[#2d3435] font-normal group-hover:text-amber-800 transition-colors">
                    {piece.name}
                  </h3>
                  {hasQualifyingRating && (
                    <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                      <Star className="size-3 fill-amber-500 text-amber-500" />
                      <span className="text-[11px] font-mono font-medium text-amber-800">
                        {piece.rating}
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-[#5a6061] text-xs mb-4 font-light line-clamp-2">
                  {piece.material}
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-neutral-200/50">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#5a6061]">
                    Florence Atelier Piece
                  </span>
                  <span className="text-xs font-mono uppercase tracking-wider text-amber-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>View Piece</span>
                    <ArrowRight className="size-3" />
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
