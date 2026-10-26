import React, { useState } from 'react';
import { Send, Loader2, ShieldCheck } from 'lucide-react';
import { submitInquiry } from '@/api/inquiryApi';
import { normalizePhoneToE164 } from '@/utils/phone';
import { LuxuryButton } from './LuxuryButton';
import { toast } from 'sonner';

export function AtelierContactForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    subject: 'General Inquiry & Questions',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhoneChange = (e) => {
    const sanitized = e.target.value.replace(/[^0-9+\s\-()]/g, '');
    handleChange('phone', sanitized);
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
        phone: normalizePhoneToE164(formData.phone.trim()),
        subject: formData.subject,
        jewelryType: formData.subject,
        preferredMetal: 'General Inquiry',
        estimatedBudget: 'Consultation',
        message: formData.message.trim()
      };

      await submitInquiry(payload);
      toast.success('Your message has been sent successfully.');
      onSuccess?.(payload);
      setFormData({
        customerName: '',
        email: '',
        phone: '',
        subject: 'General Inquiry & Questions',
        message: ''
      });
    } catch (err) {
      toast.error(err.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border/80 bg-white dark:bg-card p-5 sm:p-7 shadow-xs flex flex-col justify-between h-full gap-4">
      <div>
        <h3 className="text-xl sm:text-2xl font-serif font-light text-foreground tracking-tight">
          Send Us a Message
        </h3>
        <p className="text-xs text-muted-foreground font-light leading-relaxed mt-0.5">
          For any questions, general inquiries, custom orders, or customer support, write to us below.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col justify-between flex-1 gap-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.customerName}
              onChange={(e) => handleChange('customerName', e.target.value)}
              placeholder="e.g. Sarah Jenkins"
              className="w-full bg-muted/30 border border-input rounded-xl px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="sarah@example.com"
              className="w-full bg-muted/30 border border-input rounded-xl px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
              Phone / WhatsApp (Optional)
            </label>
            <input
              type="tel"
              inputMode="tel"
              value={formData.phone}
              onChange={handlePhoneChange}
              placeholder="+39 055 123 4567"
              className="w-full bg-muted/30 border border-input rounded-xl px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
              Inquiry Topic
            </label>
            <select
              value={formData.subject}
              onChange={(e) => handleChange('subject', e.target.value)}
              className="w-full bg-muted/30 border border-input rounded-xl px-3.5 py-2 text-sm text-foreground outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all cursor-pointer"
            >
              <option value="General Inquiry & Questions">General Inquiry & Questions</option>
              <option value="Custom Jewellery & Bespoke Design">Custom Jewellery & Bespoke Design</option>
              <option value="Order Status & Delivery">Order Status & Delivery</option>
              <option value="Private Atelier Appointment">Private Atelier Appointment</option>
              <option value="Jewellery Restoration & Repair">Jewellery Restoration & Repair</option>
              <option value="Wholesale & Corporate Inquiry">Wholesale & Corporate Inquiry</option>
              <option value="Customer Feedback & Other">Customer Feedback & Other</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
            Your Message *
          </label>
          <textarea
            required
            rows={3}
            value={formData.message}
            onChange={(e) => handleChange('message', e.target.value)}
            placeholder="How can we assist you today? Write your message, inquiry, or question here..."
            className="w-full bg-muted/30 border border-input rounded-xl px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all resize-none"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-border/80">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-light">
            <ShieldCheck className="size-3.5 text-emerald-600" />
            <span>Your personal details are strictly confidential</span>
          </span>

          <LuxuryButton
            as="button"
            type="submit"
            disabled={isSubmitting}
            variant="gold"
            size="default"
            className="w-full sm:w-auto min-w-[200px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin text-white" />
                <span>Sending Message...</span>
              </>
            ) : (
              <>
                <Send className="size-4 text-amber-200" />
                <span>Send Message</span>
              </>
            )}
          </LuxuryButton>
        </div>
      </form>
    </div>
  );
}
