import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { X, CheckCheckIcon, Crown, Calendar } from 'lucide-react'
import { Alert, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldLabel, FieldDescription, FieldError } from '@/components/ui/field'
import { submitInquiry } from '@/api/inquiryApi'
import { LuxuryButton } from './LuxuryButton'

const inquiryFormSchema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(7, 'Phone number must be at least 7 digits').max(20),
  jewelryType: z.enum(['Bridal Set', 'Custom Ring', 'Diamond Necklace', 'Bespoke Bracelet', 'Other']),
  preferredMetal: z.enum(['22K Gold', '21K Gold', '18K Gold', '18K White Gold', '18K Rose Gold']),
  estimatedBudget: z.string().min(2, 'Budget estimate is required').max(50),
  message: z.string().min(10, 'Please share at least 10 characters detailing your vision').max(1000),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'Please accept the terms to continue.'
  })
})

export function BespokeAppointmentModal({ isOpen, onClose }) {
  const form = useForm({
    resolver: zodResolver(inquiryFormSchema),
    defaultValues: {
      customerName: '',
      email: '',
      phone: '',
      jewelryType: 'Custom Ring',
      preferredMetal: '22K Gold',
      estimatedBudget: '$5,000 - $15,000',
      message: '',
      acceptTerms: false
    }
  })

  if (!isOpen) return null

  const onSubmit = async (values) => {
    try {
      const payload = {
        customerName: values.customerName,
        email: values.email,
        phone: values.phone,
        jewelryType: values.jewelryType,
        preferredMetal: values.preferredMetal,
        estimatedBudget: values.estimatedBudget,
        message: values.message
      }

      await submitInquiry(payload)
      toast.custom(() => (
        <Alert className="border-green-600 text-green-600 dark:border-green-400 dark:text-green-400 *:[svg]:row-span-1">
          <CheckCheckIcon />
          <AlertTitle>Appointment request booked successfully!</AlertTitle>
        </Alert>
      ))
      form.reset()
      onClose()
    } catch (err) {
      toast.error(err.message || 'Failed to submit appointment request')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <X className="size-4" />
        </button>

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
                  <input
                    id="appointment-phone"
                    type="tel"
                    {...field}
                    aria-invalid={fieldState.invalid}
                    placeholder="+39 055 123 4567"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background text-foreground shadow-xs focus:outline-none focus:ring-1 focus:ring-ring"
                  />
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
                  placeholder="e.g. $5,000 - $15,000"
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
              onClick={onClose}
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
      </div>
    </div>
  )
}
