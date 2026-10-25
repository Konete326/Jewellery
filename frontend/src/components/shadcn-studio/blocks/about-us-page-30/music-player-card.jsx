import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { ArrowUpRight } from 'lucide-react'
import { galleryApi } from '@/api/galleryApi'

const MusicPlayerCard = () => {
  const navigate = useNavigate()
  const [piece, setPiece] = useState(null)

  useEffect(() => {
    let isMounted = true

    const fetchPiece = async () => {
      try {
        const res = await galleryApi.getAll()
        if (!isMounted) return
        if (res?.data && res.data.length > 0) {
          const valid = res.data.filter((item) => item.imageUrl || item.src)
          if (valid.length > 0) {
            setPiece(valid[0])
          }
        }
      } catch {}
    }

    fetchPiece()
    return () => {
      isMounted = false
    }
  }, [])

  const targetId = piece?._id || piece?.id
  const title = piece?.title || 'Bespoke Atelier Collection'
  const description = piece?.description || 'Handcrafted certified 22K gold and bridal jewellery crafted in Karachi.'
  const imageUrl = piece?.imageUrl || piece?.src || '/assets/about/brand-poster.jpg'

  return (
    <Card
      onClick={() => {
        if (targetId) {
          navigate(`/gallery/${targetId}`)
        } else {
          navigate('/gallery')
        }
      }}
      className='ring-foreground/10 bg-card relative overflow-hidden rounded-3xl p-0 shadow-xs ring-1 transition-all group flex flex-col justify-between border-border cursor-pointer hover:ring-amber-500/40 h-[310px]'
    >
      <div className='relative w-full h-44 overflow-hidden bg-neutral-900'>
        <img
          src={imageUrl}
          alt={title}
          loading='lazy'
          className='size-full object-cover transition-transform duration-700 group-hover:scale-105'
          onError={(e) => {
            e.currentTarget.onerror = null
            e.currentTarget.src = '/assets/about/brand-poster.jpg'
          }}
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent' />
        <div className='absolute bottom-3 left-4 right-4 flex items-center justify-between'>
          <span className='text-[10px] uppercase font-mono tracking-widest text-amber-300 font-medium'>
            Featured Piece
          </span>
          <div className='size-7 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity'>
            <ArrowUpRight className='size-3.5' />
          </div>
        </div>
      </div>

      <div className='p-5 space-y-1.5 flex-1 flex flex-col justify-between'>
        <div>
          <h4 className='font-headline text-lg text-foreground font-medium group-hover:text-amber-700 transition-colors line-clamp-1'>
            {title}
          </h4>
          <p className='text-xs text-muted-foreground font-light leading-relaxed line-clamp-2 mt-1'>
            {description}
          </p>
        </div>
        <div className='flex items-center justify-between pt-2 border-t border-border/50 text-[11px] text-amber-700 font-mono uppercase tracking-wider'>
          <span>View Details</span>
          <span>&rarr;</span>
        </div>
      </div>
    </Card>
  )
}

export default MusicPlayerCard
