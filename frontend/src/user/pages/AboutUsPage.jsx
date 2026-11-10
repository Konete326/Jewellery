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
import { updatePageSEO, getFAQSchema } from '@/utils/seo'
import { broadcastCartUpdate, subscribeToTabSync, getCartStorageKey } from '@/utils/tabSync'
import { getLocalCart, saveLocalCart } from '@/utils/cartStorage'

const aboutFaqs = [
  {
    question: "Where is the Khalil & Sons showroom located?",
    answer: "Our showroom and workshop is located at Shop #2, Murshid Sunaar Tower, Dr. Daud Pota Road, Saddar, Karachi. We have welcomed families here since 1992."
  },
  {
    question: "What hallmark certification comes with your gold jewellery?",
    answer: "Every gold piece is tested and certified for 22K (.916), 21K (.875), or 18K (.750) purity, stamped with our authentic hallmark and provided with a purity certificate."
  },
  {
    question: "How long does a custom bridal set take to make?",
    answer: "A custom bridal set typically takes 3 to 5 weeks from initial design to casting, stone setting, and final polish."
  },
  {
    question: "Can I visit the showroom to discuss custom jewellery or redesigns?",
    answer: "Yes, we welcome in-person visits to discuss custom jewellery, redesigning existing gold pieces, or crafting new designs with your chosen gemstones."
  },
  {
    question: "How do I receive my completed jewellery order?",
    answer: "All completed orders are collected in person from our Saddar, Karachi showroom, where you can inspect your jewellery, verify the hallmark, and ensure a perfect fit."
  }
];

export function AboutUsPage() {
  const location = useLocation()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false)
  const [cartItems, setCartItems] = useState(() => getLocalCart())

  useEffect(() => {
    updatePageSEO({
      title: 'Our Heritage & 3-Decade Legacy (Est. 1992)',
      description: 'The story of Khalil & Sons Jewellers. Founded in 1992 by Mr. Khalil Ahmed in Murshid Bazaar, Saddar, Karachi. Three decades of authentic Mughal filigree, certified 22K/21K/18K purity, and bespoke bridal goldsmithing.',
      keywords: 'Khalil and Sons history, master goldsmith Karachi, 1992 jewellery Saddar, Murshid Bazaar Karachi, family jewelers Karachi',
      url: 'https://khalilandsonsjewellers.com/about',
      schema: getFAQSchema(aboutFaqs)
    })
  }, [])

  useEffect(() => {
    saveLocalCart(cartItems)
    const count = cartItems.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0)
    broadcastCartUpdate(count, cartItems)
  }, [cartItems])

  useEffect(() => {
    const handleAuthChange = (e) => {
      const nextUser = e?.detail ?? null
      setCartItems(getLocalCart(nextUser))
    }
    window.addEventListener('khalil_auth_change', handleAuthChange)
    return () => window.removeEventListener('khalil_auth_change', handleAuthChange)
  }, [])

  useEffect(() => {
    const unsubscribe = subscribeToTabSync((data) => {
      if (data?.type === 'CART_UPDATE' && Array.isArray(data.items)) {
        const currentKey = getCartStorageKey()
        if (!data.cartKey || data.cartKey === currentKey) {
          setCartItems(data.items)
        }
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
            title="Our Heritage & Standards"
            subtitle="Essential details about our three-decade history in Saddar, Karachi, gold hallmark purity, and custom orders."
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
        onUpdateQuantity={(id, qty) =>
          setCartItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, qty) } : item))
          )
        }
        onClearCart={() => setCartItems([])}
      />
    </div>
  )
}

export default AboutUsPage
