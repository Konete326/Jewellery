import { useState } from 'react'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { HeritageStory } from './components/HeritageStory'
import { FeaturedMasterpieces } from './components/FeaturedMasterpieces'
import { HistoricAtelier } from './components/HistoricAtelier'
import { Footer } from './components/Footer'
import { SearchModal } from './components/SearchModal'
import { CartDrawer } from './components/CartDrawer'

export function UserPanel() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
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

  const handleAddToCart = (piece) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === piece.id)
      if (existing) {
        return prev.map((item) =>
          item.id === piece.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { ...piece, quantity: 1 }]
    })
    setIsCartOpen(true)
  }

  const handleIncrement = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    )
  }

  const handleDecrement = (id) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const handleRemove = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id))
  }

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <div className="relative min-h-screen bg-[#f9f9f9] text-[#2d3435]">
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={totalCartCount}
      />
      <main className="relative z-10 bg-[#f9f9f9]">
        <Hero onExploreClick={() => {
          document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' })
        }} />
        <HeritageStory />
        <FeaturedMasterpieces onAddToCart={handleAddToCart} />
        <HistoricAtelier onBookClick={() => {
          window.location.href = 'mailto:concierge@khalilandsons.com?subject=Private%20Atelier%20Appointment'
        }} />
      </main>
      <Footer />
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onIncrement={handleIncrement}
        onDecrement={handleDecrement}
        onRemove={handleRemove}
      />
    </div>
  )
}
