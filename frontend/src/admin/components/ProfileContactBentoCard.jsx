import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, MessageSquare, Check, AlertCircle, Radio } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ProfileContactBentoCard({
  formData,
  onChange,
  className
}) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = formData.email ? emailRegex.test(formData.email.trim()) : true;

  const handlePhoneChange = (field, val) => {
    const sanitized = val.replace(/[^0-9+\s\-()]/g, '');
    onChange(field, sanitized);
  };

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
              Channels & Support
            </Badge>
          </div>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-emerald-700 dark:text-emerald-400">
            <Radio className="size-3 animate-pulse" />
            <span>Storefront Live Sync</span>
          </span>
        </div>

        <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
          Values updated here instantly synchronize across customer footer, WhatsApp links, inquiry handlers, and bank modals.
        </p>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground inline-flex items-center gap-1.5">
                <Mail className="size-3 text-muted-foreground" />
                <span>Official Contact Email *</span>
              </label>
              {formData.email && (
                isEmailValid ? (
                  <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 inline-flex items-center gap-1">
                    <Check className="size-3" />
                    Valid Email
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-rose-600 inline-flex items-center gap-1">
                    <AlertCircle className="size-3" />
                    Invalid format
                  </span>
                )
              )}
            </div>
            <input
              type="email"
              required
              value={formData.email || ''}
              onChange={(e) => onChange('email', e.target.value.trim().toLowerCase())}
              placeholder="khalilandsonsjewellers@gmail.com"
              className={`w-full h-10 px-3 rounded-lg border bg-background text-foreground text-xs font-mono focus-visible:outline-none focus-visible:ring-1 ${
                !isEmailValid ? 'border-rose-500 focus-visible:ring-rose-500/30' : 'border-border focus-visible:ring-foreground/20'
              }`}
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
              <span className="inline-flex items-center gap-1.5">
                <MessageSquare className="size-3 text-muted-foreground" />
                <span>WhatsApp Hotline Number *</span>
              </span>
            </label>
            <input
              type="text"
              required
              value={formData.whatsapp || ''}
              onChange={(e) => handlePhoneChange('whatsapp', e.target.value)}
              placeholder="+92 333 3213613"
              className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground text-xs font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20"
            />
            <span className="text-[10px] text-muted-foreground font-mono mt-1 block">
              Auto-formats to WhatsApp Web and Mobile chat links
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="size-3 text-muted-foreground" />
                  <span>Mobile Phone</span>
                </span>
              </label>
              <input
                type="text"
                value={formData.phone || ''}
                onChange={(e) => handlePhoneChange('phone', e.target.value)}
                placeholder="+92 333 3213613"
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground text-xs font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="size-3 text-muted-foreground" />
                  <span>Landline Desk</span>
                </span>
              </label>
              <input
                type="text"
                value={formData.landline || ''}
                onChange={(e) => handlePhoneChange('landline', e.target.value)}
                placeholder="+92 21 35670868"
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-foreground text-xs font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-3 mt-4 border-t border-border/60 text-[10px] font-mono text-muted-foreground flex items-center justify-between">
        <span>Verified Concierge</span>
        <span>SSL & Encrypted Routing</span>
      </div>
    </div>
  );
}
