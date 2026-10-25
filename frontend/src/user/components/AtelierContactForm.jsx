import React, { useState } from 'react';
import { Send, Loader2, ShieldCheck } from 'lucide-react';
import { submitInquiry } from '@/api/inquiryApi';
import { LuxuryButton } from './LuxuryButton';
import { toast } from 'sonner';

export function AtelierContactForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    jewelryType: 'Custom Jewellery Design',
    preferredMetal: 'Solid 22K Gold',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customerName.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        customerName: formData.customerName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        subject: formData.jewelryType,
        jewelryType: formData.jewelryType,
        preferredMetal: formData.preferredMetal,
        estimatedBudget: 'Consultation',
        message: formData.message.trim()
      };

      await submitInquiry(payload);
      toast.success('Your message has been sent successfully.');
      onSuccess(payload);
      setFormData({
        customerName: '',
        email: '',
        phone: '',
        jewelryType: 'Custom Jewellery Design',
        preferredMetal: 'Solid 22K Gold',
        message: ''
      });
    } catch (err) {
      toast.error(err.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl border border-border/80 bg-white dark:bg-card p-6 sm:p-10 shadow-xs flex flex-col gap-6">
      <div>
        <span className="text-[10px] uppercase font-mono tracking-widest text-amber-700 dark:text-amber-400 font-semibold block mb-1">
          Send a Message
        </span>
        <h3 className="text-2xl sm:text-3xl font-serif font-light text-foreground tracking-tight">
          Send Us a Message
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed mt-1">
          Fill in your details below and our team will get back to you shortly.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.customerName}
              onChange={(e) => handleChange('customerName', e.target.value)}
              placeholder="e.g. Sarah Jenkins"
              className="w-full bg-muted/30 border border-input rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="sarah@example.com"
              className="w-full bg-muted/30 border border-input rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              WhatsApp / Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+39 055 123 4567"
              className="w-full bg-muted/30 border border-input rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              What are you looking for?
            </label>
            <select
              value={formData.jewelryType}
              onChange={(e) => handleChange('jewelryType', e.target.value)}
              className="w-full bg-muted/30 border border-input rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all cursor-pointer"
            >
              <option value="Custom Jewellery Design">Custom Jewellery Design</option>
              <option value="Wedding & Bridal Jewellery">Wedding & Bridal Jewellery</option>
              <option value="Diamond Ring">Diamond Ring</option>
              <option value="Gold Necklace">Gold Necklace</option>
              <option value="Gold Bracelet / Bangle">Gold Bracelet / Bangle</option>
              <option value="Buying a Gallery Piece">Buying a Gallery Piece</option>
              <option value="Ring Resizing & Repair">Ring Resizing & Repair</option>
              <option value="General Question">General Question</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            Preferred Gold / Metal
          </label>
          <select
            value={formData.preferredMetal}
            onChange={(e) => handleChange('preferredMetal', e.target.value)}
            className="w-full bg-muted/30 border border-input rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all cursor-pointer"
          >
            <option value="Solid 22K Gold">Solid 22K Gold (High Purity)</option>
            <option value="18K Yellow Gold">18K Yellow Gold</option>
            <option value="18K White Gold">18K White Gold</option>
            <option value="18K Rose Gold">18K Rose Gold</option>
            <option value="Platinum">Pure Platinum</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            Your Message *
          </label>
          <textarea
            required
            rows={4}
            value={formData.message}
            onChange={(e) => handleChange('message', e.target.value)}
            placeholder="Tell us what kind of jewellery you want, any special details, or questions you have..."
            className="w-full bg-muted/30 border border-input rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all resize-none"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-border/80">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-light">
            <ShieldCheck className="size-4 text-emerald-600" />
            <span>Your information is always safe and kept private</span>
          </span>

          <LuxuryButton
            as="button"
            type="submit"
            disabled={isSubmitting}
            variant="gold"
            size="lg"
            className="w-full sm:w-auto min-w-[200px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin text-amber-900" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send className="size-4 text-amber-950" />
                <span>Send Message</span>
              </>
            )}
          </LuxuryButton>
        </div>
      </form>
    </div>
  );
}
