import React, { useState, useEffect } from 'react';
import { Portal } from '@/components/portal';
import { X, Ruler, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RING_SIZES, BANGLE_SIZES, BRACELET_SIZES, NECKLACE_SIZES } from '@/utils/jewellerySizing';
import { STORE_INFO } from '@/constants/storeInfo';
import { SizingVideoPlayer } from './SizingVideoPlayer';

export function JewelleryMeasurementGuideModal({
  isOpen,
  onClose,
  initialTab = 'ring'
}) {
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleWhatsAppConsult = () => {
    const msg = `Hello Khalil & Sons, I would like guidance from your master goldsmith regarding jewellery sizing (${activeTab.toUpperCase()}) for a custom bespoke piece.`;
    window.open(STORE_INFO.whatsapp.inquiryUrl(msg), '_blank', 'noopener,noreferrer');
  };

  return (
    <Portal>
      <div
        className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
        onClick={onClose}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="sizing-guide-title"
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl max-h-[92vh] sm:max-h-[88vh] bg-card border border-border shadow-2xl rounded-2xl sm:rounded-3xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        >
          <div className="p-4 sm:p-6 border-b border-border/80 flex items-center justify-between shrink-0 bg-background/50">
            <div className="flex items-center gap-2.5">
              <Ruler className="size-4 text-muted-foreground" />
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground block">
                  Atelier Standards
                </span>
                <h3 id="sizing-guide-title" className="font-serif text-lg sm:text-xl font-light text-foreground">
                  Jewellery Sizing & Measurement Guide
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close measurement guide"
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="p-3 sm:px-6 sm:pt-4 border-b border-border/60 shrink-0 bg-muted/20">
            <div className="flex rounded-xl p-1 bg-muted/50 border border-border/60 gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('ring')}
                className={cn(
                  'flex-1 py-1.5 px-2 sm:px-3 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer text-center',
                  activeTab === 'ring'
                    ? 'bg-foreground text-background font-medium shadow-xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/60'
                )}
              >
                Rings
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('bangle')}
                className={cn(
                  'flex-1 py-1.5 px-2 sm:px-3 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer text-center',
                  activeTab === 'bangle'
                    ? 'bg-foreground text-background font-medium shadow-xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/60'
                )}
              >
                Bangles
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('bracelet')}
                className={cn(
                  'flex-1 py-1.5 px-2 sm:px-3 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer text-center',
                  activeTab === 'bracelet'
                    ? 'bg-foreground text-background font-medium shadow-xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/60'
                )}
              >
                Bracelets
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('necklace')}
                className={cn(
                  'flex-1 py-1.5 px-2 sm:px-3 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer text-center',
                  activeTab === 'necklace'
                    ? 'bg-foreground text-background font-medium shadow-xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/60'
                )}
              >
                Necklaces
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {activeTab === 'ring' && (
              <div className="space-y-6">
                <SizingVideoPlayer
                  title="Ring Measurement Guide"
                  videoSrc="/assets/videos/ring-size-guide.mp4"
                  duration="0:45"
                  steps={[
                    'Place existing fitting ring flat on metric ruler.',
                    'Read exact millimeter inside diameter.',
                    'Match diameter with US/Pak size chart below.'
                  ]}
                  posterSvg={
                    <svg viewBox="0 0 320 180" className="w-48 h-28 text-neutral-800">
                      <circle cx="160" cy="90" r="42" fill="none" stroke="#d97706" strokeWidth="4" />
                      <line x1="118" y1="90" x2="202" y2="90" stroke="#111" strokeWidth="2" strokeDasharray="4 3" />
                      <line x1="118" y1="80" x2="118" y2="100" stroke="#111" strokeWidth="2" />
                      <line x1="202" y1="80" x2="202" y2="100" stroke="#111" strokeWidth="2" />
                      <text x="160" y="78" textAnchor="middle" fontSize="11" fontFamily="monospace" fill="#111" fontWeight="bold">Inner Diameter (mm)</text>
                    </svg>
                  }
                />

                <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded border border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200 font-semibold">
                      AU · 916.6
                    </span>
                    <span className="text-xs font-mono uppercase tracking-wider font-medium text-amber-900 dark:text-amber-200">
                      Saddar Goldsmith Sizing Rules
                    </span>
                  </div>
                  <ul className="text-xs text-muted-foreground space-y-1.5 list-disc pl-4 font-light">
                    <li>Measure at room temperature at the end of the day when fingers are at normal size.</li>
                    <li>Always account for the knuckle so the ring slides over without force.</li>
                    <li>For wide bands (6mm+), consider selecting a half size larger for maximum comfort.</li>
                  </ul>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono uppercase tracking-wider font-medium text-foreground">
                      Standard Ring Conversion Chart
                    </span>
                    <span className="text-[11px] font-mono text-muted-foreground">
                      Pakistan & US Sizing
                    </span>
                  </div>
                  <div className="overflow-x-auto rounded-xl border border-border/80">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-muted/40 border-b border-border/80 text-[10px] uppercase tracking-wider text-muted-foreground">
                        <tr>
                          <th className="py-2.5 px-3">US / Pak Size</th>
                          <th className="py-2.5 px-3">UK / South Asia</th>
                          <th className="py-2.5 px-3">Diameter (mm)</th>
                          <th className="py-2.5 px-3">Circumference (mm)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60 bg-card">
                        {RING_SIZES.map((size) => (
                          <tr key={size.id} className="hover:bg-muted/30 transition-colors">
                            <td className="py-2.5 px-3 font-medium text-foreground">{size.label}</td>
                            <td className="py-2.5 px-3 text-muted-foreground">{size.ukLetter}</td>
                            <td className="py-2.5 px-3 text-foreground">{size.diameterMm} mm</td>
                            <td className="py-2.5 px-3 text-muted-foreground">{size.circumferenceMm} mm</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'bangle' && (
              <div className="space-y-6">
                <SizingVideoPlayer
                  title="Bangle & Kada Sizing Guide"
                  videoSrc="/assets/videos/bangle-size-guide.mp4"
                  duration="0:50"
                  steps={[
                    'Bring thumb and little finger tightly together across palm.',
                    'Wrap measuring tape around widest part of hand knuckles.',
                    'Match hand circumference to Pakistani anna size (2.4, 2.6, 2.8).'
                  ]}
                  posterSvg={
                    <svg viewBox="0 0 320 180" className="w-48 h-28 text-neutral-800">
                      <path d="M 90 120 C 105 70 155 50 205 60 C 245 70 270 110 250 140 C 215 160 120 160 90 120 Z" fill="none" stroke="#bbb" strokeWidth="2" />
                      <ellipse cx="175" cy="100" rx="60" ry="30" fill="none" stroke="#d97706" strokeWidth="3" strokeDasharray="5 3" />
                      <text x="175" y="104" textAnchor="middle" fontSize="11" fontFamily="monospace" fill="#111" fontWeight="bold">Widest Hand Perimeter</text>
                    </svg>
                  }
                />

                <div className="p-4 rounded-2xl border border-border/80 bg-muted/20">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded border border-border bg-card text-foreground font-semibold">
                      AU · 916.6
                    </span>
                    <h4 className="text-xs font-mono uppercase tracking-wider font-medium text-foreground">
                      Traditional Pakistani Bangle Notation
                    </h4>
                  </div>
                  <p className="text-xs text-muted-foreground font-light leading-relaxed">
                    Pakistani sarafa markets express bangle sizes in anna fractions of an inch. For example, <strong>2.6</strong> represents 2 inches and 6 sixteenths (2-6/16" or 2.375 inches inner diameter).
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono uppercase tracking-wider font-medium text-foreground">
                      Bangle Size & Hand Fit Chart
                    </span>
                    <span className="text-[11px] font-mono text-muted-foreground">
                      Sarafa Standards
                    </span>
                  </div>
                  <div className="overflow-x-auto rounded-xl border border-border/80">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-muted/40 border-b border-border/80 text-[10px] uppercase tracking-wider text-muted-foreground">
                        <tr>
                          <th className="py-2.5 px-3">Traditional Size</th>
                          <th className="py-2.5 px-3">Inner Diameter</th>
                          <th className="py-2.5 px-3">Hand Circumference</th>
                          <th className="py-2.5 px-3">Fit Category</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60 bg-card">
                        {BANGLE_SIZES.map((size) => (
                          <tr key={size.id} className="hover:bg-muted/30 transition-colors">
                            <td className="py-2.5 px-3 font-medium text-foreground">{size.label}</td>
                            <td className="py-2.5 px-3 text-foreground">{size.diameterMm} mm ({size.inches}")</td>
                            <td className="py-2.5 px-3 text-muted-foreground">{size.circumferenceMm} mm</td>
                            <td className="py-2.5 px-3 text-muted-foreground">{size.fitTag}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'bracelet' && (
              <div className="space-y-6">
                <SizingVideoPlayer
                  title="Bracelet Length Guide"
                  videoSrc="/assets/videos/bracelet-size-guide.mp4"
                  duration="0:40"
                  steps={[
                    'Wrap flexible tape snugly around wrist above bone.',
                    'Add 0.5" for snug fit or 0.75" for standard comfort.',
                    'Check against standard clasp lengths below.'
                  ]}
                  posterSvg={
                    <svg viewBox="0 0 320 180" className="w-48 h-28 text-neutral-800">
                      <rect x="80" y="65" width="160" height="50" rx="25" fill="none" stroke="#bbb" strokeWidth="2" />
                      <line x1="140" y1="45" x2="140" y2="135" stroke="#d97706" strokeWidth="3" strokeDasharray="4 3" />
                      <circle cx="140" cy="90" r="5" fill="#d97706" />
                      <text x="200" y="94" textAnchor="middle" fontSize="11" fontFamily="monospace" fill="#111" fontWeight="bold">Wrist + Drape</text>
                    </svg>
                  }
                />

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="p-3 rounded-xl border border-border/80 bg-card">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block mb-1">
                      Snug Fit
                    </span>
                    <span className="text-xs font-mono font-medium text-foreground block mb-1">
                      Wrist + 0.25" to 0.5"
                    </span>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Sits closely without sliding along the forearm. Ideal for delicate chains.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl border border-foreground/30 bg-muted/30">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-foreground font-medium block mb-1">
                      Comfort Fit (Standard)
                    </span>
                    <span className="text-xs font-mono font-medium text-foreground block mb-1">
                      Wrist + 0.75"
                    </span>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Natural gentle movement over the wrist. Recommended for gold charm bracelets.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl border border-border/80 bg-card">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block mb-1">
                      Loose Fit
                    </span>
                    <span className="text-xs font-mono font-medium text-foreground block mb-1">
                      Wrist + 1.0" to 1.25"
                    </span>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Generous drape over the back of the hand. Elegant for bridal link bracelets.
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono uppercase tracking-wider font-medium text-foreground">
                      Standard Bracelet Length Chart
                    </span>
                    <span className="text-[11px] font-mono text-muted-foreground">
                      Inches & Centimeters
                    </span>
                  </div>
                  <div className="overflow-x-auto rounded-xl border border-border/80">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-muted/40 border-b border-border/80 text-[10px] uppercase tracking-wider text-muted-foreground">
                        <tr>
                          <th className="py-2.5 px-3">Bracelet Length</th>
                          <th className="py-2.5 px-3">Metric (cm)</th>
                          <th className="py-2.5 px-3">Recommended Wrist</th>
                          <th className="py-2.5 px-3">Fit Profile</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60 bg-card">
                        {BRACELET_SIZES.map((size) => (
                          <tr key={size.id} className="hover:bg-muted/30 transition-colors">
                            <td className="py-2.5 px-3 font-medium text-foreground">{size.label}</td>
                            <td className="py-2.5 px-3 text-foreground">{size.cm} cm</td>
                            <td className="py-2.5 px-3 text-muted-foreground">{size.wristFit}</td>
                            <td className="py-2.5 px-3 text-muted-foreground">{size.fitTag}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'necklace' && (
              <div className="space-y-6">
                <SizingVideoPlayer
                  title="Necklace & Choker Drop Guide"
                  videoSrc="/assets/videos/necklace-size-guide.mp4"
                  duration="0:45"
                  steps={[
                    'Drape ribbon or thread around neck to preferred drop point.',
                    'Keep one finger ease for comfortable collarbone resting.',
                    'Measure flat length against ruler (18" is standard).'
                  ]}
                  posterSvg={
                    <svg viewBox="0 0 320 180" className="w-48 h-28 text-neutral-800">
                      <ellipse cx="160" cy="50" rx="45" ry="35" fill="none" stroke="#bbb" strokeWidth="2" />
                      <path d="M 125 60 C 130 115 190 115 195 60" fill="none" stroke="#d97706" strokeWidth="3" />
                      <circle cx="160" cy="100" r="4" fill="#d97706" />
                      <text x="160" y="125" textAnchor="middle" fontSize="11" fontFamily="monospace" fill="#111" fontWeight="bold">Princess Drop (18")</text>
                    </svg>
                  }
                />

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono uppercase tracking-wider font-medium text-foreground">
                      Standard Necklace &amp; Chain Length Chart
                    </span>
                    <span className="text-[11px] font-mono text-muted-foreground">
                      Inches &amp; Centimeters
                    </span>
                  </div>
                  <div className="overflow-x-auto rounded-xl border border-border/80">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-muted/40 border-b border-border/80 text-[10px] uppercase tracking-wider text-muted-foreground">
                        <tr>
                          <th className="py-2.5 px-3">Length</th>
                          <th className="py-2.5 px-3">Metric (cm)</th>
                          <th className="py-2.5 px-3">Resting Position</th>
                          <th className="py-2.5 px-3">Style Recommendation</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60 bg-card">
                        {NECKLACE_SIZES.map((size) => (
                          <tr key={size.id} className="hover:bg-muted/30 transition-colors">
                            <td className="py-2.5 px-3 font-medium text-foreground">{size.label}</td>
                            <td className="py-2.5 px-3 text-foreground">{size.cm} cm</td>
                            <td className="py-2.5 px-3 text-muted-foreground">{size.fitTag}</td>
                            <td className="py-2.5 px-3 text-muted-foreground">
                              {size.id === '16"' ? 'Choker fit, high necklines' : size.id === '18"' ? 'Universal standard for bridal & daily pendants' : size.id === '20"' ? 'Plunging necklines & statement pendants' : size.id === '22"' ? 'Layering & low necklines' : 'Royal bridal heirloom mala'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 sm:p-5 border-t border-border/80 bg-background flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <div className="text-left">
              <span className="text-xs font-serif font-light text-foreground block">
                Bespoke Quarter & Custom Sizes Available
              </span>
              <span className="text-[11px] font-mono text-muted-foreground block">
                Murshid Sunaar Tower goldsmiths tailor half & quarter sizes
              </span>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleWhatsAppConsult}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl border border-border bg-card hover:bg-muted text-xs font-mono uppercase tracking-wider text-foreground transition-colors cursor-pointer"
              >
                <MessageCircle className="size-3.5" />
                <span>Ask Artisan</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none h-10 px-5 rounded-xl bg-foreground text-background hover:bg-foreground/90 text-xs font-mono uppercase tracking-wider font-medium transition-all shadow-xs cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}
