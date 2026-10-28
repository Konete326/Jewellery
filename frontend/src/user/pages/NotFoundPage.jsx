import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Gem, PhoneCall, ArrowRight } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/user/components/Footer';
import { NotFoundPage as NotFoundComponent } from '@/components/ui/not-found-page';
import { updatePageSEO } from '@/utils/seo';

export function NotFoundPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    updatePageSEO({
      title: '404 Page Not Found | Khalil & Sons Jewellers',
      description: 'The requested heirloom page could not be located in our atelier catalogue. Return to the home sanctuary or explore our bridal jewelry collection.',
      keywords: 'khalil and sons 404, page not found, bridal jewellery karachi'
    });
  }, []);

  return (
    <div className="relative min-h-screen bg-[#fcfbfa] text-[#1a1a1a] flex flex-col justify-between selection:bg-[#c5a880]/20 selection:text-[#1a1a1a]">
      <Header />

      <main className="relative z-10 pt-28 md:pt-36 pb-20 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col items-center justify-center">
        <nav className="mb-8 flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-neutral-400">
          <Link to="/" className="hover:text-neutral-900 transition-colors">
            Sanctuary
          </Link>
          <span>/</span>
          <span className="text-[#99794d]">404 Not Found</span>
        </nav>

        <div className="w-full bg-white/80 backdrop-blur-md border border-[#e8dfd5] rounded-3xl p-6 sm:p-12 shadow-sm">
          <NotFoundComponent
            title="404 — Vault Item Not Found"
            description="The heirloom or page you are seeking is unavailable."
            helperText="It may have been moved, catalogued under a new collection, or the link may be outdated. You can safely navigate back to our main salon or browse our signature collections below."
            backLabel="Return To Salon"
            homeHref="/"
            icon={
              <div className="relative mx-auto mb-2 flex h-24 w-24 items-center justify-center rounded-full bg-[#f6f2ec] border border-[#e5dacd] text-[#99794d] shadow-inner">
                <Compass className="h-12 w-12 stroke-[1.25]" />
              </div>
            }
            buttonClassName="bg-[#1a1a1a] hover:bg-[#2b2b2b] text-[#fcfbfa] font-sans font-medium px-6 py-3 rounded-full text-xs tracking-widest uppercase border border-neutral-800 shadow-md transition-all hover:scale-[1.02]"
            extraActions={
              <Link
                to="/gallery"
                className="inline-flex items-center rounded-full bg-transparent px-6 py-3 font-medium text-[#1a1a1a] text-xs uppercase tracking-widest transition-all hover:bg-[#f3ede4] border border-[#d8c8b4] shadow-xs cursor-pointer"
              >
                <Gem className="mr-2 h-4 w-4 text-[#99794d]" />
                Explore Vault
              </Link>
            }
          />

          <div className="mt-12 pt-8 border-t border-[#f0e8de] grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              to="/rates"
              className="group p-4 rounded-2xl bg-[#faf7f2] border border-[#eee4d7] hover:border-[#c5a880] transition-all hover:shadow-xs flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">Sarafa Rates</span>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-sm font-medium text-neutral-900">Today Gold & Silver Rates</p>
              <p className="text-xs text-neutral-500 mt-1 font-light">Certified daily market spot prices in Karachi.</p>
            </Link>

            <Link
              to="/reviews"
              className="group p-4 rounded-2xl bg-[#faf7f2] border border-[#eee4d7] hover:border-[#c5a880] transition-all hover:shadow-xs flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">Testimonials</span>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-sm font-medium text-neutral-900">Client Heirlooms & Reviews</p>
              <p className="text-xs text-neutral-500 mt-1 font-light">Verified appraisals & patron experiences.</p>
            </Link>

            <Link
              to="/contact"
              className="group p-4 rounded-2xl bg-[#faf7f2] border border-[#eee4d7] hover:border-[#c5a880] transition-all hover:shadow-xs flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">Concierge</span>
                <PhoneCall className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-900 transition-all" />
              </div>
              <p className="text-sm font-medium text-neutral-900">Atelier Assistance</p>
              <p className="text-xs text-neutral-500 mt-1 font-light">Murshid Sunaar Tower, Saddar, Karachi.</p>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default NotFoundPage;
