import React from 'react';
import { MapPin, Clock, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ProfileLocationBentoCard({
  formData,
  onChange,
  className
}) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border/80 bg-card p-5 shadow-xs flex flex-col justify-between',
        className
      )}
    >
      <div>
        <div className="flex items-center justify-between gap-3 pb-3 mb-4 border-b border-border/60">
          <div>
            <h3 className="text-sm font-medium text-foreground tracking-tight">
              Showroom Location & Hours
            </h3>
            <p className="text-xs text-muted-foreground font-mono">
              Physical boutique address and salon timings
            </p>
          </div>

          <a
            href="https://maps.app.goo.gl/49w2MCbeJfqTc8hT7"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-mono text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <span>Google Maps</span>
            <ExternalLink className="size-3" />
          </a>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-3 text-muted-foreground" />
                <span>Showroom Physical Address</span>
              </span>
            </label>
            <textarea
              rows={2}
              value={formData.address || ''}
              onChange={(e) => onChange('address', e.target.value)}
              placeholder="Shop #2, Murshid Sunaar Tower, Dr. Daud Pota Road, Saddar, Karachi, 74400, Pakistan"
              className="w-full p-2.5 rounded-lg border border-border/80 bg-background text-foreground text-xs leading-relaxed focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20 resize-none font-sans"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-3 text-muted-foreground" />
                <span>Operating Hours Summary</span>
              </span>
            </label>
            <input
              type="text"
              value={formData.openingHours || ''}
              onChange={(e) => onChange('openingHours', e.target.value)}
              placeholder="Mon–Sat: 2:00 PM – 9:00 PM (Fri: 3:30 PM – 9:30 PM) | Sun: Closed"
              className="w-full h-9 px-3 rounded-lg border border-border/80 bg-background text-foreground text-xs font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20"
            />
          </div>
        </div>
      </div>

      <div className="pt-3 mt-4 border-t border-border/60 text-[10px] font-mono text-muted-foreground flex items-center justify-between">
        <span>Saddar Sarafa Bazaar</span>
        <span>Karachi 74400, Pakistan</span>
      </div>
    </div>
  );
}
