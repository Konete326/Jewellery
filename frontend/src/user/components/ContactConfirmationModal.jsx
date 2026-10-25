import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCheck, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ContactConfirmationModal({ isOpen, onClose, inquiryData }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const customerName = inquiryData?.customerName || 'Valued Customer';
  const email = inquiryData?.email || 'your email';
  const jewelryType = inquiryData?.jewelryType || 'Jewellery Inquiry';
  const confirmationNumber = `KS-INQ-${Date.now().toString().slice(-6)}`;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-3xl border border-amber-500/30 bg-card p-6 sm:p-8 shadow-2xl flex flex-col gap-5 text-foreground animate-in zoom-in-95 duration-200"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
        >
          <X className="size-5" />
        </button>

        <div className="flex flex-col items-center text-center gap-3 pt-2">
          <div className="size-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 shadow-md">
            <CheckCheck className="size-8" />
          </div>

          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-amber-700 dark:text-amber-400 font-semibold block mb-1">
              Message Sent
            </span>
            <h3 className="font-serif text-2xl font-semibold text-foreground">
              Thank You!
            </h3>
            <p className="text-xs text-muted-foreground font-light mt-1">
              Thank you, <span className="text-foreground font-medium">{customerName}</span>. We have received your message and will get back to you shortly.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-muted/40 border border-border/80 flex flex-col gap-2.5 text-xs font-light">
          <div className="flex items-center justify-between pb-2 border-b border-border/60">
            <span className="text-muted-foreground font-mono uppercase text-[10px] tracking-wider">Reference ID</span>
            <span className="font-mono font-medium text-foreground">{confirmationNumber}</span>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-border/60">
            <span className="text-muted-foreground font-mono uppercase text-[10px] tracking-wider">Your Email</span>
            <span className="font-medium text-foreground truncate max-w-[200px]">{email}</span>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-border/60">
            <span className="text-muted-foreground font-mono uppercase text-[10px] tracking-wider">Interest</span>
            <span className="font-medium text-foreground">{jewelryType}</span>
          </div>

          <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-700 dark:text-emerald-400">
            <ShieldCheck className="size-3.5 shrink-0" />
            <span>We will reply to your message within 24 hours.</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="w-full sm:flex-1 text-xs uppercase tracking-wider cursor-pointer"
          >
            Close
          </Button>

          <Button
            type="button"
            onClick={() => {
              onClose();
              navigate('/gallery');
            }}
            className="w-full sm:flex-1 bg-[#2d3435] hover:bg-neutral-800 text-white text-xs uppercase tracking-widest gap-2 font-medium cursor-pointer"
          >
            <span>Explore Gallery</span>
            <ArrowRight className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
