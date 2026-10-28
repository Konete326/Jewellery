import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Send, Loader2, ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';
import { submitInquiry } from '@/api/inquiryApi';
import { normalizePhoneToE164 } from '@/utils/phone';
import { LuxuryButton } from './LuxuryButton';
import { Button } from '@/components/ui/button';
import { getAuthUser } from '@/lib/auth';
import { toast } from 'sonner';

export function AtelierContactForm({ onSuccess }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(getAuthUser());

  const [formData, setFormData] = useState(() => {
    const current = getAuthUser();
    return {
      customerName: current?.name || '',
      email: current?.email || '',
      phone: '',
      subject: 'General Inquiry & Questions',
      message: ''
    };
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleAuthChange = (e) => {
      const current = e.detail || getAuthUser();
      setUser(current);
      if (current) {
        setFormData((prev) => ({
          ...prev,
          customerName: prev.customerName || current.name || '',
          email: current.email || prev.email || ''
        }));
      }
    };
    window.addEventListener('khalil_auth_change', handleAuthChange);
    return () => window.removeEventListener('khalil_auth_change', handleAuthChange);
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhoneChange = (e) => {
    const sanitized = e.target.value.replace(/[^0-9+\s\-()]/g, '');
    handleChange('phone', sanitized);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Sign In Required', {
        description: 'Please sign in first so we can deliver updates directly to your email.'
      });
      navigate('/auth', { state: { from: location } });
      return;
    }

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
      toast.success('Inquiry Submitted', {
        description: `Confirmation email sent to ${formData.email.trim()}`
      });
      onSuccess?.(payload);
      setFormData((prev) => ({
        ...prev,
        phone: '',
        subject: 'General Inquiry & Questions',
        message: ''
      }));
    } catch (err) {
      toast.error(err.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border/80 bg-white p-5 sm:p-7 shadow-xs flex flex-col justify-between h-full gap-4">
      <div>
        <h3 className="text-xl sm:text-2xl font-serif font-light text-foreground tracking-tight">
          Send Us a Message
        </h3>
        <p className="text-xs text-muted-foreground font-light leading-relaxed mt-0.5">
          For any questions, general inquiries, custom orders, or customer support, write to us below.
        </p>
      </div>

      {!user ? (
        <div className="p-3.5 rounded-xl border border-amber-500/25 bg-amber-500/5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="size-8 rounded-full bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-900 font-serif font-semibold text-xs shrink-0">
              KS
            </div>
            <div className="min-w-0">
              <span className="text-xs font-medium text-foreground block truncate">
                Sign In Required
              </span>
              <span className="text-[11px] text-muted-foreground block truncate">
                Sign in to receive instant email confirmations and inquiry updates.
              </span>
            </div>
          </div>
          <Button
            type="button"
            onClick={() => navigate('/auth', { state: { from: location } })}
            className="h-8 px-3 text-xs bg-foreground text-background hover:bg-neutral-800 shrink-0 cursor-pointer shadow-xs"
          >
            Sign In
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/40 border border-border/80 text-xs text-muted-foreground">
          <CheckCircle2 className="size-3.5 text-amber-700 shrink-0" />
          <span className="truncate">
            Submitting as <strong className="text-foreground font-medium">{user.name}</strong> ({user.email})
          </span>
        </div>
      )}

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
              className="w-full bg-white border border-input rounded-xl px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-foreground/30 focus-visible:border-foreground/60 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
              Email Address *
            </label>
            <input
              type="email"
              required
              readOnly={Boolean(user?.email)}
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="sarah@example.com"
              className={`w-full bg-white border border-input rounded-xl px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-foreground/30 focus-visible:border-foreground/60 transition-colors ${
                user?.email ? 'bg-muted/30 cursor-not-allowed text-muted-foreground' : ''
              }`}
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
              placeholder="+92 333 1234567"
              className="w-full bg-white border border-input rounded-xl px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-foreground/30 focus-visible:border-foreground/60 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
              Inquiry Topic
            </label>
            <select
              value={formData.subject}
              onChange={(e) => handleChange('subject', e.target.value)}
              className="w-full bg-white border border-input rounded-xl px-3.5 py-2 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-foreground/30 focus-visible:border-foreground/60 transition-colors cursor-pointer"
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
            className="w-full bg-white border border-input rounded-xl px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-foreground/30 focus-visible:border-foreground/60 transition-colors resize-none"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-border/80">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-light">
            <ShieldCheck className="size-3.5 text-amber-700" />
            <span>Official confirmation will be delivered to your email</span>
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
            ) : !user ? (
              <>
                <Lock className="size-4 text-amber-200" />
                <span>Sign In to Send</span>
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
