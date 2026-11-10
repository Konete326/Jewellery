import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { SearchModal } from '../components/SearchModal';
import { CartDrawer } from '../components/CartDrawer';
import { MasterpieceReviewModal } from '../components/MasterpieceReviewModal';
import InkHeadline from '@/components/ui/ink-headline';
import { CircularTestimonials } from '@/components/ui/circular-testimonials';
import TestimonialSection2, { defaultTestimonials } from '@/components/ui/testimonial-section-2';
import { NeuralNoise } from '@/components/ui/neural-noise';
import FAQSection from '@/components/ui/faq1';
import { galleryApi } from '@/api/galleryApi';
import { updatePageSEO, getFAQSchema } from '@/utils/seo';
import { broadcastCartUpdate, subscribeToTabSync, getCartStorageKey } from '@/utils/tabSync';
import { getLocalCart, saveLocalCart } from '@/utils/cartStorage';

const fallbackAvatars = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80'
];

const reviewsFaqs = [
  {
    question: "How are customer reviews verified?",
    answer: "Every review is cross-referenced with order records and certificates to ensure genuine customer feedback."
  },
  {
    question: "Can I leave a review for jewellery purchased in the past?",
    answer: "Yes. Customers who purchased from our Saddar showroom can submit a review anytime by selecting 'Write a review' on any item page."
  },
  {
    question: "Where can I read Google Maps reviews?",
    answer: "Our Google Maps listing features verified 5-star customer reviews and photos of our showroom in Saddar, Karachi."
  },
  {
    question: "Are wedding and bridal photos shared with privacy protection?",
    answer: "Yes, customer photos are published only with written consent, respecting your privacy."
  },
  {
    question: "Can I update or edit my review after submission?",
    answer: "Yes. If you wish to update your feedback or photos, please message our team on WhatsApp."
  }
];

