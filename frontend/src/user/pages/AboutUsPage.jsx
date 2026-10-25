import React, { useState, useEffect } from 'react'
import { Navbar } from '@/user/components/Navbar'
import { Footer } from '@/user/components/Footer'
import { SearchModal } from '@/user/components/SearchModal'
import { CartDrawer } from '@/user/components/CartDrawer'
import { BespokeAppointmentModal } from '@/user/components/BespokeAppointmentModal'
import { GlobalGoldEffect } from '@/user/components/GlobalGoldEffect'
import AboutUs from '@/components/shadcn-studio/blocks/about-us-page-30/about-us-page-30'

export function AboutUsPage() {
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
    try {
      localStorage.setItem('khalil_cart', JSON.stringify(cartItems))
    } catch {}
  }, [cartItems])

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <div className="relative min-h-screen bg-[#f9f9f9] text-[#2d3435]">
      <GlobalGoldEffect />
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={totalCartCount}
      />
      <main className="relative z-10 pt-8">
        <AboutUs />
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
