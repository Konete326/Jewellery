import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Navbar } from '@/user/components/Navbar'
import { Footer } from '@/user/components/Footer'
import { SearchModal } from '@/user/components/SearchModal'
import { CartDrawer } from '@/user/components/CartDrawer'
import { BespokeAppointmentModal } from '@/user/components/BespokeAppointmentModal'
import AboutUs from '@/components/shadcn-studio/blocks/about-us-page-30/about-us-page-30'
import { BrandChronicle } from '@/user/components/BrandChronicle'
import { updatePageSEO } from '@/utils/seo'

export function AboutUsPage() {
  const location = useLocation()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false)
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('khalil_cart')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    updatePageSEO({
      title: 'Our Heritage & 3-Decade Legacy (Est. 1992)',
      description: 'The story of Khalil & Sons Jewellers. Founded in 1992 by Mr. Khalil Ahmed in Murshid Bazaar, Saddar, Karachi. Three decades of authentic Mughal filigree, 22K/24K purity, and bespoke bridal goldsmithing.',
      keywords: 'Khalil and Sons history, master goldsmith Karachi, 1992 jewellery Saddar, Murshid Bazaar Karachi, family jewelers Karachi'
    })
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('khalil_cart', JSON.stringify(cartItems))
    } catch {}
  }, [cartItems])

  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.replace('#', '')
      const element = document.getElementById(targetId)
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' })
        }, 150)
      }
    }
  }, [location.hash])

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <div className="relative min-h-screen bg-[#f9f9f9] text-[#2d3435]">
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={totalCartCount}
      />
      <main className="relative z-10 w-full">
        <AboutUs />
        <BrandChronicle onOpenAppointment={() => setIsAppointmentOpen(true)} />
      </main>
      <Footer />
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
      <BespokeAppointmentModal
        isOpen={isAppointmentOpen}
        onClose={() => setIsAppointmentOpen(false)}
      />
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onIncrement={(id) =>
          setCartItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item))
          )
        }
        onDecrement={(id) =>
          setCartItems((prev) =>
            prev
              .map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
              .filter((item) => item.quantity > 0)
          )
        }
        onRemove={(id) => setCartItems((prev) => prev.filter((item) => item.id !== id))}
      />
    </div>
  )
}

export default AboutUsPage
