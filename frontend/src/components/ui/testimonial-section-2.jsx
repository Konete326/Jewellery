import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const defaultTestimonials = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "Bridal Collector",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    quote: "Khalil & Sons transformed our wedding jewelry vision into an heirloom masterpiece.",
    productTitle: "Royal Kundan Choker",
    productImage: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "2",
    name: "Marcus Rodriguez",
    role: "Fine Art Patron",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    quote: "The certified purity and timeless gold detailing is unmatched anywhere in Saddar.",
    productTitle: "Handcrafted 22K Bangle",
    productImage: "https://images.unsplash.com/photo-1611591475878-a400f9152b12?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "3",
    name: "Olivia Koe",
    role: "Diamond Connoisseur",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    quote: "Exquisite stone setting and immaculate finish. A genuine family treasure.",
    productTitle: "Artisanal Solitaire Band",
    productImage: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "4",
    name: "David Kim",
    role: "Heirloom Collector",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    quote: "The personalized boutique consultation made selecting our bridal set effortless.",
    productTitle: "Mughal Polki Jhumkas",
    productImage: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "5",
    name: "Amara Okonkwo",
    role: "Wedding Curator",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
    quote: "Authentic hallmarks and master goldsmith precision in every single millimeter.",
    productTitle: "Antique Filigree Mala",
    productImage: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "6",
    name: "James Mitchell",
    role: "Gemstone Enthusiast",
    image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80",
    quote: "Reliable, transparent, and historic craftsmanship that upholds its 50-year heritage.",
    productTitle: "Ruby Studded Pendant",
    productImage: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "7",
    name: "Elena Rodriguez",
    role: "Bridal Stylist",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    quote: "It looks luxurious and feels regal. Our guests were mesmerized by the bride's set.",
    productTitle: "Grand Bridal Maharani Set",
    productImage: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "8",
    name: "Michael Chang",
    role: "Patron",
    image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80",
    quote: "The honesty regarding gold karat weight and stone deducts earned our lifelong trust.",
    productTitle: "Classic Gold Kada",
    productImage: "https://images.unsplash.com/photo-1611591475878-a400f9152b12?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "9",
    name: "Sofia Weber",
    role: "Jewelry Connoisseur",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    quote: "From initial design sketches to the final polish, the atelier delivered perfection.",
    productTitle: "Emerald Cascade Ring",
    productImage: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=400&q=80"
  }
];

export function TestimonialSection2({
  testimonials = defaultTestimonials,
  title = "Words From Our Esteemed Patrons",
  subtitle = "Reflections of excellence from families who cherish Khalil & Sons handcrafted heirlooms."
} = {}) {
  const [selected, setSelected] = useState(null);

  const list = testimonials && testimonials.length >= 6 ? testimonials : defaultTestimonials;
  const third = Math.ceil(list.length / 3);
  const row1 = list.slice(0, third);
  const row2 = list.slice(third, third * 2);
  const row3 = list.slice(third * 2);

  return (
    <div className="relative w-full py-16 overflow-hidden [--color-primary:var(--color-primary,#d97706)] bg-card text-foreground border-y border-border">
      <div className="max-w-7xl mx-auto px-4 text-center mb-10">
        <h2 className="text-2xl md:text-4xl font-serif font-light tracking-tight text-foreground">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs md:text-sm text-muted-foreground mt-2 max-w-xl mx-auto font-light leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      <div className="relative w-full">
        <div className="absolute inset-0 z-0 opacity-5 bg-[repeating-linear-gradient(315deg,currentColor_0,currentColor_1px,transparent_0,transparent_50%)] bg-[length:10px_10px] pointer-events-none" />

        <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-48 bg-gradient-to-r from-card to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-48 bg-gradient-to-l from-card to-transparent z-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-6 py-6 items-center justify-center overflow-hidden">
          {[row1, row2, row3].map((row, rowIndex) => (
            <motion.div
              key={rowIndex}
              className="flex items-center gap-5 min-w-max"
              animate={{
                x: rowIndex % 2 === 0 ? ["0%", "-25%"] : ["-25%", "0%"],
              }}
              transition={{
                duration: 45,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {[...row, ...row, ...row, ...row].map((testimonial, i) => (
                <Capsule
                  key={`${testimonial.id}-${i}`}
                  testimonial={testimonial}
                  onClick={() => setSelected(testimonial)}
                />
              ))}
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8, transition: { duration: 0.15 } }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative w-full max-w-lg bg-neutral-950 text-white p-6 sm:p-10 rounded-3xl border border-amber-500/30 shadow-2xl z-50"
            >
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white transition-colors cursor-pointer rounded-full hover:bg-white/10"
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>

              <div className="flex flex-col items-center text-center w-full min-w-0">
                <p className="text-lg sm:text-xl font-serif font-light italic leading-relaxed mb-6 text-neutral-200 break-words max-w-full">
                  &ldquo;{selected.quote}&rdquo;
                </p>

                <div className="flex items-center gap-4 mb-4 max-w-full min-w-0">
                  <div className="relative size-12 rounded-full overflow-hidden border-2 border-amber-500/50 shrink-0">
                    <img
                      src={selected.image}
                      alt={selected.name}
                      className="size-full object-cover object-top"
                    />
                  </div>
                  <div className="text-left min-w-0 flex-1">
                    <h4 className="font-serif font-medium text-sm text-amber-200 break-words leading-snug">
                      {selected.name}
                    </h4>
                    <p className="text-xs text-neutral-400 font-mono uppercase tracking-wider break-words mt-0.5">
                      {selected.role}
                    </p>
                  </div>
                </div>

                {selected.productTitle && (
                  <div className="w-full mt-2 pt-4 border-t border-white/10 flex items-center justify-between text-left bg-white/5 p-3 rounded-xl gap-2">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {selected.productImage && (
                        <img
                          src={selected.productImage}
                          alt={selected.productTitle}
                          className="size-10 rounded-lg object-cover border border-amber-500/30 shrink-0"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] text-amber-400 font-mono uppercase tracking-widest block">
                          Masterpiece Reviewed
                        </span>
                        <span className="text-xs font-medium text-neutral-200 truncate block">
                          {selected.productTitle}
                        </span>
                      </div>
                    </div>
                    {selected.productId && (
                      <Link
                        to={`/gallery/${selected.productId}`}
                        className="inline-flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 font-medium shrink-0 ml-2"
                      >
                        <span>View Piece</span>
                        <ExternalLink size={12} />
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Capsule({ testimonial, onClick }) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="group flex items-center gap-3.5 p-1.5 pr-6 rounded-full bg-background border border-border hover:border-amber-500/60 cursor-pointer transition-[border-color,box-shadow] shadow-xs hover:shadow-md text-left max-w-[280px]"
    >
      <div className="relative size-11 rounded-full overflow-hidden border border-border group-hover:border-amber-500 transition-colors shrink-0">
        <img
          src={testimonial.image}
          alt={testimonial.name}
          className="size-full object-cover object-top"
          loading="lazy"
        />
      </div>
      <div className="flex flex-col items-start leading-tight min-w-0">
        <span
          className="text-xs font-semibold text-foreground group-hover:text-amber-600 transition-colors truncate max-w-[140px] block"
          title={testimonial.name}
        >
          {testimonial.name}
        </span>
        <span
          className="text-[10px] text-muted-foreground font-mono truncate max-w-[140px] block"
          title={testimonial.productTitle || testimonial.role}
        >
          {testimonial.productTitle || testimonial.role}
        </span>
      </div>
    </motion.button>
  );
}

export default TestimonialSection2;
