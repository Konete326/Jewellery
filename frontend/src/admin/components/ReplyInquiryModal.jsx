import React, { useState, useEffect } from 'react';
import { X, Mail, Send, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { replyToInquiry } from '@/api/inquiryApi';
import { toast } from 'sonner';

export function ReplyInquiryModal({ isOpen, onClose, inquiry, onReplied = () => {} }) {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (inquiry) {
      setSubject(`Response to your inquiry: ${inquiry.subject || inquiry.jewelryType || 'Atelier Consultation'}`);
      setBody(`Dear ${inquiry.customerName || 'Valued Client'},\n\nThank you for reaching out to Khalil & Sons Jewellers.\n\nRegarding your request:\n\n\nWarm regards,\nKhalil & Sons Jewellers\nShop #2, Murshid Sunaar Tower, Saddar, Karachi`);
      setTouched({});
    }
  }, [inquiry]);

  if (!isOpen || !inquiry) return null;

  const subjectValid = subject.trim().length >= 3;
  const bodyValid = body.trim().length >= 10;
  const isFormValid = subjectValid && bodyValid;

  const handleSend = async (e) => {
    e.preventDefault();
    setTouched({ subject: true, body: true });

    if (!isFormValid) {
      toast.error('Please complete the subject and message body before transmitting.');
      return;
    }

    setSubmitting(true);
    try {
      await replyToInquiry(inquiry._id, {
        subject: subject.trim(),
        message: body.trim(),
        sentBy: 'Khalil & Sons Concierge'
      });

      toast.success(`Reply successfully dispatched to ${inquiry.email}`);
      onReplied();
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to dispatch email reply.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-2xl flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-700 dark:text-amber-400 shrink-0">
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

        <div className="p-3.5 rounded-xl bg-muted/40 border border-border/80 text-xs text-muted-foreground space-y-1">
          <span className="font-semibold text-foreground block text-[11px] uppercase tracking-wider font-mono">
            Original Client Inquiry:
          </span>
          <p className="italic text-foreground/80 line-clamp-3">
            "{inquiry.message}"
          </p>
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
              className="w-full bg-muted/30 border border-input rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/15 transition-all"
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
              className="w-full bg-muted/30 border border-input rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/15 transition-all resize-y"
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
              className="bg-foreground text-background hover:bg-foreground/90 text-xs uppercase tracking-widest gap-2 font-medium"
            >
              {submitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin text-amber-500" />
                  <span>Transmitting Email...</span>
                </>
              ) : (
                <>
                  <Send className="size-3.5 text-amber-500" />
                  <span>Send Response</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
