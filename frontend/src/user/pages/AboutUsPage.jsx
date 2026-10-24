import React, { useState } from 'react'
import { Navbar } from '@/user/components/Navbar'
import { Footer } from '@/user/components/Footer'
import { SearchModal } from '@/user/components/SearchModal'
import { CartDrawer } from '@/user/components/CartDrawer'
import { BespokeAppointmentModal } from '@/user/components/BespokeAppointmentModal'
import AboutUs from '@/components/shadcn-studio/blocks/about-us-page-30/about-us-page-30'

export function AboutUsPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false)
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "The Aurelian Sigil",
      material: "18K Hammered Gold with Raw Diamond",
      price: "$4,200",
      numericPrice: 4200,
      image: "/images/product-thumb-01.jpg",
      quantity: 1
    }
  ])

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <div className="relative min-h-screen bg-[#f9f9f9] text-[#2d3435]">
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
