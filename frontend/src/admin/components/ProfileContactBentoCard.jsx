import React from 'react';
import { Mail, Phone, MessageSquare, Check, AlertCircle, Radio } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ProfileContactBentoCard({
  formData,
  onChange,
  isEmailValid = true,
  isWhatsappValid = true,
  className
}) {
  const handleEmailChange = (e) => {
    const sanitized = e.target.value.replace(/\s+/g, '').toLowerCase();
    onChange('email', sanitized);
  };

  const handlePhoneChange = (field, val) => {
    const sanitized = val.replace(/[^0-9+\s\-]/g, '').slice(0, 18);
    onChange(field, sanitized);
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
              Contact & Routing
            </h3>
            <p className="text-[10px] text-muted-foreground font-mono">
              Live customer communication channels
            </p>
          </div>

          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-emerald-700 dark:text-emerald-400">
            <Radio className="size-2 animate-pulse" />
            <span>Live Sync</span>
          </span>
        </div>

        <div className="space-y-2.5">
          <div>
            <div className="flex items-center justify-between mb-0.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground inline-flex items-center gap-1">
                <Mail className="size-2.5 text-muted-foreground" />
                <span>Contact Email *</span>
              </label>
              {formData.email && (
                isEmailValid ? (
                  <span className="text-[9px] font-mono text-emerald-700 dark:text-emerald-400 inline-flex items-center gap-0.5">
                    <Check className="size-2.5" />
                    Valid
                  </span>
                ) : (
                  <span className="text-[9px] font-mono text-rose-600 inline-flex items-center gap-0.5">
                    <AlertCircle className="size-2.5" />
                    Invalid format
                  </span>
                )
              )}
            </div>
            <input
              type="email"
              required
              value={formData.email || ''}
              onChange={handleEmailChange}
              placeholder="khalilandsonsjewellers@gmail.com"
              className={`w-full h-8 px-2.5 rounded-md border bg-background text-foreground text-xs font-mono focus-visible:outline-none focus-visible:ring-1 ${
                !isEmailValid && formData.email
                  ? 'border-rose-500 focus-visible:ring-rose-500/30'
                  : 'border-border/80 focus-visible:ring-foreground/20'
              }`}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-0.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground inline-flex items-center gap-1">
                <MessageSquare className="size-2.5 text-muted-foreground" />
                <span>WhatsApp Hotline *</span>
              </label>
              {formData.whatsapp && (
                isWhatsappValid ? (
                  <span className="text-[9px] font-mono text-emerald-700 dark:text-emerald-400 inline-flex items-center gap-0.5">
                    <Check className="size-2.5" />
                    Valid
                  </span>
                ) : (
                  <span className="text-[9px] font-mono text-rose-600 inline-flex items-center gap-0.5">
                    <AlertCircle className="size-2.5" />
                    10-15 digits
                  </span>
                )
              )}
            </div>
            <input
              type="text"
              required
              value={formData.whatsapp || ''}
              onChange={(e) => handlePhoneChange('whatsapp', e.target.value)}
              placeholder="+92 333 3213613"
              className={`w-full h-8 px-2.5 rounded-md border bg-background text-foreground text-xs font-mono focus-visible:outline-none focus-visible:ring-1 ${
                !isWhatsappValid && formData.whatsapp
                  ? 'border-rose-500 focus-visible:ring-rose-500/30'
                  : 'border-border/80 focus-visible:ring-foreground/20'
              }`}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-0.5">
                <span className="inline-flex items-center gap-1">
                  <Phone className="size-2.5 text-muted-foreground" />
                  <span>Mobile Phone</span>
                </span>
              </label>
              <input
                type="text"
                value={formData.phone || ''}
                onChange={(e) => handlePhoneChange('phone', e.target.value)}
                placeholder="+92 333 3213613"
                className="w-full h-8 px-2.5 rounded-md border border-border/80 bg-background text-foreground text-xs font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-0.5">
                <span className="inline-flex items-center gap-1">
                  <Phone className="size-2.5 text-muted-foreground" />
                  <span>Landline Desk</span>
                </span>
              </label>
              <input
                type="text"
                value={formData.landline || ''}
                onChange={(e) => handlePhoneChange('landline', e.target.value)}
                placeholder="+92 21 35670868"
                className="w-full h-8 px-2.5 rounded-md border border-border/80 bg-background text-foreground text-xs font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/20"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-2 mt-3 border-t border-border/60 text-[10px] font-mono text-muted-foreground flex items-center justify-between">
        <span>Client Routing</span>
        <span>SSL Synchronized</span>
      </div>
    </div>
  );
}
