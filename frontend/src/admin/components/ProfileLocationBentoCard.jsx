import React from 'react';
import { MapPin, Clock, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ProfileLocationBentoCard({
  formData,
  onChange,
  className
}) {
  const handleAddressChange = (e) => {
    onChange('address', e.target.value.slice(0, 200));
  };

  const handleHoursChange = (e) => {
    onChange('openingHours', e.target.value.slice(0, 100));
  };

  return (
    <div
      className={cn(
        'rounded-xl border border-border/80 bg-card p-3.5 sm:p-4 shadow-xs flex flex-col justify-between',
        className
      )}
    >
      <div>
        <div className="flex items-center justify-between gap-3 pb-2 mb-3 border-b border-border/60">
          <div>
            <h3 className="text-xs font-semibold text-foreground tracking-tight">
              Showroom Location & Hours
            </h3>
            <p className="text-[10px] text-muted-foreground font-mono">
              Physical boutique address and salon timings
            </p>
          </div>

          <a
            href="https://maps.app.goo.gl/49w2MCbeJfqTc8hT7"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[10px] font-mono text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <span>Google Maps</span>
            <ExternalLink className="size-2.5" />
          </a>
        </div>

        <div className="space-y-2.5">
          <div>
            <div className="flex items-center justify-between mb-0.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground inline-flex items-center gap-1">
                <MapPin className="size-2.5 text-muted-foreground" />
                <span>Showroom Physical Address</span>
              </label>
              <span className="text-[9px] font-mono text-muted-foreground">
                {(formData.address || '').length}/200
              </span>
            </div>
            <textarea
              rows={2}
              value={formData.address || ''}
              onChange={handleAddressChange}
              placeholder="Shop #2, Murshid Sunaar Tower, Dr. Daud Pota Road, Saddar, Karachi, 74400, Pakistan"
              className="w-full p-2 rounded-md border border-border/80 bg-background text-foreground text-xs leading-normal focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20 resize-none font-sans"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-0.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground inline-flex items-center gap-1">
                <Clock className="size-2.5 text-muted-foreground" />
                <span>Operating Hours Summary</span>
              </label>
              <span className="text-[9px] font-mono text-muted-foreground">
                {(formData.openingHours || '').length}/100
              </span>
            </div>
            <input
              type="text"
              value={formData.openingHours || ''}
              onChange={handleHoursChange}
              placeholder="Mon–Sat: 2:00 PM – 9:00 PM (Fri: 3:30 PM – 9:30 PM) | Sun: Closed"
              className="w-full h-8 px-2.5 rounded-md border border-border/80 bg-background text-foreground text-xs font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20"
            />
          </div>
        </div>
      </div>

      <div className="pt-2 mt-3 border-t border-border/60 text-[10px] font-mono text-muted-foreground flex items-center justify-between">
        <span>Saddar Sarafa Bazaar</span>
        <span>Karachi 74400, PK</span>
      </div>
    </div>
  );
}
