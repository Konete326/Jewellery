import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Eye, Gem } from 'lucide-react'
import { LuxuryButton } from './LuxuryButton'
import { SaveToVaultButton } from '@/components/ui/SaveToVaultButton'
import { galleryApi } from '@/api/galleryApi'

export function FeaturedMasterpieces() {
  const navigate = useNavigate()
  const [pieces, setPieces] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const loadDynamicGallery = async () => {
      try {
        const res = await galleryApi.getAll()
        if (!isMounted) return

        const apiItems = Array.isArray(res?.data) ? res.data : []
        const validItems = apiItems.filter((item) => item.imageUrl || item.src)
        const badges = ['Featured', 'Popular', 'Signature Design', 'Handmade']

        const mapped = validItems.slice(0, 6).map((item, idx) => {
          return {
            id: item._id || item.id,
            name: item.title,
            material: item.description || 'Certified 22K Solid Gold',
            image: item.imageUrl || item.src,
            badge: badges[idx % badges.length],
            offset: idx === 1
          }
        })

        setPieces(mapped)
      } catch {
        if (isMounted) setPieces([])
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadDynamicGallery()
    return () => {
      isMounted = false
    }
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
            onClick={() => navigate('/masterpieces')}
            className="text-[#5a6061] hover:text-[#2d3435] text-xs tracking-widest uppercase inline-flex items-center gap-1.5 transition-colors cursor-pointer group"
          >
            <span>View All Pieces</span>
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
            {[1, 2, 3].map((n) => (
              <div key={n} className="animate-pulse space-y-4">
                <div className="bg-neutral-200 aspect-square rounded-xl" />
                <div className="h-6 bg-neutral-200 rounded w-2/3" />
                <div className="h-4 bg-neutral-200 rounded w-full" />
              </div>
            ))}
          </div>
        ) : pieces.length === 0 ? (
          <div className="rounded-2xl border border-neutral-300/80 bg-white p-12 text-center max-w-xl mx-auto shadow-sm">
            <Gem className="size-8 text-neutral-600 mx-auto mb-4" />
            <h3 className="font-headline text-2xl text-[#2d3435] mb-2 font-normal">
              New Designs Coming Soon
            </h3>
            <p className="text-sm text-[#5a6061] leading-relaxed mb-6 font-light">
              Our goldsmiths are crafting new bridal designs. They will appear here once ready.
            </p>
            <LuxuryButton onClick={() => navigate('/masterpieces')} variant="gold">
              Browse Masterpieces
            </LuxuryButton>
          </div>
        ) : (
          <div className={`grid grid-cols-1 ${pieces.length === 1 ? 'md:grid-cols-1 max-w-md mx-auto' : pieces.length === 2 ? 'md:grid-cols-2 max-w-3xl mx-auto' : 'md:grid-cols-3'} gap-10 md:gap-12`}>
            {pieces.map((piece) => {
              return (
                <div
                  key={piece.id}
                  onClick={() => navigate(`/masterpieces/${piece.id}`)}
                  className={`group cursor-pointer ${piece.offset ? 'translate-y-0 md:translate-y-12' : ''}`}
                >
                  <div className="bg-white aspect-square p-10 flex items-center justify-center relative mb-6 shadow-sm overflow-hidden border border-neutral-200/60 rounded-xl">
                    <div className="absolute top-4 left-4 z-10">
                      <SaveToVaultButton
                        piece={{ _id: piece.id, title: piece.name, imageUrl: piece.image, description: piece.material }}
                      />
                    </div>
                    <img
                      alt={piece.name}
                      className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-700"
                      src={piece.image}
                      onError={(e) => {
                        e.currentTarget.onerror = null
                        e.currentTarget.src = '/images/image-01.jpg'
                      }}
                    />
                    <div className="absolute top-6 right-6 flex flex-col items-end gap-1.5 z-10">
                      {piece.badge && (
                        <span className="bg-[#e4e9ea] px-3 py-1 text-[10px] tracking-widest uppercase font-medium rounded-sm">
                          {piece.badge}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-mono font-medium tracking-wide uppercase bg-white/90 text-amber-900 border border-amber-500/30 shadow-2xs backdrop-blur-xs">
                        <span>AU · 916.6</span>
                        <span className="text-amber-500/50">•</span>
                        <span>Archive</span>
                      </span>
                    </div>
                    <div className="absolute bottom-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <LuxuryButton
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/masterpieces/${piece.id}`)
                        }}
                        size="sm"
                        variant="gold"
                      >
                        <Eye className="size-3.5 text-amber-200" />
                        <span>View Details</span>
                      </LuxuryButton>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-headline text-2xl text-[#2d3435] font-normal group-hover:text-amber-800 transition-colors">
                      {piece.name}
                    </h3>
                  </div>
                  <p className="text-[#5a6061] text-xs mb-4 font-light line-clamp-2">
                    {piece.material}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-neutral-200/50">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-[#5a6061]">
                      Khalil & Sons Fine Jewellery
                    </span>
                    <span className="text-xs font-mono uppercase tracking-wider text-amber-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>View Details</span>
                      <ArrowRight className="size-3" />
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
