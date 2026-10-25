"use client";

import React, { useEffect, useRef, forwardRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { ArrowUp, Gem, Calendar, Phone, MapPin } from "lucide-react";
import { isAdmin } from "@/lib/auth";
import { LuxuryButton } from "@/user/components/LuxuryButton";
import { STORE_INFO } from "@/constants/storeInfo";
import { InstagramIcon, FacebookIcon, WhatsAppIcon } from "@/components/ui/social-icons";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const STYLES = `
@keyframes footer-breathe {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
  100% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.9; }
}

@keyframes footer-scroll-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@keyframes footer-heartbeat {
  0%, 100% { transform: scale(1); }
  15%, 45% { transform: scale(1.2); }
  30% { transform: scale(1); }
}

.animate-footer-breathe {
  animation: footer-breathe 8s ease-in-out infinite alternate;
}

.animate-footer-scroll-marquee {
  animation: footer-scroll-marquee 35s linear infinite;
}

.animate-footer-heartbeat {
  animation: footer-heartbeat 2s cubic-bezier(0.25, 1, 0.5, 1) infinite;
}

.footer-bg-grid {
  background-size: 60px 60px;
  background-image: 
    linear-gradient(to right, color-mix(in oklch, var(--foreground) 3%, transparent) 1px, transparent 1px),
    linear-gradient(to bottom, color-mix(in oklch, var(--foreground) 3%, transparent) 1px, transparent 1px);
  mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
}

.footer-aurora {
  background: radial-gradient(
    circle at 50% 50%, 
    rgba(212, 175, 55, 0.16) 0%, 
    rgba(193, 161, 98, 0.08) 40%, 
    transparent 70%
  );
}

.footer-giant-bg-text {
  font-size: clamp(2rem, 7.6vw, 7.5rem);
  line-height: 1;
  font-weight: 800;
  letter-spacing: 0.12em;
  color: transparent;
  -webkit-text-stroke: 1px color-mix(in oklch, var(--foreground) 8%, transparent);
  background: linear-gradient(180deg, color-mix(in oklch, var(--foreground) 12%, transparent) 0%, transparent 85%);
  -webkit-background-clip: text;
  background-clip: text;
  white-space: nowrap;
}

.footer-text-glow {
  background: linear-gradient(180deg, var(--foreground) 0%, color-mix(in oklch, var(--foreground) 40%, transparent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0px 0px 20px rgba(212, 175, 55, 0.22));
}
`;

export const MagneticButton = forwardRef(
  ({ className, children, as: Component = "button", ...props }, forwardedRef) => {
    const localRef = useRef(null);

    useEffect(() => {
      if (typeof window === "undefined") return;
      const element = localRef.current;
      if (!element) return;

      const ctx = gsap.context(() => {
        const handleMouseMove = (e) => {
          const rect = element.getBoundingClientRect();
          const h = rect.width / 2;
          const w = rect.height / 2;
          const x = e.clientX - rect.left - h;
          const y = e.clientY - rect.top - w;

          gsap.to(element, {
            x: x * 0.25,
            y: y * 0.25,
            rotationX: -y * 0.08,
            rotationY: x * 0.08,
            scale: 1.02,
            ease: "power2.out",
            duration: 0.35,
          });
        };

        const handleMouseLeave = () => {
          gsap.to(element, {
            x: 0,
            y: 0,
            rotationX: 0,
            rotationY: 0,
            scale: 1,
            ease: "elastic.out(1, 0.4)",
            duration: 0.8,
          });
        };

        element.addEventListener("mousemove", handleMouseMove);
        element.addEventListener("mouseleave", handleMouseLeave);

        return () => {
          element.removeEventListener("mousemove", handleMouseMove);
          element.removeEventListener("mouseleave", handleMouseLeave);
        };
      }, element);

      return () => ctx.revert();
    }, []);

    return (
      <Component
        ref={(node) => {
          localRef.current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) forwardedRef.current = node;
        }}
        className={cn("cursor-pointer", className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
MagneticButton.displayName = "MagneticButton";

const MarqueeItem = () => (
  <div className="flex items-center space-x-10 px-6">
    <span>Fine Gold Jewellery & Goldsmithing</span> <span className="text-amber-500">✦</span>
    <span>Certified 22K (.916) Pure Gold</span> <span className="text-amber-500">✦</span>
    <span>Bespoke Bridal Heirlooms</span> <span className="text-amber-500">✦</span>
    <span>Murshid Sunaar Tower, Saddar, Karachi</span> <span className="text-amber-500">✦</span>
    <span>Master Goldsmithing Since 1992</span> <span className="text-amber-500">✦</span>
  </div>
);

export function CinematicFooter() {
  const wrapperRef = useRef(null);
  const giantTextRef = useRef(null);
  const headingRef = useRef(null);
  const linksRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!wrapperRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        giantTextRef.current,
        { y: "6vh", scale: 0.92, opacity: 0 },
        {
          y: "0vh",
          scale: 1,
          opacity: 1,
          ease: "power1.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 80%",
            end: "bottom bottom",
            scrub: 1,
          },
        }
      );

      gsap.fromTo(
        [headingRef.current, linksRef.current],
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 40%",
            end: "bottom bottom",
            scrub: 1,
          },
        }
      );
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      
      <div
        ref={wrapperRef}
        className="relative h-screen w-full"
        style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
      >
        <footer className="fixed bottom-0 left-0 flex h-screen w-full flex-col justify-between overflow-hidden bg-background text-foreground">
          <div className="footer-aurora absolute left-1/2 top-1/2 h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 animate-footer-breathe rounded-[50%] blur-[80px] pointer-events-none z-0" />
          <div className="footer-bg-grid absolute inset-0 z-0 pointer-events-none" />

          <div
            ref={giantTextRef}
            className="footer-giant-bg-text absolute bottom-24 md:bottom-28 left-1/2 -translate-x-1/2 z-0 pointer-events-none select-none font-serif text-center w-full max-w-full px-4"
          >
            KHALIL & SONS
          </div>

          <div className="absolute top-8 md:top-12 left-0 w-full overflow-hidden border-y border-border/50 bg-background/60 backdrop-blur-md py-3.5 z-10 -rotate-1 scale-105 shadow-xl">
            <div className="flex w-max animate-footer-scroll-marquee text-xs md:text-sm font-semibold tracking-[0.25em] text-muted-foreground uppercase">
              <MarqueeItem />
              <MarqueeItem />
            </div>
          </div>

          <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 mt-16 w-full max-w-5xl mx-auto text-center">
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-amber-600 dark:text-amber-400 mb-3 block font-medium">
              Khalil & Sons • Handcrafted Fine Jewellery
            </span>
            <h2
              ref={headingRef}
              className="text-4xl md:text-7xl font-light font-headline footer-text-glow tracking-tight mb-4"
            >
              The Art of <span className="serif-italic">Handcrafted</span> Gold
            </h2>
            <p className="text-xs md:text-base text-muted-foreground max-w-lg mb-8 leading-relaxed font-light">
              Master goldsmithing since 1992 in Saddar, Karachi. Crafting certified 22K and 24K gold bridal jewelry, solitaires, and polki heirlooms.
            </p>

            <div ref={linksRef} className="flex flex-col items-center gap-5 w-full">
              <div className="flex flex-wrap justify-center gap-4 w-full">
                <LuxuryButton
                  as="a"
                  href="#collections"
                  variant="gold"
                >
                  <Gem size={14} className="text-amber-200 inline-block" />
                  Explore Collection
                </LuxuryButton>
                
                <LuxuryButton
                  as="a"
                  href="#atelier"
                  variant="gold"
                >
                  <Calendar size={14} className="text-amber-200 inline-block" />
                  Book an Appointment
                </LuxuryButton>
              </div>

              <div className="flex flex-wrap justify-center gap-2.5 md:gap-4 w-full mt-2">
                <MagneticButton
                  as="a"
                  href="#heritage"
                  className="border border-[#2d3435]/25 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xs text-[#2d3435] dark:text-neutral-200 px-5 py-2.5 text-xs tracking-widest uppercase hover:bg-[#2d3435] hover:text-white dark:hover:bg-white dark:hover:text-black transition-all font-medium cursor-pointer"
                >
                  Our Story
                </MagneticButton>
                <MagneticButton
                  as="a"
                  href="#atelier"
                  className="border border-[#2d3435]/25 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xs text-[#2d3435] dark:text-neutral-200 px-5 py-2.5 text-xs tracking-widest uppercase hover:bg-[#2d3435] hover:text-white dark:hover:bg-white dark:hover:text-black transition-all font-medium cursor-pointer"
                >
                  Karachi Boutique
                </MagneticButton>
                <MagneticButton
                  as={Link}
                  to="/auth"
                  className="border border-[#2d3435]/25 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xs text-[#2d3435] dark:text-neutral-200 px-5 py-2.5 text-xs tracking-widest uppercase hover:bg-[#2d3435] hover:text-white dark:hover:bg-white dark:hover:text-black transition-all font-medium cursor-pointer"
                >
                  Sign In
                </MagneticButton>
                {isAdmin() && (
                  <MagneticButton
                    as={Link}
                    to="/admin"
                    className="border border-amber-500/50 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-5 py-2.5 text-xs tracking-widest uppercase hover:bg-amber-600 hover:text-white transition-all font-semibold cursor-pointer"
                  >
                    Admin Portal →
                  </MagneticButton>
                )}
              </div>

              <div className="flex flex-wrap justify-center items-center gap-2.5 pt-2">
                <a
                  href={STORE_INFO.whatsapp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-mono tracking-wider text-muted-foreground hover:text-amber-700 dark:hover:text-amber-400 transition-colors px-3.5 py-1.5 rounded-full border border-border/70 hover:border-amber-500/40 bg-background/60 hover:bg-amber-500/5 shadow-xs"
                >
                  <WhatsAppIcon className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>{STORE_INFO.phone.mobile}</span>
                </a>
                <a
                  href={`tel:${STORE_INFO.phone.landline}`}
                  className="inline-flex items-center gap-2 text-xs font-mono tracking-wider text-muted-foreground hover:text-amber-700 dark:hover:text-amber-400 transition-colors px-3.5 py-1.5 rounded-full border border-border/70 hover:border-amber-500/40 bg-background/60 hover:bg-amber-500/5 shadow-xs"
                >
                  <Phone className="size-3.5 text-amber-700 dark:text-amber-400" />
                  <span>{STORE_INFO.phone.landlineFormatted}</span>
                </a>
                <a
                  href={STORE_INFO.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-mono tracking-wider text-muted-foreground hover:text-amber-700 dark:hover:text-amber-400 transition-colors px-3.5 py-1.5 rounded-full border border-border/70 hover:border-amber-500/40 bg-background/60 hover:bg-amber-500/5 shadow-xs"
                >
                  <InstagramIcon className="size-3.5 text-pink-600 dark:text-pink-400" />
                  <span>Instagram</span>
                </a>
                <a
                  href={STORE_INFO.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-mono tracking-wider text-muted-foreground hover:text-amber-700 dark:hover:text-amber-400 transition-colors px-3.5 py-1.5 rounded-full border border-border/70 hover:border-amber-500/40 bg-background/60 hover:bg-amber-500/5 shadow-xs"
                >
                  <FacebookIcon className="size-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Facebook</span>
                </a>
                <a
                  href={STORE_INFO.social.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-mono tracking-wider text-muted-foreground hover:text-amber-700 dark:hover:text-amber-400 transition-colors px-3.5 py-1.5 rounded-full border border-border/70 hover:border-amber-500/40 bg-background/60 hover:bg-amber-500/5 shadow-xs"
                >
                  <MapPin className="size-3.5 text-amber-600" />
                  <span>Saddar, Karachi (5.0 ★)</span>
                </a>
              </div>
            </div>
          </div>

          <div className="relative z-20 w-full pb-6 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-border/30 bg-background/30 backdrop-blur-xs">
            <div className="text-muted-foreground text-[10px] md:text-xs font-medium tracking-widest uppercase order-2 md:order-1 font-mono">
              © 2026 Khalil & Sons Jewellers • Saddar, Karachi. All rights reserved.
            </div>

            <div className="border border-[#2d3435]/20 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-xs px-4 py-2 flex items-center gap-2 order-1 md:order-2 cursor-default">
              <span className="text-muted-foreground text-[10px] md:text-xs font-medium uppercase tracking-widest">Crafted with</span>
              <span className="animate-footer-heartbeat text-sm text-rose-500">❤</span>
              <span className="text-muted-foreground text-[10px] md:text-xs font-medium uppercase tracking-widest">by</span>
              <span className="text-[#2d3435] dark:text-white font-semibold text-xs tracking-wider">elitedevagency</span>
            </div>

            <MagneticButton
              as="button"
              onClick={scrollToTop}
              className="size-10 border border-[#2d3435]/25 bg-white/70 dark:bg-neutral-900/70 hover:bg-[#2d3435] hover:text-white dark:hover:bg-white dark:hover:text-black flex items-center justify-center transition-all text-[#2d3435] dark:text-neutral-200 group order-3 cursor-pointer shadow-xs"
              aria-label="Scroll to top"
            >
              <ArrowUp className="size-4 transform group-hover:-translate-y-1 transition-transform duration-300" />
            </MagneticButton>
          </div>
        </footer>
      </div>
    </>
  );
}
