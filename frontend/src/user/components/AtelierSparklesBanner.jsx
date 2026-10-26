import React from "react";
import { SparklesCore } from "@/components/ui/sparkles";

export function AtelierSparklesBanner() {
  return (
    <div className="w-full bg-black relative overflow-hidden py-14 sm:py-20 my-10 sm:my-14 rounded-3xl sm:rounded-[2.5rem] border border-neutral-800 shadow-2xl flex flex-col items-center justify-center text-center px-4">
      <div className="relative z-20 mb-3 flex items-center justify-center">
        <div className="size-16 sm:size-20 rounded-2xl bg-neutral-900/90 border border-amber-500/30 p-2.5 shadow-[0_0_35px_rgba(245,208,97,0.2)] flex items-center justify-center">
          <img
            src="/assets/logo.png"
            alt="Khalil & Sons Logo"
            className="size-full object-contain filter brightness-110"
          />
        </div>
      </div>

      <h2 className="relative z-20 font-serif text-3xl sm:text-5xl md:text-6xl font-light tracking-[0.2em] text-white uppercase drop-shadow-md">
        Khalil & Sons
      </h2>

      <p className="relative z-20 text-[11px] sm:text-xs font-mono uppercase tracking-[0.3em] text-amber-400/90 mt-2 font-medium">
        Master Goldsmiths & Heritage Bridal Atelier • Est. 1992
      </p>

      <div className="w-[28rem] sm:w-[40rem] max-w-full h-36 relative mx-auto mt-2">
        <div className="absolute inset-x-12 top-0 bg-linear-to-r from-transparent via-amber-400 to-transparent h-[2px] w-3/4 blur-xs" />
        <div className="absolute inset-x-12 top-0 bg-linear-to-r from-transparent via-amber-300 to-transparent h-px w-3/4" />
        <div className="absolute inset-x-28 top-0 bg-linear-to-r from-transparent via-white to-transparent h-[4px] w-1/3 blur-xs" />
        <div className="absolute inset-x-28 top-0 bg-linear-to-r from-transparent via-white to-transparent h-px w-1/3" />

        <SparklesCore
          id="atelier-about-sparkles-banner"
          background="transparent"
          minSize={0.4}
          maxSize={1.4}
          particleDensity={800}
          className="w-full h-full"
          particleColor="#F5D061"
          speed={1}
        />

        <div className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(350px_160px_at_top,transparent_20%,white)] pointer-events-none" />
      </div>

      <p className="relative z-20 text-xs sm:text-sm text-neutral-400 font-light max-w-xl mx-auto -mt-10 px-4 leading-relaxed">
        Handcrafting 22K certified hallmarked gold, uncut Polki diamonds, and timeless wedding heirlooms in Murshid Sunaar Tower, Saddar, Karachi.
      </p>
    </div>
  );
}
