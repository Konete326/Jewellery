import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { X, Crown, Calendar, Copy, Check, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldLabel, FieldDescription, FieldError } from '@/components/ui/field'
import { submitInquiry } from '@/api/inquiryApi'
import { normalizePhoneToE164, createWhatsAppInquiryUrl } from '@/utils/phone'
import { LuxuryButton } from './LuxuryButton'
import { CountryCodeSelect } from './CountryCodeSelect'

const inquiryFormSchema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(6, 'Phone number must be at least 6 digits').max(20),
  jewelryType: z.enum(['Bridal Set', 'Custom Ring', 'Diamond Necklace', 'Bespoke Bracelet', 'Other']),
  preferredMetal: z.enum(['22K Gold', '21K Gold', '18K Gold', '18K White Gold', '18K Rose Gold']),
  estimatedBudget: z.string().min(2, 'Budget estimate is required').max(50),
  message: z.string().min(10, 'Please share at least 10 characters detailing your vision').max(1000),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'Please accept the terms to continue.'
  })
})

export function BespokeAppointmentModal({ isOpen, onClose }) {
  const [countryCode, setCountryCode] = useState('+92')
  const [bookingConfirmation, setBookingConfirmation] = useState(null)
  const [copiedCode, setCopiedCode] = useState(false)

  const form = useForm({
    resolver: zodResolver(inquiryFormSchema),
    defaultValues: {
      customerName: '',
      email: '',
      phone: '',
      jewelryType: 'Custom Ring',
      preferredMetal: '22K Gold',
      estimatedBudget: 'PKR 500,000 - 1,500,000',
      message: '',
      acceptTerms: false
    }
  })

  if (!isOpen) return null

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const handleClose = () => {
    setBookingConfirmation(null)
    form.reset()
    onClose()
  }

  const onSubmit = async (values) => {
    try {
      const fullPhone = normalizePhoneToE164(`${countryCode}${values.phone.trim()}`)
      const payload = {
        customerName: values.customerName.trim(),
        email: values.email.trim(),
        phone: fullPhone,
        jewelryType: values.jewelryType,
        preferredMetal: values.preferredMetal,
        estimatedBudget: values.estimatedBudget,
        message: values.message.trim(),
        subject: `Bespoke Appointment: ${values.jewelryType} (${values.preferredMetal})`
      }

      const res = await submitInquiry(payload)
      const generatedId = res?.data?._id || res?.data?.id || Date.now().toString().slice(-6)
      const refCode = `KS-APT-${String(generatedId).slice(-6).toUpperCase()}`

      setBookingConfirmation({
        refCode,
        email: values.email.trim(),
        customerName: values.customerName.trim(),
        jewelryType: values.jewelryType,
        preferredMetal: values.preferredMetal,
        budget: values.estimatedBudget
      })

      toast.success('Appointment Request Received', {
        description: `Confirmation dispatched to ${values.email.trim()}`
      })
    } catch (err) {
      toast.error(err.message || 'Failed to submit appointment request')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close modal backdrop"
        onClick={handleClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs cursor-default w-full h-full border-0 p-0 focus-visible:outline-none"
        tabIndex={-1}
      />
      <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <button
          type="button"
          aria-label="Close"
          onClick={handleClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:outline-none rounded-md"
        >
          <X className="size-4" />
        </button>

        {bookingConfirmation ? (
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between pb-3 border-b border-border/70">
              <span className="font-mono text-[9px] uppercase tracking-widest text-amber-900/90 dark:text-amber-200 border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 rounded-full font-medium">
                AU · APPOINTMENT RESERVED
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                Atelier Concierge
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-serif font-light text-foreground tracking-tight">
                Appointment Booked
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Thank you, <strong className="text-foreground font-medium">{bookingConfirmation.customerName}</strong>. Your consultation has been scheduled with our master jeweller.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-amber-500/25 bg-amber-500/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                  Booking Reference
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyCode(bookingConfirmation.refCode)}
                  className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {copiedCode ? <Check className="size-3 text-amber-700" /> : <Copy className="size-3" />}
                  {copiedCode ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div className="font-mono text-base font-semibold text-foreground tracking-wider">
                {bookingConfirmation.refCode}
              </div>
              <div className="text-xs text-muted-foreground pt-1 border-t border-amber-500/20">
                Official confirmation dispatched to{' '}
                <strong className="text-foreground font-medium underline underline-offset-2">
                  {bookingConfirmation.email}
                </strong>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-muted/40 border border-border/70 text-xs text-muted-foreground space-y-1.5">
              <div className="flex justify-between">
                <span>Jewellery Consultation:</span>
                <span className="text-foreground font-medium">{bookingConfirmation.jewelryType}</span>
              </div>
              <div className="flex justify-between">
                <span>Preferred Hallmark:</span>
                <span className="text-foreground font-medium">{bookingConfirmation.preferredMetal}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Range:</span>
                <span className="text-foreground font-mono font-medium">{bookingConfirmation.budget}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="h-9 px-4 text-xs cursor-pointer"
              >
                Close
              </Button>

              <a
                href={createWhatsAppInquiryUrl(
                  '+923331234567',
                  bookingConfirmation.customerName,
                  `${bookingConfirmation.refCode} - ${bookingConfirmation.jewelryType}`
                )}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl bg-foreground hover:bg-neutral-800 text-background text-xs font-medium transition-colors shadow-xs"
              >
                <MessageSquare className="size-3.5 text-amber-300" />
                WhatsApp Atelier
              </a>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-border">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600">
                <Crown className="size-4" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-semibold text-foreground">
                  Book an Appointment
                </h3>
                <p className="text-xs text-muted-foreground">
                  Meet with our jewelers in person or online for custom jewellery
                </p>
              </div>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <Controller
                name="customerName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="flex-col items-start">
                    <FieldLabel htmlFor="appointment-name">Full Name</FieldLabel>
                    <input
                      id="appointment-name"
                      {...field}
                      aria-invalid={fieldState.invalid}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background text-foreground shadow-xs focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="flex-col items-start">
                      <FieldLabel htmlFor="appointment-email">Email Address</FieldLabel>
                      <input
                        id="appointment-email"
                        type="email"
                        {...field}
                        aria-invalid={fieldState.invalid}
                        placeholder="sarah@example.com"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background text-foreground shadow-xs focus:outline-none focus:ring-1 focus:ring-ring"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="phone"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="flex-col items-start">
                      <FieldLabel htmlFor="appointment-phone">Phone / WhatsApp</FieldLabel>
                      <div className="flex gap-2 w-full">
                        <CountryCodeSelect
                          value={countryCode}
                          onChange={setCountryCode}
                        />
                        <input
                          id="appointment-phone"
                          type="tel"
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value.replace(/[^0-9\s\-()]/g, ''))}
                          aria-invalid={fieldState.invalid}
                          placeholder="333 1234567"
                          className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background text-foreground shadow-xs focus:outline-none focus:ring-1 focus:ring-ring"
                        />
                      </div>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Controller
                  name="jewelryType"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="flex-col items-start">
                      <FieldLabel htmlFor="appointment-type">Jewellery Type</FieldLabel>
                      <select
                        id="appointment-type"
                        {...field}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background text-foreground shadow-xs focus:outline-none focus:ring-1 focus:ring-ring"
                      >
                        <option value="Custom Ring">Custom Ring</option>
                        <option value="Bridal Set">Bridal Set</option>
                        <option value="Diamond Necklace">Diamond Necklace</option>
                        <option value="Bespoke Bracelet">Gold Bracelet</option>
                        <option value="Other">Other</option>
                      </select>
                    </Field>
                  )}
                />

                <Controller
                  name="preferredMetal"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="flex-col items-start">
                      <FieldLabel htmlFor="appointment-metal">Preferred Metal</FieldLabel>
                      <select
                        id="appointment-metal"
                        {...field}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background text-foreground shadow-xs focus:outline-none focus:ring-1 focus:ring-ring"
                      >
                        <option value="22K Gold">22K Gold (Traditional & Bridal)</option>
                        <option value="21K Gold">21K Gold (Heritage Standard)</option>
                        <option value="18K Gold">18K Yellow Gold</option>
                        <option value="18K White Gold">18K White Gold (Diamond Mounts)</option>
                        <option value="18K Rose Gold">18K Rose Gold</option>
                      </select>
                    </Field>
                  )}
                />
              </div>

              <Controller
                name="estimatedBudget"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="flex-col items-start">
                    <FieldLabel htmlFor="appointment-budget">Estimated Budget</FieldLabel>
                    <input
                      id="appointment-budget"
                      {...field}
                      aria-invalid={fieldState.invalid}
                      placeholder="e.g. PKR 500,000 - 1,500,000"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background text-foreground shadow-xs focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="message"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="flex-col items-start">
                    <FieldLabel htmlFor="appointment-message">Your Ideas & Requirements</FieldLabel>
                    <textarea
                      id="appointment-message"
                      rows={3}
                      {...field}
                      aria-invalid={fieldState.invalid}
                      placeholder="Tell us what you would like us to make, your preferred gemstones, or design ideas..."
                      className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background text-foreground shadow-xs focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="acceptTerms"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field orientation="horizontal" data-invalid={fieldState.invalid} className="flex-col items-start!">
                    <div className="flex gap-2">
                      <Checkbox
                        id="acceptTerms"
                        name={field.name}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        aria-invalid={fieldState.invalid}
                      />
                      <FieldLabel htmlFor="acceptTerms">Agree to Appointment Guidelines</FieldLabel>
                    </div>
                    <div className="flex flex-col gap-2">
                      <FieldDescription>
                        We will contact you shortly to confirm your preferred date and time.
                      </FieldDescription>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </div>
                  </Field>
                )}
              />

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={form.formState.isSubmitting}
                  className="px-4 py-2 text-xs font-medium rounded-lg border border-border bg-background hover:bg-muted text-foreground transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <LuxuryButton
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  variant="gold"
                  size="sm"
                  icon={<Calendar className="size-3.5 text-amber-200" />}
                >
                  {form.formState.isSubmitting ? 'Booking...' : 'Book Appointment'}
                </LuxuryButton>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
