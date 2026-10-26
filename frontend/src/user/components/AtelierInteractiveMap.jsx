import React, { useState } from 'react';
import { MapPin, Navigation, ExternalLink, Phone, Clock, Star, Gem, Sparkles, Copy, Check } from 'lucide-react';
import { Map, MapMarker, MarkerContent, MarkerTooltip } from '@/components/ui/mapcn-marker-content';
import { STORE_INFO } from '@/constants/storeInfo';
import { toast } from 'sonner';

export function AtelierInteractiveMap({ onOpenAppointment }) {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState('vector');

  const boutiqueLng = 67.025203;
  const boutiqueLat = 24.859513;

  const handleCopyAddress = () => {
    try {
      navigator.clipboard.writeText(STORE_INFO.address.full);
      setCopied(true);
      toast.success('Boutique address copied to clipboard');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error('Unable to copy address');
    }
  };

  return (
    <section className="w-full mt-10">
      <div className="rounded-3xl border border-border/80 bg-card p-5 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-mono uppercase tracking-wider mb-2">
              <Gem className="size-3.5 text-amber-600" />
              <span>Historic Jewellery Quarter</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif font-light text-foreground tracking-tight">
              Visit Our Saddar Atelier & Showroom
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground font-light mt-1">
              Located in Murshid Sunaar Tower near Regal Chowk, Saddar, Karachi.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center p-1 rounded-xl bg-muted border border-border text-xs">
              <button
                type="button"
                onClick={() => setViewMode('vector')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  viewMode === 'vector'
                    ? 'bg-background text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Atelier Map
              </button>
              <button
                type="button"
                onClick={() => setViewMode('google')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  viewMode === 'google'
                    ? 'bg-background text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Google Embed
              </button>
            </div>

            <a
              href={STORE_INFO.social.googleMapsDirections}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-foreground text-background hover:bg-neutral-800 text-xs uppercase tracking-wider font-medium transition-colors shadow-xs cursor-pointer"
            >
              <Navigation className="size-3.5 text-amber-400" />
              <span>Get Directions</span>
              <ExternalLink className="size-3 text-neutral-400" />
            </a>
          </div>
        </div>

        <div className="relative w-full h-[400px] sm:h-[480px] rounded-2xl overflow-hidden border border-border shadow-xs bg-muted/40">
          {viewMode === 'vector' ? (
            <Map center={[boutiqueLng, boutiqueLat]} zoom={15.5} className="w-full h-full">
              <MapMarker longitude={boutiqueLng} latitude={boutiqueLat}>
                <MarkerContent>
                  <div className="relative flex items-center justify-center cursor-pointer group">
                    <span className="absolute size-9 rounded-full bg-amber-500/30 animate-ping" />
                    <div className="relative size-10 rounded-full border-2 border-white bg-linear-to-tr from-amber-700 via-amber-600 to-amber-400 shadow-2xl flex items-center justify-center text-white transition-transform group-active:scale-95">
                      <Gem className="size-5 text-amber-100" />
                    </div>
                  </div>
                </MarkerContent>
                <MarkerTooltip>
                  <div className="text-left py-1.5 px-1 max-w-[220px]">
                    <div className="flex items-center gap-1.5 text-amber-400 mb-0.5">
                      <Sparkles className="size-3.5" />
                      <span className="font-serif font-bold text-xs">Khalil & Sons Jewellers</span>
                    </div>
                    <p className="text-[11px] text-neutral-200 line-clamp-2">
                      {STORE_INFO.address.full}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] text-amber-300 font-mono mt-1 pt-1 border-t border-white/10">
                      <Clock className="size-3" />
                      <span>Mon-Sat: 12:00 PM – 9:00 PM</span>
                    </div>
                  </div>
                </MarkerTooltip>
              </MapMarker>
            </Map>
          ) : (
            <iframe
              src={STORE_INFO.social.googleMapsEmbed}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              title="Khalil & Sons Jewellers Location on Google Maps"
              className="w-full h-full"
            />
          )}

          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-10 p-4 rounded-2xl bg-background/95 backdrop-blur-md border border-border shadow-xl space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-700 dark:text-amber-400 shrink-0">
                  <MapPin className="size-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-serif text-sm font-semibold text-foreground">
                      Khalil & Sons Jewellers
                    </h4>
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-700 text-[10px] font-mono font-medium">
                      <Star className="size-2.5 fill-amber-500 text-amber-500" />
                      5.0
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                    {STORE_INFO.address.full}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopyAddress}
                className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors cursor-pointer shrink-0"
                title="Copy address"
              >
                {copied ? <Check className="size-4 text-emerald-600" /> : <Copy className="size-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-border/80">
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Clock className="size-3 text-amber-600" />
                <span>Mon – Sat: 12:00 PM – 9:00 PM</span>
              </div>

              {onOpenAppointment && (
                <button
                  type="button"
                  onClick={onOpenAppointment}
                  className="text-xs text-amber-700 dark:text-amber-400 hover:underline font-medium cursor-pointer"
                >
                  Book Private Viewing
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
