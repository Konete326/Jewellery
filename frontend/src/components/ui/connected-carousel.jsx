import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { PatronMonogram } from "@/components/ui/PatronMonogram";

const VISIBLE_OFFSETS = [-3, -2, -1, 0, 1, 2, 3];

const TRANSITION_SPRING = {
  type: "spring",
  stiffness: 240,
  damping: 28,
  mass: 0.7,
};

function CarouselImage({ src, alt, className, compact = false }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (hasError || !src) {
    return (
      <div className={cn(
        "size-full flex flex-col items-center justify-center bg-gradient-to-br from-amber-500/10 via-muted to-amber-500/5 text-center p-3 select-none",
        className
      )}>
        <span className={cn(
          "font-serif italic font-semibold text-amber-900/90 dark:text-amber-300 tracking-wider",
          compact ? "text-xs" : "text-base sm:text-lg"
        )}>
          AU
        </span>
        <span className={cn(
          "font-mono uppercase tracking-[0.2em] text-muted-foreground/80",
          compact ? "text-[7px]" : "text-[9px] mt-0.5"
        )}>
          Atelier Seal
        </span>
      </div>
    );
  }

  return (
    <img
      alt={alt}
      src={src}
      draggable={false}
      onError={() => setHasError(true)}
      className={cn("size-full object-cover", className)}
    />
  );
}

