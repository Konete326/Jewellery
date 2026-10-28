import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Navbar } from '@/user/components/Navbar'
import { Footer } from '@/user/components/Footer'
import { SearchModal } from '@/user/components/SearchModal'
import { CartDrawer } from '@/user/components/CartDrawer'
import { BespokeAppointmentModal } from '@/user/components/BespokeAppointmentModal'
import AboutUs from '@/components/shadcn-studio/blocks/about-us-page-30/about-us-page-30'
import { BrandChronicle } from '@/user/components/BrandChronicle'
import { AtelierInteractiveMap } from '@/user/components/AtelierInteractiveMap'
import FAQSection from '@/components/ui/faq1'
import { updatePageSEO } from '@/utils/seo'
import { broadcastCartUpdate, subscribeToTabSync } from '@/utils/tabSync'

const aboutFaqs = [
  {
    question: "Where is the Khalil & Sons atelier located?",
    answer: "Our flagship atelier and showroom is situated at Shop #2, Murshid Sunaar Tower, Dr. Daud Pota Road, Saddar, Karachi. We have welcomed collector families here since 1992."
  },
  {
    question: "What hallmark certification accompanies your gold jewellery?",
    answer: "Every gold creation is rigorously tested and certified for 22K (.916) or 24K pure gold purity, stamped with our authentic atelier hallmark and issued with a physical purity certificate."
  },
  {
    question: "How long does a bespoke bridal heirloom commission take?",
    answer: "A bespoke bridal set typically requires 3 to 5 weeks from initial design sketching and wax moulding to final stone setting and gold polishing."
  },
  {
    question: "Can I visit the workshop to discuss an heirloom remodel?",
    answer: "Yes, we welcome private consultations for remodelling antique jewellery or creating new heirlooms using your own gold or sourced gemstones."
  },
  {
    question: "Do you deliver securely across Pakistan and internationally?",
    answer: "Yes, all heirloom deliveries are fully insured and packaged in security-sealed vaults dispatched directly to your designated address."
  }
];

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
      const count = cartItems.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0)
      broadcastCartUpdate(count, cartItems)
    } catch {}
  }, [cartItems])

  useEffect(() => {
    const unsubscribe = subscribeToTabSync((data) => {
      if (data?.type === 'CART_UPDATE' && Array.isArray(data.items)) {
        setCartItems(data.items)
      }
    })
    return unsubscribe
  }, [])

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
      <main className="relative z-10 w-full max-w-[1880px] mx-auto">
        <AboutUs />
        <BrandChronicle onOpenAppointment={() => setIsAppointmentOpen(true)} />
        <div className="px-4 sm:px-8 lg:px-12 xl:px-16 py-6">
          <FAQSection
            faqs={aboutFaqs}
            category="Heritage & Craftsmanship"
            title="Atelier Heritage & Standards"
            subtitle="Essential details regarding our three-decade legacy in Saddar Karachi, gold hallmark purity, and bespoke appointments."
          />
        </div>
        <div className="px-4 sm:px-8 lg:px-12 xl:px-16 pb-16">
          <AtelierInteractiveMap onOpenAppointment={() => setIsAppointmentOpen(true)} />
        </div>
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
