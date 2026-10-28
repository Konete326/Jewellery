import React from 'react';
import { Badge } from '@/components/ui/badge';
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
        'bg-background border-border/80 relative w-full overflow-hidden rounded-xl border p-5 sm:p-6 shadow-xs flex flex-col justify-between',
        'supports-[backdrop-filter]:bg-background/80 backdrop-blur-md',
        className
      )}
    >
      <div>
        <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-border/60">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="font-mono text-[10px] uppercase tracking-wider">
              Atelier Location & Hours
            </Badge>
          </div>
          <a
            href="https://maps.app.goo.gl/49w2MCbeJfqTc8hT7"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[10px] font-mono text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <span>Google Maps</span>
            <ExternalLink className="size-3" />
          </a>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-3 text-muted-foreground" />
                <span>Physical Atelier Address</span>
              </span>
            </label>
            <textarea
              rows={3}
              value={formData.address || ''}
              onChange={(e) => onChange('address', e.target.value)}
              placeholder="Shop #2, Murshid Sunaar Tower, Dr. Daud Pota Road, Saddar, Karachi, 74400, Pakistan"
              className="w-full p-3 rounded-lg border border-border bg-background text-foreground text-xs leading-relaxed focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20 resize-none font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-3 text-muted-foreground" />
                <span>Boutique Operating Hours Summary</span>
              </span>
            </label>
            <input
              type="text"
              value={formData.openingHours || ''}
              onChange={(e) => onChange('openingHours', e.target.value)}
              placeholder="Mon–Sat: 2:00 PM – 9:00 PM (Fri: 3:30 PM – 9:30 PM) | Sun: Closed"
              className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground text-xs font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20"
            />
          </div>
        </div>
      </div>

      <div className="pt-3 mt-4 border-t border-border/60 text-[10px] font-mono text-muted-foreground flex items-center justify-between">
        <span>Sarafa Bazaar, Saddar</span>
        <span>Karachi 74400, PK</span>
      </div>
    </div>
  );
}