export function ReviewsPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewingPiece, setReviewingPiece] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [cartItems, setCartItems] = useState(() => getLocalCart());

  useEffect(() => {
    saveLocalCart(cartItems);
    const count = cartItems.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
    broadcastCartUpdate(count, cartItems);
  }, [cartItems]);

  useEffect(() => {
    const handleAuthChange = (e) => {
      const nextUser = e?.detail ?? null;
      setCartItems(getLocalCart(nextUser));
    };
    window.addEventListener('khalil_auth_change', handleAuthChange);
    return () => window.removeEventListener('khalil_auth_change', handleAuthChange);
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToTabSync((data) => {
      if (data?.type === 'CART_UPDATE' && Array.isArray(data.items)) {
        const currentKey = getCartStorageKey();
        if (!data.cartKey || data.cartKey === currentKey) {
          setCartItems(data.items);
        }
      }
    });
    return unsubscribe;
  }, []);

  const totalCartCount = cartItems.reduce((acc, item) => acc + (Number(item.quantity) || 1), 0);

  useEffect(() => {
    updatePageSEO({
      title: 'Customer Reviews & Ratings | Khalil & Sons Jewellers',
      description: 'Read authentic customer reviews and ratings for bridal sets, bangles, and gold jewellery from Khalil & Sons in Saddar, Karachi.',
      keywords: 'Khalil & Sons reviews, customer testimonials gold jewelry, bridal jewelry appraisals Karachi',
      url: 'https://khalilandsonsjewellers.com/reviews',
      schema: getFAQSchema(reviewsFaqs)
    });
  }, []);

  const loadReviews = async () => {
    try {
      const res = await galleryApi.getRecentReviews(50);
      const list = res?.data || (Array.isArray(res) ? res : []);
      setReviews(list);
    } catch {
      setReviews([]);
    }
  };

  useEffect(() => {
    loadReviews();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const heroTestimonials = useMemo(() => {
    if (!reviews || reviews.length === 0) {
      return [
        {
          quote: "The bridal choker crafted by Khalil & Sons has the most exquisite 22K gold craftsmanship. Truly a family heirloom for generations.",
          name: "Ayesha Malik",
          designation: "5★ Rating • Karachi",
          src: fallbackAvatars[0],
          productTitle: "Royal Heritage Nizam Kundan Choker",
          productImage: "/assets/products/choker-ruby-01.jpg",
          isArchived: true
        },
        {
          quote: "Their transparency with gold hallmarks and certificate of authenticity gives unmatched peace of mind. Exceptional boutique service in Saddar.",
          name: "Dr. Farhan Siddiqui",
          designation: "5★ Rating • Karachi",
          src: fallbackAvatars[1],
          productTitle: "Artisanal Solitaire Diamond Band",
          productImage: "/assets/products/kada-polki-01.jpg",
          isArchived: true
        },
        {
          quote: "Our customized bridal bangles were delivered well ahead of the wedding date. The delicate meenakari detailing is mesmerizing.",
          name: "Zainab Raza",
          designation: "5★ Rating • Karachi",
          src: fallbackAvatars[2],
          productTitle: "Mughal Polki Heritage Bangles",
          productImage: "/assets/products/guluband-01.jpg",
          isArchived: true
        }
      ];
    }

    return reviews.slice(0, 10).map((r, idx) => ({
      quote: r.comment || "Exceptional gold purity and immaculate craftsmanship.",
      name: r.userName || "Verified Customer",
      designation: `${r.rating || 5}★ Rating • ${r.masterpieceCategory || 'Fine Jewellery'}`,
      src: r.masterpieceImage || fallbackAvatars[idx % fallbackAvatars.length],
      productTitle: r.masterpieceTitle || "Handcrafted Jewellery",
      productImage: r.masterpieceImage,
      productId: r.masterpieceId,
      isArchived: Boolean(r.isArchived) || !r.masterpieceId,
      rating: r.rating || 5
    }));
  }, [reviews]);

  const marqueeTestimonials = useMemo(() => {
    const dynamicItems = (reviews || []).map((r, idx) => ({
      id: r._id || `dynamic-${idx}`,
      name: r.userName || "Verified Customer",
      role: `${r.rating || 5}★ Rating • ${r.masterpieceCategory || 'Fine Jewellery'}`,
      image: r.masterpieceImage || fallbackAvatars[idx % fallbackAvatars.length],
      quote: r.comment || "Handcrafted jewellery made with certified gold purity.",
      productTitle: r.masterpieceTitle || "Handcrafted Jewellery",
      productImage: r.masterpieceImage,
      productId: r.masterpieceId,
      isArchived: Boolean(r.isArchived) || !r.masterpieceId
    }));

    if (dynamicItems.length >= 9) {
      return dynamicItems;
    }

    if (dynamicItems.length > 0) {
      const neededFromDummy = 9 - dynamicItems.length;
      const dummyFill = (defaultTestimonials || []).slice(0, neededFromDummy);
      return [...dynamicItems, ...dummyFill];
    }

    return defaultTestimonials;
  }, [reviews]);

  return (
    <div className="relative min-h-screen bg-[#f9f9f9] text-[#2d3435] overflow-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <NeuralNoise
          opacity={0.25}
          speed={0.0006}
          position="absolute"
          className="absolute inset-0 size-full pointer-events-none"
          zIndex={0}
        />
      </div>

      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={totalCartCount}
      />

      <section className="relative z-10 pt-28 pb-12 px-4 sm:px-8 lg:px-12 xl:px-16 w-full">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-800 text-xs font-mono tracking-widest uppercase mb-4">
            <img
              src="/assets/logo.png"
              alt="Khalil & Sons"
              className="size-4 object-contain"
            />
            <span>Customer Reviews</span>
          </div>
          <InkHeadline
            as="h1"
            by="word"
            trigger="inView"
            duration={1600}
            stagger={200}
            inkColor="#2d3435"
            className="font-headline text-3xl sm:text-5xl lg:text-6xl font-light text-[#2d3435] leading-tight mb-4"
          >
            Customer Reviews
          </InkHeadline>
          <p className="text-sm sm:text-base text-[#5a6061] font-light max-w-xl mx-auto leading-relaxed">
            Read real reviews from customers who chose Khalil & Sons for their bridal and fine jewellery.
          </p>
        </div>

        <div className="rounded-3xl bg-white/70 border border-neutral-200/80 p-4 sm:p-8 lg:p-12 backdrop-blur-xs shadow-xs mb-8 w-full">
          <CircularTestimonials
            testimonials={heroTestimonials}
            autoplay={true}
            colors={{
              name: "#1c1917",
              designation: "#b45309",
              testimony: "#44403c",
              arrowBackground: "#1c1917",
              arrowForeground: "#fef3c7",
              arrowHoverBackground: "#b45309"
            }}
          />
        </div>
      </section>

      <section className="w-full relative z-10">
        <TestimonialSection2
          testimonials={marqueeTestimonials}
          title="What Our Customers Say"
          subtitle="Read real reviews from verified customers on our handcrafted jewellery."
        />
      </section>

      <section className="relative z-10 py-12 md:py-16 px-4 sm:px-8 lg:px-12 xl:px-16 w-full">
        <FAQSection
          faqs={reviewsFaqs}
          category="Customer Reviews"
          title="Reviews & Verification FAQs"
          subtitle="Common questions about how we collect and verify customer reviews."
          containerClassName="w-full max-w-none px-0"
        />
      </section>

      <Footer />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onIncrement={(id) =>
          setCartItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, quantity: (Number(item.quantity) || 1) + 1 } : item))
          )
        }
        onDecrement={(id) =>
          setCartItems((prev) =>
            prev
              .map((item) => (item.id === id ? { ...item, quantity: (Number(item.quantity) || 1) - 1 } : item))
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

      <MasterpieceReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false);
          setReviewingPiece(null);
        }}
        piece={reviewingPiece}
        onReviewSubmitted={() => {
          loadReviews();
          setIsReviewModalOpen(false);
        }}
      />
    </div>
  );
}
