import React from 'react';
import { AlertCircle, ShieldAlert, Clock, RefreshCw, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { openWhatsAppChat } from '@/utils/whatsapp';

export function TrackOrderErrorCard({ error, orderNumber, onRetry }) {
  if (!error) return null;

  const status = Number(error.status) || 0;
  const is404 = status === 404;
  const is403 = status === 403;
  const is429 = status === 429;
  const is400 = status === 400;

  const getErrorContent = () => {
    if (is404) {
      return {
        icon: <AlertCircle className="size-6 text-amber-600 dark:text-amber-400" />,
        title: 'Order Record Not Found',
        badge: 'AU · ORDER NOT FOUND',
        description: `No order was found under order number "${orderNumber || ''}". Please check the order number on your receipt (e.g. KS-861335-9871).`,
        tip: 'If you placed this order over WhatsApp or in the showroom, our team will provide your tracking number.'
      };
    }

    if (is403) {
      return {
        icon: <ShieldAlert className="size-6 text-destructive" />,
        title: 'Phone Verification Mismatch',
        badge: 'AU · PHONE VERIFICATION',
        description: 'The phone number entered does not match the contact number on file for this order. Tracking access is restricted to the registered customer.',
        tip: 'Please enter the same phone number you used when placing the order.'
      };
    }

    if (is400) {
      return {
        icon: <AlertCircle className="size-6 text-amber-600 dark:text-amber-400" />,
        title: 'Verification Incomplete',
        badge: 'AU · DETAILS REQUIRED',
        description: 'Both your Order Number and Phone Number are required to track your order.',
        tip: 'Please make sure both fields are filled in correctly.'
      };
    }

    if (is429) {
      return {
        icon: <Clock className="size-6 text-amber-600 dark:text-amber-400" />,
        title: 'Verification Limit Reached',
        badge: 'AU · TOO MANY ATTEMPTS',
        description: 'Too many search attempts were made in a short time. Please wait a moment before trying again.',
        tip: 'Please wait 60 seconds before submitting another verification attempt.'
      };
    }

    return {
      icon: <AlertCircle className="size-6 text-destructive" />,
      title: 'Unable to Connect to Server',
      badge: 'AU · NETWORK ERROR',
      description: error.message || 'We could not connect to our server. Please check your internet connection and try again.',
      tip: 'You can retry now or contact our showroom directly.'
    };
  };

  const content = getErrorContent();

  const handleWhatsAppContact = () => {
    const lines = [
      `Hello Khalil & Sons Jewellers,`,
      ``,
      `I am having trouble tracking my order: ${orderNumber || 'Unknown'}.`,
      `Issue: ${content.title}`,
      ``,
      `Could your team help verify this order for me?`
    ];
    openWhatsAppChat(lines.join('\n'));
  };

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-7 shadow-xs space-y-4 animate-in fade-in duration-200">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl border border-border/80 bg-muted/30 shrink-0">
          {content.icon}
        </div>

        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-border/80 bg-muted/40 text-[9px] font-mono tracking-widest uppercase text-muted-foreground font-semibold">
            {content.badge}
          </div>
          <h3 className="font-serif text-lg font-light text-foreground">
            {content.title}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed font-sans">
            {content.description}
          </p>
          <p className="text-[11px] font-mono text-muted-foreground/80 pt-1">
            {content.tip}
          </p>
        </div>
      </div>

      <div className="pt-3 border-t border-border/60 flex flex-wrap items-center gap-2.5">
        <Button
          type="button"
          onClick={onRetry}
          variant="outline"
          className="h-9 px-4 rounded-xl border-border text-xs font-mono uppercase tracking-wider text-foreground hover:bg-muted cursor-pointer flex items-center gap-1.5"
        >
          <RefreshCw className="size-3.5" />
          <span>Retry Search</span>
        </Button>

        <Button
          type="button"
          onClick={handleWhatsAppContact}
          className="h-9 px-4 rounded-xl bg-foreground text-background hover:bg-neutral-800 text-xs font-mono uppercase tracking-wider font-semibold cursor-pointer flex items-center gap-1.5 shadow-xs"
        >
          <MessageCircle className="size-3.5" />
          <span>Ask on WhatsApp</span>
        </Button>
      </div>
    </div>
  );
}
