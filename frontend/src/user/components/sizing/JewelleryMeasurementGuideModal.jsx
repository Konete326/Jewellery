import React, { useState, useEffect } from 'react';
import { Portal } from '@/components/portal';
import { X, Ruler, Sparkles, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RING_SIZES, BANGLE_SIZES, BRACELET_SIZES, NECKLACE_SIZES } from '@/utils/jewellerySizing';
import { STORE_INFO } from '@/constants/storeInfo';

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
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="p-4 rounded-2xl border border-border/80 bg-background flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-border/60 mb-3">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-medium">
                          Method 01 • Inner Diameter
                        </span>
                        <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          Most Accurate
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                        Select a ring that fits the intended finger comfortably. Lay it flat across a ruler and measure the inside edge to inside edge in millimeters across the widest point.
                      </p>
                    </div>

                    <div className="w-full h-24 rounded-xl border border-border/60 bg-muted/30 flex items-center justify-center p-2">
                      <svg viewBox="0 0 200 80" className="w-full h-full text-foreground/80">
                        <circle cx="100" cy="40" r="28" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.4" />
                        <circle cx="100" cy="40" r="25" fill="none" stroke="currentColor" strokeWidth="1.5" />
                        <line x1="75" y1="40" x2="125" y2="40" stroke="#d97706" strokeWidth="2" strokeDasharray="3 2" />
                        <line x1="75" y1="34" x2="75" y2="46" stroke="#d97706" strokeWidth="2" />
                        <line x1="125" y1="34" x2="125" y2="46" stroke="#d97706" strokeWidth="2" />
                        <text x="100" y="32" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#d97706">Ø Inside mm</text>
                      </svg>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl border border-border/80 bg-background flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-border/60 mb-3">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-medium">
                          Method 02 • Finger Circumference
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded border border-border/60">
                          Flexible Tape
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                        Wrap a narrow strip of paper or non-stretching string around the base of your finger. Mark where the ends meet, then measure the flat strip length against a metric ruler.
                      </p>
                    </div>

                    <div className="w-full h-24 rounded-xl border border-border/60 bg-muted/30 flex items-center justify-center p-2">
                      <svg viewBox="0 0 200 80" className="w-full h-full text-foreground/80">
                        <ellipse cx="100" cy="40" rx="36" ry="18" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                        <path d="M 64 40 C 64 26 136 26 136 40 C 136 54 80 56 68 46" fill="none" stroke="#d97706" strokeWidth="2" />
                        <circle cx="68" cy="46" r="3" fill="#d97706" />
                        <text x="100" y="34" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#d97706">Mark Overlap</text>
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="size-3.5 text-amber-600 dark:text-amber-400" />
                    <span className="text-xs font-mono uppercase tracking-wider font-medium text-amber-900 dark:text-amber-200">
                      Saddar Goldsmith Sizing Rules
                    </span>
                  </div>
                  <ul className="text-xs text-muted-foreground space-y-1.5 list-disc pl-4 font-light">
                    <li>Measure at room temperature at the end of the day when your fingers are comfortably full.</li>
                    <li>Always account for the knuckle so the ring slides over smoothly without forcing.</li>
                    <li>For wide bands (6mm+), consider selecting a half size larger for comfort.</li>
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
                <div className="p-4 rounded-2xl border border-border/80 bg-background">
                  <div className="flex items-center justify-between pb-2 border-b border-border/60 mb-3">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-medium">
                      Traditional Hand Measurement Technique
                    </span>
                    <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      Crucial Step
                    </span>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 items-center">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Unlike bracelets, closed circular bangles must pass over the widest part of your hand, not your wrist. Bring your thumb and little finger together tightly across your palm as if slipping on a bangle. Wrap measuring tape around the knuckles and base of the thumb.
                    </p>
                    <div className="w-full h-24 rounded-xl border border-border/60 bg-muted/30 flex items-center justify-center p-2">
                      <svg viewBox="0 0 200 80" className="w-full h-full text-foreground/80">
                        <path d="M 50 55 C 60 30 90 20 120 25 C 145 30 160 50 150 65 C 130 75 70 75 50 55 Z" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
                        <ellipse cx="105" cy="45" rx="35" ry="18" fill="none" stroke="#d97706" strokeWidth="2" strokeDasharray="3 2" />
                        <text x="105" y="47" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#d97706">Widest Hand Perimeter</text>
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-border/80 bg-muted/20">
                  <h4 className="text-xs font-mono uppercase tracking-wider font-medium text-foreground mb-1.5">
                    Traditional Pakistani Bangle Notation
                  </h4>
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
                <div className="p-4 rounded-2xl border border-border/80 bg-background">
                  <div className="flex items-center justify-between pb-2 border-b border-border/60 mb-3">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-medium">
                      Wrist Circumference Measurement
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded border border-border/60">
                      Tape Measure
                    </span>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 items-center">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Wrap a soft measuring tape snugly around your wrist just above the wrist bone. Note your exact measurement, then add your preferred allowance for comfort drape.
                    </p>
                    <div className="w-full h-24 rounded-xl border border-border/60 bg-muted/30 flex items-center justify-center p-2">
                      <svg viewBox="0 0 200 80" className="w-full h-full text-foreground/80">
                        <rect x="50" y="30" width="100" height="24" rx="12" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
                        <line x1="85" y1="20" x2="85" y2="60" stroke="#d97706" strokeWidth="2" strokeDasharray="3 2" />
                        <circle cx="85" cy="40" r="3" fill="#d97706" />
                        <text x="130" y="44" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#d97706">Tape Wrap</text>
                      </svg>
                    </div>
                  </div>
                </div>

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
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="p-4 rounded-2xl border border-border/80 bg-background flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-border/60 mb-3">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-medium">
                          Method 01 • Measuring Tape
                        </span>
                        <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          Recommended
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                        Wrap a soft, flexible measuring tape gently around the base of your neck where you want the necklace or choker to rest. Keep one finger between the tape and neck for comfortable ease.
                      </p>
                      <div className="p-3 rounded-xl bg-muted/30 border border-border/60 text-[11px] font-mono space-y-1">
                        <span className="text-foreground block font-medium">Pro Tip for Chokers:</span>
                        <span className="text-muted-foreground block">For a snug choker fit, measure exact neck circumference and add 2 inches (5 cm).</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl border border-border/80 bg-background flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-border/60 mb-3">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-medium">
                          Method 02 • String &amp; Ruler
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                        Use a piece of non-stretchy string or ribbon. Drape it around your neck to your preferred drop point, mark where the ends meet, and lay it flat against a standard metric or imperial ruler.
                      </p>
                      <div className="p-3 rounded-xl bg-muted/30 border border-border/60 text-[11px] font-mono space-y-1">
                        <span className="text-foreground block font-medium">Standard Princess Length:</span>
                        <span className="text-muted-foreground block">18" (45 cm) is the classic collarbone length that fits over 90% of necklines.</span>
                      </div>
                    </div>
                  </div>
                </div>

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
