import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

function calculateGap(width) {
  const minWidth = 1024;
  const maxWidth = 1456;
  const minGap = 60;
  const maxGap = 86;
  if (width <= minWidth) return minGap;
  if (width >= maxWidth)
    return Math.max(minGap, maxGap + 0.06018 * (width - maxWidth));
  return minGap + (maxGap - minGap) * ((width - minWidth) / (maxWidth - minWidth));
}

export const CircularTestimonials = ({
  testimonials = [],
  autoplay = true,
  colors = {},
  fontSizes = {},
}) => {
  const colorName = colors.name ?? "var(--foreground, #18181b)";
  const colorDesignation = colors.designation ?? "#d97706";
  const colorTestimony = colors.testimony ?? "var(--muted-foreground, #71717a)";
  const colorArrowBg = colors.arrowBackground ?? "#1c1917";
  const colorArrowFg = colors.arrowForeground ?? "#fef3c7";
  const colorArrowHoverBg = colors.arrowHoverBackground ?? "#d97706";
  const fontSizeName = fontSizes.name ?? "1.65rem";
  const fontSizeDesignation = fontSizes.designation ?? "0.875rem";
  const fontSizeQuote = fontSizes.quote ?? "1.125rem";

  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverPrev, setHoverPrev] = useState(false);
  const [hoverNext, setHoverNext] = useState(false);
  const [containerWidth, setContainerWidth] = useState(1200);

  const imageContainerRef = useRef(null);
  const autoplayIntervalRef = useRef(null);

  const testimonialsLength = useMemo(() => testimonials.length, [testimonials]);
  const activeTestimonial = useMemo(
    () => testimonials[activeIndex] || testimonials[0] || {
      quote: '',
      name: '',
      designation: '',
      src: ''
    },
    [activeIndex, testimonials]
  );

  useEffect(() => {
    function handleResize() {
      if (imageContainerRef.current) {
        setContainerWidth(imageContainerRef.current.offsetWidth);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (autoplay && testimonialsLength > 1) {
      autoplayIntervalRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % testimonialsLength);
      }, 5000);
    }
    return () => {
      if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
    };
  }, [autoplay, testimonialsLength]);

  const handleNext = useCallback(() => {
    if (testimonialsLength <= 1) return;
    setActiveIndex((prev) => (prev + 1) % testimonialsLength);
    if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
  }, [testimonialsLength]);

  const handlePrev = useCallback(() => {
    if (testimonialsLength <= 1) return;
    setActiveIndex((prev) => (prev - 1 + testimonialsLength) % testimonialsLength);
    if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
  }, [testimonialsLength]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handlePrev, handleNext]);

  function getImageStyle(index) {
    if (testimonialsLength === 0) return {};
    const gap = calculateGap(containerWidth);
    const maxStickUp = gap * 0.8;
    const isActive = index === activeIndex;
    const isLeft = (activeIndex - 1 + testimonialsLength) % testimonialsLength === index;
    const isRight = (activeIndex + 1) % testimonialsLength === index;

    if (isActive) {
      return {
        zIndex: 3,
        opacity: 1,
        pointerEvents: "auto",
        transform: "translateX(0px) translateY(0px) scale(1) rotateY(0deg)",
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
      };
    }
    if (isLeft && testimonialsLength > 1) {
      return {
        zIndex: 2,
        opacity: 0.9,
        pointerEvents: "auto",
        transform: `translateX(-${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(15deg)`,
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
      };
    }
    if (isRight && testimonialsLength > 2) {
      return {
        zIndex: 2,
        opacity: 0.9,
        pointerEvents: "auto",
        transform: `translateX(${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(-15deg)`,
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
      };
    }
    return {
      zIndex: 1,
      opacity: 0,
      pointerEvents: "none",
      transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
    };
  }

  const quoteVariants = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -16 },
  };

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">
        <div
          className="relative w-full h-80 sm:h-96 [perspective:1000px] flex items-center justify-center"
          ref={imageContainerRef}
        >
          {testimonials.map((testimonial, index) => (
            <img
              key={`${testimonial.src}-${index}`}
              src={testimonial.src}
              alt={testimonial.name}
              className="absolute w-full h-full max-w-[340px] max-h-[380px] object-cover rounded-3xl shadow-2xl border border-amber-500/20"
              style={getImageStyle(index)}
              loading="lazy"
            />
          ))}
        </div>

        <div className="flex flex-col justify-between space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              variants={quoteVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="space-y-4"
            >
              <div>
                <h3
                  className="font-serif font-light tracking-wide break-words max-w-full leading-snug"
                  style={{ color: colorName, fontSize: fontSizeName }}
                >
                  {activeTestimonial.name}
                </h3>
                <p
                  className="font-mono text-xs uppercase tracking-widest mt-1 text-amber-600 dark:text-amber-400 break-words"
                  style={{ fontSize: fontSizeDesignation }}
                >
                  {activeTestimonial.designation}
                </p>
              </div>

              <motion.div
                className="font-light italic leading-relaxed"
                style={{ color: colorTestimony, fontSize: fontSizeQuote }}
              >
                &ldquo;
                {activeTestimonial.quote.split(" ").map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{
                      filter: "blur(8px)",
                      opacity: 0,
                      y: 4,
                    }}
                    animate={{
                      filter: "blur(0px)",
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.2,
                      ease: "easeInOut",
                      delay: 0.02 * i,
                    }}
                    className="inline-block"
                  >
                    {word}&nbsp;
                  </motion.span>
                ))}
                &rdquo;
              </motion.div>

              {activeTestimonial.productTitle && (
                <Link
                  to={activeTestimonial.productId ? `/gallery/${activeTestimonial.productId}` : '/gallery'}
                  className="inline-flex items-center gap-3 pt-2 px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 hover:border-amber-500/60 text-xs transition-all group cursor-pointer shadow-2xs hover:scale-[1.02]"
                  title={`View ${activeTestimonial.productTitle} in Atelier Gallery`}
                >
                  {activeTestimonial.productImage && (
                    <img
                      src={activeTestimonial.productImage}
                      alt={activeTestimonial.productTitle}
                      className="size-8 rounded-lg object-cover border border-amber-500/40 shrink-0"
                    />
                  )}
                  <div className="text-left">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-amber-800 dark:text-amber-300 font-semibold flex items-center gap-1">
                      <span>Appraised Piece</span>
                      <span className="transition-transform group-hover:translate-x-0.5">→</span>
                    </span>
                    <span className="font-medium text-foreground group-hover:underline">
                      {activeTestimonial.productTitle}
                    </span>
                  </div>
                </Link>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center gap-3 pt-4">
            <button
              type="button"
              className="size-11 rounded-full flex items-center justify-center transition-colors cursor-pointer border border-border"
              onClick={handlePrev}
              style={{
                backgroundColor: hoverPrev ? colorArrowHoverBg : colorArrowBg,
              }}
              onMouseEnter={() => setHoverPrev(true)}
              onMouseLeave={() => setHoverPrev(false)}
              aria-label="Previous testimonial"
            >
              <FaArrowLeft size={16} color={colorArrowFg} />
            </button>
            <button
              type="button"
              className="size-11 rounded-full flex items-center justify-center transition-colors cursor-pointer border border-border"
              onClick={handleNext}
              style={{
                backgroundColor: hoverNext ? colorArrowHoverBg : colorArrowBg,
              }}
              onMouseEnter={() => setHoverNext(true)}
              onMouseLeave={() => setHoverNext(false)}
              aria-label="Next testimonial"
            >
              <FaArrowRight size={16} color={colorArrowFg} />
            </button>
            <span className="text-xs text-muted-foreground font-mono ml-3">
              {activeIndex + 1} / {testimonialsLength}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CircularTestimonials;
