import React, { useState, useEffect } from 'react';
import { X, Mail, Send, Loader2, AlertCircle, CheckCircle2, History, Phone, MessageSquare, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { replyToInquiry, updateInquiryStatus } from '@/api/inquiryApi';
import { createWhatsAppInquiryUrl, formatPhoneDisplay } from '@/utils/phone';
import { toast } from 'sonner';

export function ReplyInquiryModal({ isOpen, onClose, inquiry, onReplied = () => {} }) {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState({});
  const [showHistory, setShowHistory] = useState(false);

  const clientName = inquiry?.customerName || 'Valued Client';

  const templates = [
    {
      label: 'Consultation',
      subject: `Atelier Consultation: ${inquiry?.jewelryType || 'Fine Jewelry Inquiry'}`,
      text: `Dear ${clientName},\n\nThank you for reaching out to Khalil & Sons Jewellers. We have received your inquiry regarding our handcrafted fine jewelry collections.\n\nWe would be delighted to assist you with customized designs, current bullion rates, or private viewings at our boutique.\n\nWarm regards,\nAtelier Director\nKhalil & Sons Jewellers\nMurshid Sunaar Tower, Saddar, Karachi\nTel: +92 314 2004245`
    },
    {
      label: 'Bespoke Commission',
      subject: `Bespoke Commission Consultation - Khalil & Sons`,
      text: `Dear ${clientName},\n\nThank you for choosing Khalil & Sons Jewellers for your custom jewelry commission. Our master goldsmiths are prepared to bring your vision to life in certified 18K, 21K, or 22K hallmark gold.\n\nWe would love to invite you for a design discussion at our Karachi atelier at your convenience.\n\nWarm regards,\nAtelier Director\nKhalil & Sons Jewellers\nMurshid Sunaar Tower, Saddar, Karachi\nTel: +92 314 2004245`
    },
    {
      label: 'Price & Bullion',
      subject: `Pricing & Availability Details - Khalil & Sons`,
      text: `Dear ${clientName},\n\nThank you for your interest in our pieces. All our jewellery creations are hallmarked in certified 18K, 21K, or 22K gold, priced transparently according to current bullion rates and artisanal craftsmanship.\n\nPlease find the details regarding your requested piece below:\n\n\nWarm regards,\nAtelier Director\nKhalil & Sons Jewellers\nMurshid Sunaar Tower, Saddar, Karachi\nTel: +92 314 2004245`
    }
  ];

  useEffect(() => {
    if (inquiry) {
      setSubject(`Response to your inquiry: ${inquiry.subject || inquiry.jewelryType || 'Atelier Consultation'}`);
      setBody(`Dear ${inquiry.customerName || 'Valued Client'},\n\nThank you for reaching out to Khalil & Sons Jewellers.\n\nRegarding your request:\n\n\nWarm regards,\nAtelier Director\nKhalil & Sons Jewellers\nMurshid Sunaar Tower, Saddar, Karachi\nTel: +92 314 2004245`);
      setTouched({});
      setShowHistory(false);
    }
  }, [inquiry]);

  if (!isOpen || !inquiry) return null;

  const subjectValid = subject.trim().length >= 3;
  const bodyValid = body.trim().length >= 10;
  const isFormValid = subjectValid && bodyValid;

  const handleSend = async (e) => {
    e.preventDefault();
    setTouched({ subject: true, body: true });

    if (!inquiry.email) {
      toast.error('Recipient email address is missing for this inquiry.');
      return;
    }

    if (!isFormValid) {
      toast.error('Please complete both subject and message body before dispatching.');
      return;
    }

    setSubmitting(true);
    try {
      await replyToInquiry(inquiry._id, {
        subject: subject.trim(),
        message: body.trim(),
        sentBy: 'Khalil & Sons Concierge'
      });
      await updateInquiryStatus(inquiry._id, 'Replied');

      toast.success('Email reply delivered to patron & inquiry marked as Replied');
      onReplied();
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to dispatch email reply.');
    } finally {
      setSubmitting(false);
    }
  };

  const applyTemplate = (tpl) => {
    setSubject(tpl.subject);
    setBody(tpl.text);
    setTouched({ subject: true, body: true });
  };

  const hasReplies = Array.isArray(inquiry.replies) && inquiry.replies.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-2xl flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-800 dark:text-neutral-200 shrink-0">
              <Mail className="size-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold text-foreground">
                Dispatch Client Response
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Recipient: <span className="text-foreground font-medium">{inquiry.customerName}</span> ({inquiry.email})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="p-3.5 rounded-xl bg-muted/40 border border-border/80 text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-foreground block text-[11px] uppercase tracking-wider font-mono">
              Original Client Inquiry:
            </span>
            {inquiry.phone && (
              <a
                href={createWhatsAppInquiryUrl(
                  inquiry.phone,
                  inquiry.customerName,
                  inquiry.subject || inquiry.jewelryType,
                  inquiry.status
                )}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-1 font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 transition-colors"
                title="Open WhatsApp Chat pre-filled with inquiry"
              >
                <Phone className="size-3" />
                <span>{formatPhoneDisplay(inquiry.phone)}</span>
              </a>
            )}
          </div>
          <p className="italic text-foreground/80 line-clamp-3">
            "{inquiry.message}"
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-muted-foreground">
            {inquiry.jewelryType && <span>Item: <strong className="text-foreground font-medium">{inquiry.jewelryType}</strong></span>}
            {inquiry.preferredMetal && <span>Metal: <strong className="text-foreground font-medium">{inquiry.preferredMetal}</strong></span>}
            {inquiry.estimatedBudget && <span>Budget: <strong className="text-foreground font-medium">{inquiry.estimatedBudget}</strong></span>}
          </div>
        </div>

        {hasReplies && (
          <div className="rounded-xl border border-border/70 bg-muted/20 p-3 text-xs">
            <button
              type="button"
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center justify-between w-full text-left font-medium text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <span className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider">
                <History className="size-3.5 text-amber-600" />
                Previous Responses ({inquiry.replies.length})
              </span>
              <span className="text-[11px] text-amber-600">{showHistory ? 'Hide' : 'View'}</span>
            </button>
            {showHistory && (
              <div className="mt-2.5 space-y-2 max-h-40 overflow-y-auto pr-1">
                {inquiry.replies.map((rep, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-background border border-border/80 text-[11px]">
                    <div className="flex items-center justify-between font-medium text-foreground mb-1">
                      <span>{rep.subject}</span>
                      <span className="text-muted-foreground font-mono text-[10px]">
                        {new Date(rep.sentAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-muted-foreground line-clamp-2">{rep.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-mono flex items-center gap-1">
              <FileText className="size-3 text-neutral-500" /> Quick Templates:
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {templates.map((tpl, i) => (
              <button
                key={i}
                type="button"
                onClick={() => applyTemplate(tpl)}
                className="px-2.5 py-1 rounded-md text-[11px] border border-border hover:border-foreground/30 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-muted-foreground hover:text-foreground transition-colors duration-150 cursor-pointer font-medium"
              >
                {tpl.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSend} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground font-mono">
                Email Subject / Title *
              </label>
              {touched.subject && (
                subjectValid ? (
                  <span className="text-[10px] text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="size-3" /> Valid
                  </span>
                ) : (
                  <span className="text-[10px] text-rose-500 flex items-center gap-1">
                    <AlertCircle className="size-3" /> Min 3 chars
                  </span>
                )
              )}
            </div>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              onBlur={() => setTouched((p) => ({ ...p, subject: true }))}
              placeholder="Response subject..."
              className="w-full bg-muted/30 border border-input rounded-xl px-4 py-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:border-foreground/40 focus-visible:ring-2 focus-visible:ring-foreground/20 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground font-mono">
                Email Message Body *
              </label>
              {touched.body && (
                bodyValid ? (
                  <span className="text-[10px] text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="size-3" /> Valid
                  </span>
                ) : (
                  <span className="text-[10px] text-rose-500 flex items-center gap-1">
                    <AlertCircle className="size-3" /> Min 10 chars
                  </span>
                )
              )}
            </div>
            <textarea
              rows={8}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              onBlur={() => setTouched((p) => ({ ...p, body: true }))}
              placeholder="Type your response to the client..."
              className="w-full bg-muted/30 border border-input rounded-xl px-4 py-3 text-sm text-foreground focus-visible:outline-none focus-visible:border-foreground/40 focus-visible:ring-2 focus-visible:ring-foreground/20 transition-colors resize-y"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={submitting}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-foreground text-background hover:bg-foreground/90 text-xs uppercase tracking-widest gap-2 font-medium cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin text-background" />
                  <span>Transmitting via SMTP...</span>
                </>
              ) : (
                <>
                  <Send className="size-3.5 text-background" />
                  <span>Send Direct Email</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
