import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { CardGoldEffect } from "./CardGoldEffect";

export const DEFAULT_SKIPER_IMAGES = [
  {
    _id: "default-1",
    src: "/assets/products/choker-ruby-01.jpg",
    imageUrl: "/assets/products/choker-ruby-01.jpg",
    alt: "The Florentine Ruby Choker",
    title: "The Florentine Ruby Choker",
    description: "22K handmade gold necklace with natural red rubies"
  },
  {
    _id: "default-2",
    src: "/assets/products/kada-polki-01.jpg",
    imageUrl: "/assets/products/kada-polki-01.jpg",
    alt: "Royal Polki Kada Armlet",
    title: "Royal Polki Kada Armlet",
    description: "Uncut diamonds set in 22K solid gold with detailed enamel work"
  },
  {
    _id: "default-3",
    src: "/assets/products/guluband-01.jpg",
    imageUrl: "/assets/products/guluband-01.jpg",
    alt: "Archival Aurelian Guluband",
    title: "Archival Aurelian Guluband",
    description: "Handmade 22K solid gold collar necklace with delicate gold wirework"
  },
  {
    _id: "default-4",
    src: "/assets/products/jhumka-01.jpg",
    imageUrl: "/assets/products/jhumka-01.jpg",
    alt: "Imperial Florentine Jhumkas",
    title: "Imperial Florentine Jhumkas",
    description: "22K gold drop earrings with delicate pearls and carved designs"
  },
  {
    _id: "default-5",
    src: "/assets/products/ring-polki-01.jpg",
    imageUrl: "/assets/products/ring-polki-01.jpg",
    alt: "Medici Uncut Polki Solitaire",
    title: "Medici Uncut Polki Solitaire",
    description: "Natural uncut diamond ring set in textured 22K yellow gold"
  },
  {
    _id: "default-6",
    src: "/assets/products/kada-plain-01.jpg",
    imageUrl: "/assets/products/kada-plain-01.jpg",
    alt: "Solid Bullion Handcrafted Bangle",
    title: "Solid Bullion Handcrafted Bangle",
    description: "Handmade solid gold bangle with a smooth satin finish"
  },
  {
    _id: "default-7",
    src: "/assets/products/choker-ruby-02.jpg",
    imageUrl: "/assets/products/choker-ruby-02.jpg",
    alt: "Renaissance Ruby Suite Choker",
    title: "Renaissance Ruby Suite Choker",
    description: "Gold choker with hand-linked chains and red rubies"
  }
];

export function Skiper54({
  images,
  className,
  autoplay = true,
  loop = true,
  showNavigation = true,
  showPagination = true
}) {
  const navigate = useNavigate();
  const [api, setApi] = useState(null);
  const [current, setCurrent] = useState(0);

  const displayImages = images && images.length > 0 ? images : DEFAULT_SKIPER_IMAGES;

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());
    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <div className={cn("relative w-full max-w-full overflow-hidden pb-12 select-none", className)}>
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          loop,
          slidesToScroll: 1,
          align: "center"
        }}
        plugins={
          autoplay && displayImages.length > 1
            ? [
                Autoplay({
                  delay: 3500,
                  stopOnInteraction: false,
                  stopOnMouseEnter: true,
                }),
              ]
            : []
        }
      >
        <CarouselContent className="flex h-[520px] md:h-[580px] lg:h-[620px] w-full py-4 items-center">
          {displayImages.map((item, index) => {
            const src = item.imageUrl || item.src;
            const title = item.title || "Masterpiece";
            const alt = item.alt || item.title || "Jewellery Exhibit";
            const description = item.description || "";
            const targetId = item._id || item.id || `default-${index + 1}`;

            return (
              <CarouselItem
                key={item._id || item.id || index}
                className="relative flex h-[460px] md:h-[520px] lg:h-[560px] w-full basis-[85%] sm:basis-[52%] md:basis-[36%] lg:basis-[28%] xl:basis-[24%] items-center justify-center px-3 shrink-0"
              >
                <motion.div
                  initial={false}
                  animate={{
                    clipPath:
                      current !== index
                        ? "inset(10% 0 10% 0 round 1.5rem)"
                        : "inset(0 0 0 0 round 1.5rem)",
                    scale: current === index ? 1.03 : 0.94,
                    opacity: current === index ? 1 : 0.72
                  }}
                  transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
                  className="h-full w-full overflow-hidden rounded-3xl shadow-xl cursor-pointer"
                  onClick={() => {
                    if (current === index) {
                      navigate(`/gallery/${targetId}`);
                    } else {
                      api?.scrollTo(index);
                    }
                  }}
                >
                  <div className={cn(
                    "relative h-full w-full bg-neutral-900 border overflow-hidden rounded-3xl group/card transition-all duration-500",
                    current === index ? "border-amber-500/50 shadow-[0_0_30px_rgba(217,119,6,0.25)]" : "border-neutral-800"
                  )}>
                    <img
                      src={src}
                      alt={alt}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover/card:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
                    <CardGoldEffect active={current === index} />

                    <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 z-10 flex flex-col justify-end text-left pointer-events-auto">
                      {(item.averageRating >= 4 || item.rating >= 4) && (
                        <div className="inline-flex items-center gap-1 mb-2 px-2.5 py-0.5 w-fit rounded-full bg-black/60 border border-amber-500/40 text-amber-300 text-[11px] font-mono backdrop-blur-xs">
                          <Star className="size-3 fill-amber-400 text-amber-400" />
                          <span>{(item.averageRating || item.rating).toFixed(1)}</span>
                        </div>
                      )}

                      <h3 className="font-headline text-lg sm:text-xl text-white font-medium tracking-wide line-clamp-1 group-hover/card:text-amber-300 transition-colors">
                        {title}
                      </h3>

                      {description && (
                        <p className="text-xs text-white/80 font-light mt-1.5 line-clamp-2 leading-relaxed">
                          {description}
                        </p>
                      )}

                      <div className="mt-3.5 flex items-center justify-between pt-2.5 border-t border-white/20 text-[11px] uppercase tracking-wider font-mono text-amber-300 group-hover/card:text-amber-200">
                        <span>View Details</span>
                        <span>&rarr;</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        {showNavigation && (
          <div className="flex w-full items-center justify-center gap-4 mt-6 pt-2">
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => api?.scrollPrev()}
              className="size-11 rounded-full border border-neutral-300 bg-white/95 backdrop-blur-xs flex items-center justify-center text-neutral-800 hover:bg-neutral-900 hover:text-white transition-all shadow-md cursor-pointer active:scale-95"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => api?.scrollNext()}
              className="size-11 rounded-full border border-neutral-300 bg-white/95 backdrop-blur-xs flex items-center justify-center text-neutral-800 hover:bg-neutral-900 hover:text-white transition-all shadow-md cursor-pointer active:scale-95"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        )}

        {showPagination && (
          <div className="flex w-full items-center justify-center mt-4">
            <div className="flex items-center justify-center gap-1.5">
              {displayImages.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => api?.scrollTo(index)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300 cursor-pointer",
                    current === index
                      ? "w-7 bg-amber-600"
                      : "w-1.5 bg-neutral-300 hover:bg-neutral-400"
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </Carousel>
    </div>
  );
}
