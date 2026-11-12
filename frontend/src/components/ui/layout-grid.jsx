import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { openWhatsAppChat } from '@/utils/whatsapp';
import { STORE_INFO } from '@/constants/storeInfo';

export function LayoutGrid({ cards = [] }) {
  const [selected, setSelected] = useState(null);
  const [lastSelected, setLastSelected] = useState(null);

  const handleClick = (card) => {
    setLastSelected(selected);
    setSelected(card);
  };

  const handleOutsideClick = () => {
    setLastSelected(selected);
    setSelected(null);
  };

  const handleWhatsApp = (piece, e) => {
    e.stopPropagation();
    const phone = STORE_INFO.whatsapp.number || '+923333213613';
    const title = piece?.title || 'Masterpiece Jewellery';
    const purity = piece?.purity || '22K Gold';
    const refCode = piece?.sku || `KS-${String(piece?._id || piece?.id || '').slice(-6).toUpperCase()}`;
    const msg = `As-salamu alaykum Khalil & Sons Jewellers, I am interested in your bespoke masterpiece:\n\nPiece: ${title} (${refCode})\nPurity: ${purity}\nLink: https://khalilandsonsjewellers.com/masterpieces/${piece?._id || piece?.id}\n\nPlease share design consultation and price on request.`;
    openWhatsAppChat({ phone, message: msg });
  };

  return (
    <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 relative">
      {cards.map((card, i) => (
        <div key={card.id || i} className={cn(card.className, '')}>
          <motion.div
            onClick={() => handleClick(card)}
            className={cn(
              card.className,
              'relative overflow-hidden cursor-pointer rounded-2xl group border border-border/70 hover:border-amber-500/50 transition-colors shadow-xs',
              selected?.id === card.id
                ? 'rounded-2xl cursor-default fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-2xl h-[75vh] max-h-[600px] z-50 flex flex-col justify-end bg-background shadow-2xl border-amber-500/40'
                : lastSelected?.id === card.id
                ? 'z-40 bg-card rounded-2xl h-full w-full min-h-[300px]'
                : 'bg-card rounded-2xl h-full w-full min-h-[300px]'
            )}
            layoutId={`card-${card.id}`}
          >
            {selected?.id === card.id && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOutsideClick();
                }}
                className="absolute top-4 right-4 z-60 p-2 rounded-full bg-black/70 text-white hover:bg-black transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="size-4" />
              </button>
            )}

            <motion.img
              layoutId={`image-${card.id}-image`}
              src={card.thumbnail}
              alt={card.title || 'Khalil & Sons Masterpiece'}
              loading="lazy"
              className={cn(
                'object-cover object-top absolute inset-0 h-full w-full transition-transform duration-500',
                selected?.id === card.id ? 'scale-100' : 'group-hover:scale-105'
              )}
            />

            <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

            <div className="relative z-20 p-5 flex flex-col justify-end h-full text-white">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-mono tracking-widest text-amber-300">
                  {card.category || 'AU · 916.6 Masterpiece'}
                </span>
                <h3 className="font-serif text-lg sm:text-xl font-semibold leading-snug">
                  {card.title}
                </h3>
              </div>

              {selected?.id === card.id && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="pt-3 space-y-3"
                >
                  {card.description && (
                    <p className="text-xs text-white/80 font-sans line-clamp-3 leading-relaxed">
                      {card.description}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={(e) => handleWhatsApp(card.piece, e)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-black text-xs font-mono uppercase tracking-wider font-semibold transition-colors cursor-pointer shadow-md"
                    >
                      <MessageCircle className="size-3.5" />
                      <span>WhatsApp Inquiry</span>
                    </button>

                    <Link
                      to={`/masterpieces/${card.piece?._id || card.piece?.id || card.id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-mono uppercase tracking-wider transition-colors"
                    >
                      <span>View Masterpiece</span>
                      <ArrowRight className="size-3" />
                    </Link>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      ))}

      <AnimatePresence>
        {selected?.id && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleOutsideClick}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 cursor-pointer"
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default LayoutGrid;
