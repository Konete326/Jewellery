import React, { useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export const DEFAULT_SKIPER_IMAGES = [
  {
    _id: "default-1",
    src: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    alt: "The Aurelian Signet",
    title: "The Aurelian Signet",
    description: "18K Hand-hammered Florentine gold with raw uncut diamond centerpiece"
  },
  {
    _id: "default-2",
    src: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80",
    imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80",
    alt: "Venetian Mist Choker",
    title: "Venetian Mist Choker",
    description: "South Sea cultured pearls interwoven with hand-pulled Venetian gold filigree"
  },
  {
    _id: "default-3",
    src: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
    imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
    alt: "Etruscan Serpent Armlet",
    title: "Etruscan Serpent Armlet",
    description: "Intricately chased 22K solid yellow gold with Burmese emerald eyes"
  },
  {
    _id: "default-4",
    src: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
    imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
    alt: "Renaissance Solstice Tiara",
    title: "Renaissance Solstice Tiara",
    description: "Platinum & 18K gold archival commission forged with Renaissance chasing techniques"
  },
  {
    _id: "default-5",
    src: "https://images.unsplash.com/photo-1611591475870-07bfcfc9f280?auto=format&fit=crop&w=800&q=80",
    imageUrl: "https://images.unsplash.com/photo-1611591475870-07bfcfc9f280?auto=format&fit=crop&w=800&q=80",
    alt: "Medici Emerald Solitaire",
    title: "Medici Emerald Solitaire",
    description: "Unheated Colombian emerald surrounded by baguette-cut diamonds"
  },
  {
    _id: "default-6",
    src: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80",
    imageUrl: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80",
    alt: "Celestial Tourbillon Horizon",
    title: "Celestial Tourbillon Horizon",
    description: "Hand-engraved sapphire dial with flying tourbillon in rose gold"
  },
  {
    _id: "default-7",
    src: "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=800&q=80",
    imageUrl: "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=800&q=80",
    alt: "Imperial Royal Brooch",
    title: "Imperial Royal Brooch",
    description: "Rare pigeon-blood Burmese ruby cluster mounted in platinum prongs"
  },
  {
    _id: "default-8",
    src: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=800&q=80",
    imageUrl: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=800&q=80",
    alt: "Florentine Aureate Cuff",
    title: "Florentine Aureate Cuff",
    description: "Chiseled 24K solid bullion cuff featuring Renaissance scrollwork"
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
        <CarouselContent className="flex h-[460px] md:h-[520px] w-full py-4 items-center">
          {displayImages.map((item, index) => {
            const src = item.imageUrl || item.src;
            const title = item.title || "Masterpiece";
            const alt = item.alt || item.title || "Jewellery Exhibit";
            const description = item.description || "";

            return (
              <CarouselItem
                key={item._id || item.id || index}
                className="relative flex h-[380px] md:h-[420px] w-full basis-[75%] sm:basis-[48%] md:basis-[32%] lg:basis-[26%] xl:basis-[22%] items-center justify-center px-2.5 shrink-0"
              >
                <motion.div
                  initial={false}
                  animate={{
                    clipPath:
                      current !== index
                        ? "inset(14% 0 14% 0 round 1.5rem)"
                        : "inset(0 0 0 0 round 1.5rem)",
                    scale: current === index ? 1.04 : 0.94,
                    opacity: current === index ? 1 : 0.7
                  }}
                  transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
                  className="h-full w-full overflow-hidden rounded-3xl shadow-xl cursor-pointer"
                  onClick={() => api?.scrollTo(index)}
                >
                  <div className="relative h-full w-full bg-neutral-900 border border-amber-500/20 overflow-hidden rounded-3xl">
                    <img
                      src={src}
                      alt={alt}
                      className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />
                  </div>
                </motion.div>

                <AnimatePresence mode="wait">
                  {current === index && (
                    <motion.div
                      initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
                      transition={{ duration: 0.35 }}
                      className="absolute bottom-1 left-0 right-0 flex flex-col items-center justify-center p-2 text-center translate-y-full pointer-events-none z-20"
                    >
                      <span className="font-headline text-lg md:text-xl text-[#2d3435] font-normal tracking-wide">
                        {title}
                      </span>
                      {description && (
                        <span className="text-[11px] md:text-xs text-[#5a6061] max-w-xs font-light mt-0.5 line-clamp-1">
                          {description}
                        </span>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        {showNavigation && (
          <div className="flex w-full items-center justify-center gap-4 mt-10 pt-4">
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