export function CalendlyCarousel({
  items = [],
  autoPlayInterval = 6000,
  pauseOnHover = false,
  className,
  onAction,
  ...props
}) {
  const containerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const lastTimeRef = useRef(null);
  const elapsedRef = useRef(0);

  const [page, setPage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [tier, setTier] = useState("desktop");
  const [viewportWidth, setViewportWidth] = useState(1200);

  const total = items.length;
  const activeIndex = total > 0 ? ((page % total) + total) % total : 0;

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setViewportWidth(width);
      if (width < 768) {
        setTier("mobile");
      } else if (width < 1120) {
        setTier("tablet");
      } else {
        setTier("desktop");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (total <= 1) return;
    if (pauseOnHover && isHovered) {
      lastTimeRef.current = null;
      return;
    }

    const step = (timestamp) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = timestamp;
      }

      const delta = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;
      elapsedRef.current += delta;

      if (elapsedRef.current >= autoPlayInterval) {
        elapsedRef.current = 0;
        lastTimeRef.current = null;
        setProgress(0);
        setPage((curr) => curr + 1);
        return;
      }

      setProgress(Math.min((elapsedRef.current / autoPlayInterval) * 100, 100));
      animationFrameRef.current = requestAnimationFrame(step);
    };

    animationFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      lastTimeRef.current = null;
    };
  }, [page, pauseOnHover, isHovered, autoPlayInterval, total]);

  const handlePrev = useCallback(() => {
    elapsedRef.current = 0;
    lastTimeRef.current = null;
    setProgress(0);
    setPage((curr) => curr - 1);
  }, []);

  const handleNext = useCallback(() => {
    elapsedRef.current = 0;
    lastTimeRef.current = null;
    setProgress(0);
    setPage((curr) => curr + 1);
  }, []);

  const handleSelectTab = (event) => {
    const indexStr = event.currentTarget.dataset.index;
    if (indexStr !== undefined && total > 0) {
      const targetIdx = Number.parseInt(indexStr, 10);
      let diff = targetIdx - activeIndex;

      if (diff > total / 2) {
        diff -= total;
      } else if (diff < -total / 2) {
        diff += total;
      }

      elapsedRef.current = 0;
      lastTimeRef.current = null;
      setProgress(0);
      setPage((curr) => curr + diff);
    }
  };

  const handleSelectCard = (event) => {
    const offsetStr = event.currentTarget.dataset.offset;
    if (offsetStr !== undefined) {
      const offset = Number.parseInt(offsetStr, 10);
      if (offset !== 0) {
        elapsedRef.current = 0;
        lastTimeRef.current = null;
        setProgress(0);
        setPage((curr) => curr + offset);
      }
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowLeft") {
      handlePrev();
    } else if (event.key === "ArrowRight") {
      handleNext();
    }
  };

  if (!items || items.length === 0) {
    return null;
  }

  const activeDimensions = {
    desktop: { width: 720, height: 280 },
    tablet: { width: 560, height: 270 },
    mobile: { width: Math.min(340, viewportWidth - 40), height: 340 },
  }[tier];

  return (
    <div
      ref={containerRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Customer Appraisals"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative w-full max-w-[1100px] mx-auto flex flex-col items-center select-none outline-none overflow-hidden",
        className
      )}
      {...props}
    >
      <div
        id="carousel-view-panel"
        role="tabpanel"
        aria-live="polite"
        className="relative w-full flex items-center justify-center"
        style={{ height: activeDimensions.height }}
      >
        {VISIBLE_OFFSETS.map((offset) => {
          const virtualIndex = page + offset;
          const itemIndex = ((virtualIndex % total) + total) % total;
          const item = items[itemIndex];
          const isActive = offset === 0;

          if (!item) return null;

          const getVariant = () => {
            if (tier === "mobile") {
              const activeW = activeDimensions.width;
              const activeH = activeDimensions.height;
              const gap = 12;
              const peekW = 40;
              const peekH = 260;

              if (offset === 0) {
                return {
                  x: -activeW / 2,
                  y: -activeH / 2,
                  width: activeW,
                  height: activeH,
                  opacity: 1,
                  zIndex: 0,
                  pointerEvents: "auto",
                };
              }

              if (offset === -1) {
                return {
                  x: -activeW / 2 - gap - peekW,
                  y: -peekH / 2,
                  width: peekW,
                  height: peekH,
                  opacity: 0.6,
                  zIndex: 10,
                  pointerEvents: "auto",
                };
              }

              if (offset === 1) {
                return {
                  x: activeW / 2 + gap,
                  y: -peekH / 2,
                  width: peekW,
                  height: peekH,
                  opacity: 0.6,
                  zIndex: 10,
                  pointerEvents: "auto",
                };
              }

              return {
                x: offset < 0 ? -activeW / 2 - 160 : activeW / 2 + 160,
                y: -peekH / 2,
                width: peekW,
                height: peekH,
                opacity: 0,
                zIndex: 0,
                pointerEvents: "none",
              };
            }

            if (tier === "tablet") {
              const activeW = 560;
              const activeH = 270;
              const gap = 16;
              const sideW = 80;
              const sideH = 210;

              if (offset === 0) {
                return {
                  x: -activeW / 2,
                  y: -activeH / 2,
                  width: activeW,
                  height: activeH,
                  opacity: 1,
                  zIndex: 0,
                  pointerEvents: "auto",
                };
              }

              if (offset === -1) {
                return {
                  x: -activeW / 2 - gap - sideW,
                  y: -sideH / 2,
                  width: sideW,
                  height: sideH,
                  opacity: 0.7,
                  zIndex: 10,
                  pointerEvents: "auto",
                };
              }

              if (offset === 1) {
                return {
                  x: activeW / 2 + gap,
                  y: -sideH / 2,
                  width: sideW,
                  height: sideH,
                  opacity: 0.7,
                  zIndex: 10,
                  pointerEvents: "auto",
                };
              }

              return {
                x: offset < 0 ? -activeW / 2 - 180 : activeW / 2 + 180,
                y: -sideH / 2,
                width: 60,
                height: 150,
                opacity: 0,
                zIndex: 0,
                pointerEvents: "none",
              };
            }

            switch (offset) {
              case 0:
                return {
                  x: -360,
                  y: -140,
                  width: 720,
                  height: 280,
                  opacity: 1,
                  zIndex: 0,
                  pointerEvents: "auto",
                };
              case -1:
                return {
                  x: -470,
                  y: -105,
                  width: 90,
                  height: 210,
                  opacity: 0.7,
                  zIndex: 10,
                  pointerEvents: "auto",
                };
              case 1:
                return {
                  x: 380,
                  y: -105,
                  width: 90,
                  height: 210,
                  opacity: 0.7,
                  zIndex: 10,
                  pointerEvents: "auto",
                };
              case -2:
                return {
                  x: -545,
                  y: -75,
                  width: 60,
                  height: 150,
                  opacity: 0.4,
                  zIndex: 5,
                  pointerEvents: "auto",
                };
              case 2:
                return {
                  x: 485,
                  y: -75,
                  width: 60,
                  height: 150,
                  opacity: 0.4,
                  zIndex: 5,
                  pointerEvents: "auto",
                };
              default:
                return {
                  x: offset < 0 ? -700 : 700,
                  y: -75,
                  width: 60,
                  height: 150,
                  opacity: 0,
                  zIndex: 0,
                  pointerEvents: "none",
                };
            }
          };

          return (
            <motion.div
              key={virtualIndex}
              data-offset={offset}
              onClick={handleSelectCard}
              initial={false}
              animate={getVariant()}
              transition={TRANSITION_SPRING}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                willChange: "transform",
              }}
              className={cn(
                "rounded-2xl bg-card text-card-foreground border border-border shadow-xs overflow-visible",
                !isActive && "cursor-pointer"
              )}
            >
              <div
                className="size-full overflow-hidden relative"
                style={{ borderRadius: "inherit" }}
              >
                <motion.div
                  initial={false}
                  animate={{ opacity: isActive ? 0 : 1 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className={cn(
                    "absolute inset-0 p-1.5",
                    isActive && "pointer-events-none"
                  )}
                >
                  <div className="size-full rounded-xl overflow-hidden bg-muted relative">
                    <CarouselImage
                      alt={item.masterpieceTitle || item.userName}
                      src={item.masterpieceImage || item.defaultImage || '/assets/products/choker-ruby-01.jpg'}
                      compact
                    />
                  </div>
                </motion.div>

                <div
                  className="absolute"
                  style={{
                    left: "50%",
                    top: "50%",
                    width: activeDimensions.width,
                    height: activeDimensions.height,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <motion.div
                    initial={false}
                    animate={{
                      opacity: isActive ? 1 : 0,
                      x: isActive ? 0 : offset < 0 ? -750 : 750,
                    }}
                    transition={TRANSITION_SPRING}
                    className={cn(
                      "size-full flex flex-col md:flex-row p-4 sm:p-5 gap-3 sm:gap-4",
                      !isActive && "pointer-events-none"
                    )}
                  >
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5 gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={cn(
                                  "size-3.5",
                                  s <= (item.rating || 5)
                                    ? "fill-amber-500 text-amber-500"
                                    : "text-muted-foreground/25"
                                )}
                              />
                            ))}
                            <span className="text-xs font-mono font-semibold text-foreground ml-1.5">
                              {Number(item.rating || 5).toFixed(1)} / 5.0
                            </span>
                          </div>
                          {item.date && (
                            <span className="text-[10px] font-mono text-muted-foreground">
                              {item.date}
                            </span>
                          )}
                        </div>

                        <div className="pt-0.5">
                          {item.masterpieceCategory && (
                            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-800 dark:text-amber-400 block font-medium">
                              {item.masterpieceCategory}
                            </span>
                          )}
                          <h3
                            title={item.masterpieceTitle}
                            className="text-base sm:text-lg font-serif font-medium tracking-tight text-foreground truncate"
                          >
                            {item.masterpieceTitle || 'Appraisal'}
                          </h3>
                        </div>
                      </div>

                      <div className="my-auto py-0.5">
                        <p className="font-serif italic text-xs sm:text-sm text-foreground/85 leading-relaxed line-clamp-3">
                          &ldquo;{item.comment}&rdquo;
                        </p>
                      </div>

                      <div className="pt-2 border-t border-border/60 flex flex-col gap-1.5">
                        <div className="flex items-center justify-between gap-2 min-w-0">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <PatronMonogram name={item.userName} size="size-7" />
                            <div className="min-w-0">
                              <span className="text-xs font-semibold text-foreground block truncate">
                                {item.userName}
                              </span>
                              <span className="text-[10px] font-mono text-muted-foreground block truncate">
                                {item.userEmail || 'In-Store Patron'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {item.rawReview && onAction && (
                          <div className="flex items-center gap-2 pt-0.5">
                            {onAction(item.rawReview)}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="relative shrink-0 overflow-hidden rounded-xl bg-muted w-full md:w-[210px] lg:w-[230px] h-[120px] md:h-full border border-border/70">
                      <CarouselImage
                        alt={item.masterpieceTitle || item.userName}
                        src={item.masterpieceImage || item.defaultImage || '/assets/products/choker-ruby-01.jpg'}
                      />
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {total > 1 && (
        <div
          role="tablist"
          aria-label="Appraisal views"
          className="flex items-center gap-1.5 mt-3"
        >
          {items.map((item, idx) => {
            const isSelected = idx === activeIndex;

            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                data-index={idx}
                id={`carousel-tab-${idx}`}
                aria-controls="carousel-view-panel"
                onClick={handleSelectTab}
                aria-selected={isSelected}
                aria-label={`Appraisal ${idx + 1}`}
                tabIndex={isSelected ? 0 : -1}
                className={cn(
                  "h-[4px] rounded-full overflow-hidden border-0 p-0 cursor-pointer transition-[width] duration-300 ease-out outline-none focus-visible:ring-1 focus-visible:ring-ring",
                  isSelected
                    ? "w-[44px] bg-muted"
                    : "w-[8px] bg-muted hover:bg-muted-foreground/30"
                )}
              >
                {isSelected && (
                  <div
                    className="h-full rounded-full bg-foreground"
                    style={{
                      transformOrigin: "0% 50%",
                      transform: `scaleX(${progress / 100})`,
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CalendlyCarousel;
