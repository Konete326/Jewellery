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

export function Skiper54({
  images = [],
  className,
  autoplay = true,
  loop = true,
  showNavigation = true,
  showPagination = true
}) {
  const [api, setApi] = useState(null);
  const [current, setCurrent] = useState(0);

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

  if (!images || images.length === 0) {
    return (
      <div className="flex h-[420px] w-full items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-neutral-50/50">
        <p className="font-headline text-lg text-neutral-400 italic">No gallery pieces showcased yet.</p>
      </div>
    );
  }

  const effectiveLoop = loop && images.length > 2;

  return (
    <div className={cn("relative w-full max-w-full overflow-hidden pb-16", className)}>
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          loop: effectiveLoop,
          slidesToScroll: 1,
          align: "center"
        }}
        plugins={
          autoplay && images.length > 1
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
        <CarouselContent className="flex h-[440px] md:h-[500px] w-full py-4">
          {images.map((item, index) => {
            const src = item.imageUrl || item.src;
            const title = item.title || "Masterpiece";
            const alt = item.title || item.alt || "Jewellery Exhibit";
            const description = item.description || "";

            return (
              <CarouselItem
                key={item._id || item.id || index}
                className="relative flex h-[82%] w-full basis-[75%] items-center justify-center sm:basis-[48%] md:basis-[34%] lg:basis-[28%] xl:basis-[24%] px-3"
              >
                <motion.div
                  initial={false}
                  animate={{
                    clipPath:
                      current !== index
                        ? "inset(14% 0 14% 0 round 1.75rem)"
                        : "inset(0 0 0 0 round 1.75rem)",
                    scale: current === index ? 1.02 : 0.94,
                    opacity: current === index ? 1 : 0.65
                  }}
                  transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
                  className="h-full w-full overflow-hidden rounded-3xl shadow-lg cursor-pointer"
                  onClick={() => api?.scrollTo(index)}
                >
                  <div className="relative h-full w-full bg-neutral-900 border border-amber-500/20 overflow-hidden">
                    <img
                      src={src}
                      alt={alt}
                      className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  </div>
                </motion.div>

                <AnimatePresence mode="wait">
                  {current === index && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
                      transition={{ duration: 0.35 }}
                      className="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-center p-2 text-center translate-y-full pointer-events-none"
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

        {showNavigation && images.length > 1 && (
          <div className="flex w-full items-center justify-center gap-4 mt-8 pt-4">
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => api?.scrollPrev()}
              className="size-10 rounded-full border border-neutral-300 bg-white/80 backdrop-blur-xs flex items-center justify-center text-neutral-800 hover:bg-neutral-900 hover:text-white transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => api?.scrollNext()}
              className="size-10 rounded-full border border-neutral-300 bg-white/80 backdrop-blur-xs flex items-center justify-center text-neutral-800 hover:bg-neutral-900 hover:text-white transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        )}

        {showPagination && images.length > 1 && (
          <div className="flex w-full items-center justify-center mt-4">
            <div className="flex items-center justify-center gap-1.5">
              {images.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => api?.scrollTo(index)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300 cursor-pointer",
                    current === index
                      ? "w-6 bg-amber-600"
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
