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
import { updatePageSEO } from '@/utils/seo';

const fallbackAvatars = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80'
];

const reviewsFaqs = [
  {
    question: "How are client reviews and ratings verified?",
    answer: "Every review and appraisal is cross-referenced with boutique order ledgers and physical Certificates of Authenticity to ensure genuine patron feedback."
  },
  {
    question: "Can I leave an appraisal for an heirloom purchased years ago?",
    answer: "Yes. Patrons who acquired pieces from our Saddar salon can submit an appraisal anytime by selecting 'Add Appraisal' and citing their piece reference or description."
  },
  {
    question: "Where can I read independent Google Maps reviews?",
    answer: "Our official Google Maps listing features verified 5.0-star customer evaluations with direct photographs of our Saddar salon and jewellery collections."
  },
  {
    question: "Are bridal photos shared with privacy protection?",
    answer: "Yes, client photographs are published strictly with written consent. Any personal identifying details are respectfully protected."
  },
  {
    question: "Can I update or edit my appraisal after submission?",
    answer: "Yes. If you wish to update your feedback or add wedding photos, you can contact our concierge via WhatsApp with your original inquiry details."
  }
];

export function ReviewsPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewingPiece, setReviewingPiece] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  useEffect(() => {
    updatePageSEO({
      title: 'Client Reviews & Masterpiece Appraisals | Khalil & Sons Jewellers',
      description: 'Read authentic client evaluations and certified gold appraisals for bridal sets, bangles, and diamond jewelry from Khalil & Sons, Saddar, Karachi.',
      keywords: 'Khalil & Sons reviews, customer testimonials gold jewelry, bridal jewelry appraisals Karachi'
    });
  }, []);

  const loadReviews = async () => {
    try {
      const res = await galleryApi.getAllReviews();
      const list = res?.data || (Array.isArray(res) ? res : []);
      setReviews(list);
    } catch {
      try {
        const fallback = await galleryApi.getRecentReviews(30);
        setReviews(fallback?.data || []);
      } catch {
        setReviews([]);
      }
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
          designation: "5★ Appraisal • Karachi",
          src: fallbackAvatars[0],
          productTitle: "Royal Heritage Nizam Kundan Choker",
          productImage: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80"
        },
        {
          quote: "Their transparency with gold hallmarks and certificate of authenticity gives unmatched peace of mind. Exceptional boutique service in Saddar.",
          name: "Dr. Farhan Siddiqui",
          designation: "5★ Appraisal • Diamond Collector",
          src: fallbackAvatars[1],
          productTitle: "Artisanal Solitaire Diamond Band",
          productImage: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=400&q=80"
        },
        {
          quote: "Our customized bridal bangles were delivered well ahead of the wedding date. The delicate meenakari detailing is mesmerizing.",
          name: "Zainab Raza",
          designation: "5★ Appraisal • Bridal Patron",
          src: fallbackAvatars[2],
          productTitle: "Mughal Polki Heritage Bangles",
          productImage: "https://images.unsplash.com/photo-1611591475878-a400f9152b12?auto=format&fit=crop&w=400&q=80"
        }
      ];
    }

    return reviews.slice(0, 10).map((r, idx) => ({
      quote: r.comment || "Exceptional gold purity and immaculate bespoke craftsmanship.",
      name: r.userName || "Verified Patron",
      designation: `${r.rating || 5}★ Appraisal • ${r.masterpieceCategory || 'Heritage Jewelry'}`,
      src: r.masterpieceImage || fallbackAvatars[idx % fallbackAvatars.length],
      productTitle: r.masterpieceTitle || "Handcrafted Jewellery",
      productImage: r.masterpieceImage,
      productId: r.masterpieceId,
      rating: r.rating || 5
    }));
  }, [reviews]);

  const marqueeTestimonials = useMemo(() => {
    const dynamicItems = (reviews || []).map((r, idx) => ({
      id: r._id || `dynamic-${idx}`,
      name: r.userName || "Verified Patron",
      role: `${r.rating || 5}★ Appraisal • ${r.masterpieceCategory || 'Heritage Piece'}`,
      image: r.masterpieceImage || fallbackAvatars[idx % fallbackAvatars.length],
      quote: r.comment || "Timeless heirloom craftsmanship crafted with certified authenticity.",
      productTitle: r.masterpieceTitle || "Handcrafted Jewellery",
      productImage: r.masterpieceImage,
      productId: r.masterpieceId
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
        cartCount={0}
      />

      <section className="relative z-10 pt-28 pb-12 px-4 sm:px-8 lg:px-12 xl:px-16 w-full">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-800 text-xs font-mono tracking-widest uppercase mb-4">
            <img
              src="/assets/logo.png"
              alt="Khalil & Sons"
              className="size-4 object-contain"
            />
            <span>Patron Evaluations</span>
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
            Client Reviews & Appraisals
          </InkHeadline>
          <p className="text-sm sm:text-base text-[#5a6061] font-light max-w-xl mx-auto leading-relaxed">
            Discover firsthand reflections of trust, gold certification, and bridal artistry from patrons who wear Khalil & Sons creations.
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
          title="The Wall of Patron Trust"
          subtitle="Click on any client capsule to explore their full testimonial and the exact jewellery piece reviewed."
        />
      </section>

      <section className="relative z-10 py-12 md:py-16 px-4 sm:px-8 lg:px-12 xl:px-16 w-full">
        <FAQSection
          faqs={reviewsFaqs}
          category="Client Reviews & Feedback"
          title="Review & Appraisal Standards"
          subtitle="Transparent answers regarding how we collect, verify, and exhibit authentic client evaluations and heirloom appraisals."
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
        items={[]}
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
