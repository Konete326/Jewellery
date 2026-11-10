import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { X, Calendar, Copy, Check, MessageSquare, Clock, MapPin, Video, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import { submitInquiry, fetchBookedAppointmentSlots } from '@/api/inquiryApi'
import { normalizePhoneToE164, createWhatsAppInquiryUrl } from '@/utils/phone'
import { CountryCodeSelect } from './CountryCodeSelect'
import { getAuthUser } from '@/lib/auth'

const TIME_SLOTS = [
  '02:00 PM - 03:00 PM',
  '03:30 PM - 04:30 PM',
  '05:00 PM - 06:00 PM',
  '06:30 PM - 07:30 PM',
  '08:00 PM - 09:00 PM'
];

const appointmentFormSchema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(6, 'Phone number must be at least 6 digits').max(20),
  appointmentDate: z.string().min(1, 'Please select a preferred date'),
  appointmentSlot: z.string().min(1, 'Please select an appointment time slot'),
  consultationMode: z.enum(['In-Store Showroom', 'WhatsApp Video Call']),
  jewelryType: z.enum(['Bridal Set', 'Custom Ring', 'Diamond Necklace', 'Bespoke Bracelet', 'Other']),
  preferredMetal: z.enum(['22K Gold', '21K Gold', '18K Gold', '18K White Gold', '18K Rose Gold']),
  estimatedBudget: z.string().min(2, 'Budget estimate is required').max(50),
  message: z.string().max(1000).optional().default('')
});

export function BespokeAppointmentModal({ isOpen, onClose, piece = null }) {
  const [countryCode, setCountryCode] = useState('+92')
  const [bookingConfirmation, setBookingConfirmation] = useState(null)
  const [copiedCode, setCopiedCode] = useState(false)
  const [bookedSlots, setBookedSlots] = useState([])
  const [checkingSlots, setCheckingSlots] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const todayStr = new Date().toISOString().split('T')[0]

  const form = useForm({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      customerName: '',
      email: '',
      phone: '',
      appointmentDate: todayStr,
      appointmentSlot: '',
      consultationMode: 'In-Store Showroom',
      jewelryType: piece?.category === 'Bridal Sets' ? 'Bridal Set' : 'Custom Ring',
      preferredMetal: piece?.purity ? `${piece.purity} Gold` : '22K Gold',
      estimatedBudget: 'PKR 500,000 - 1,500,000',
      message: piece ? `Interested in consultation for: ${piece.title}` : ''
    }
  });

  const selectedDate = form.watch('appointmentDate')
  const selectedSlot = form.watch('appointmentSlot')
  const selectedMode = form.watch('consultationMode')

  useEffect(() => {
    if (isOpen) {
      const user = getAuthUser()
      if (user) {
        if (!form.getValues('customerName') && user.name) form.setValue('customerName', user.name)
        if (!form.getValues('email') && user.email) form.setValue('email', user.email)
        if (!form.getValues('phone') && user.phone) form.setValue('phone', user.phone)
      }
      if (piece) {
        form.setValue('message', `Showroom consultation requested for: ${piece.title} [Ref: ${piece._id || piece.id}]`)
      }
    }
  }, [isOpen, piece]);

  useEffect(() => {
    if (!isOpen || !selectedDate) return
    const [year, month, day] = selectedDate.split('-').map(Number)
    const dateObj = new Date(year, month - 1, day)
    if (dateObj.getDay() === 0) {
      toast.error('Our Saddar showroom is closed on Sundays. Please choose Monday to Saturday.')
      setBookedSlots(TIME_SLOTS)
      return
    }

    let isMounted = true
    setCheckingSlots(true)
    fetchBookedAppointmentSlots(selectedDate)
      .then((res) => {
        if (!isMounted) return
        const list = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : [])
        setBookedSlots(list)
      })
      .catch(() => {
        if (isMounted) setBookedSlots([])
      })
      .finally(() => {
        if (isMounted) setCheckingSlots(false)
      })

    return () => { isMounted = false }
  }, [isOpen, selectedDate]);

  if (!isOpen) return null

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(true)
    toast.success('Appointment reference code copied')
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const handleClose = () => {
    setBookingConfirmation(null)
    form.reset()
    onClose()
  }

  const handleSlotClick = (slot) => {
    if (bookedSlots.includes(slot)) {
      toast.error('Someone has already booked an appointment at this time. Please choose another slot.')
      return
    }
    form.setValue('appointmentSlot', slot, { shouldValidate: true })
  }

  const onSubmit = async (values) => {
    if (bookedSlots.includes(values.appointmentSlot)) {
      toast.error('This appointment time slot is already booked. Please select another slot.')
      return
    }

    setSubmitting(true)
    try {
      const fullPhone = normalizePhoneToE164(`${countryCode}${values.phone.trim()}`)
      const payload = {
        customerName: values.customerName.trim(),
        email: values.email.trim(),
        phone: fullPhone,
        requestType: 'Appointment',
        appointmentDate: values.appointmentDate,
        appointmentSlot: values.appointmentSlot,
        consultationMode: values.consultationMode,
        jewelryType: values.jewelryType,
        preferredMetal: values.preferredMetal,
        estimatedBudget: values.estimatedBudget,
        message: values.message?.trim() || 'Showroom consultation request',
        subject: `Showroom Appointment: ${values.appointmentDate} (${values.appointmentSlot})`,
        pieceId: piece?._id || piece?.id || '',
        pieceTitle: piece?.title || ''
      }

      const res = await submitInquiry(payload)
      const data = res?.data || res
      const generatedId = data?._id || data?.id || Date.now().toString().slice(-6)
      const refCode = `KS-APT-${String(generatedId).slice(-6).toUpperCase()}`

      setBookingConfirmation({
        refCode,
        email: values.email.trim(),
        customerName: values.customerName.trim(),
        appointmentDate: values.appointmentDate,
        appointmentSlot: values.appointmentSlot,
        consultationMode: values.consultationMode,
        jewelryType: values.jewelryType,
        preferredMetal: values.preferredMetal,
        budget: values.estimatedBudget
      })

      toast.success('Showroom Appointment Reserved', {
        description: `Booking reference dispatched to ${values.email.trim()}`
      })
    } catch (err) {
      if (err?.status === 409 || err?.message?.includes('already booked')) {
        toast.error('This time slot was just booked by another client. Please select another time.')
        fetchBookedAppointmentSlots(values.appointmentDate).then((res) => {
          setBookedSlots(Array.isArray(res?.data) ? res.data : [])
        }).catch(() => {})
      } else {
        toast.error(err.message || 'Failed to submit appointment request')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close modal backdrop"
        onClick={handleClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-xs cursor-default w-full h-full border-0 p-0 focus-visible:outline-none"
        tabIndex={-1}
      />
      <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <button
          type="button"
          aria-label="Close"
          onClick={handleClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer rounded-md p-1"
        >
          <X className="size-4" />
        </button>

        {bookingConfirmation ? (
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between pb-3 border-b border-border/70">
              <span className="font-mono text-[9px] uppercase tracking-widest text-amber-900/90 dark:text-amber-200 border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 rounded-full font-medium">
                AU · 916.6 · SADDAR SHOWROOM
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                Confirmed Slot
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-serif font-light text-foreground tracking-tight">
                Appointment Reserved
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Thank you, <strong className="text-foreground font-medium">{bookingConfirmation.customerName}</strong>. Your master consultation has been scheduled.
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
                Confirmation dispatched to <strong className="text-foreground font-medium">{bookingConfirmation.email}</strong>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-muted/40 border border-border/70 text-xs text-muted-foreground space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><Calendar className="size-3.5 text-amber-600" /> Date:</span>
                <span className="text-foreground font-medium">{bookingConfirmation.appointmentDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><Clock className="size-3.5 text-amber-600" /> Time Slot:</span>
                <span className="text-foreground font-mono font-medium">{bookingConfirmation.appointmentSlot}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><MapPin className="size-3.5 text-amber-600" /> Mode &amp; Venue:</span>
                <span className="text-foreground font-medium">{bookingConfirmation.consultationMode} (Saddar Karachi)</span>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between gap-3">
              <Button type="button" variant="outline" onClick={handleClose} className="h-9 px-4 text-xs cursor-pointer">
                Close
              </Button>

              <a
                href={createWhatsAppInquiryUrl(
                  '+923333213613',
                  bookingConfirmation.customerName,
                  `${bookingConfirmation.refCode} • Showroom Visit on ${bookingConfirmation.appointmentDate} at ${bookingConfirmation.appointmentSlot}`
                )}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl bg-foreground hover:bg-neutral-800 text-background text-xs font-medium transition-colors shadow-xs"
              >
                <MessageSquare className="size-3.5 text-amber-300" />
                WhatsApp Showroom (+92 333 3213613)
              </a>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-border">
              <div>
                <span className="px-2 py-0.5 rounded bg-black/85 text-amber-300 font-mono text-[9px] tracking-widest border border-amber-500/30 uppercase">
                  AU · 916.6 · SADDAR ATELIER
                </span>
                <h3 className="font-serif text-lg font-semibold text-foreground mt-1">
                  Book Showroom Consultation
                </h3>
              </div>
              {piece && (
                <div className="text-right max-w-[160px] truncate text-[11px] text-muted-foreground font-mono">
                  Piece: {piece.title}
                </div>
              )}
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Controller
                  name="customerName"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="flex-col items-start gap-1">
                      <FieldLabel htmlFor="appointment-name" className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Full Name *</FieldLabel>
                      <input
                        id="appointment-name"
                        {...field}
                        placeholder="e.g. Eleanor Vance"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-muted/30 text-foreground focus:outline-none focus:border-amber-500/60"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="flex-col items-start gap-1">
                      <FieldLabel htmlFor="appointment-email" className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Email Address *</FieldLabel>
                      <input
                        id="appointment-email"
                        type="email"
                        {...field}
                        placeholder="eleanor@domain.com"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-muted/30 text-foreground focus:outline-none focus:border-amber-500/60"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Controller
                  name="phone"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="flex-col items-start gap-1">
                      <FieldLabel htmlFor="appointment-phone" className="text-xs font-mono uppercase tracking-wider text-muted-foreground">WhatsApp / Phone *</FieldLabel>
                      <div className="flex gap-1.5 w-full">
                        <CountryCodeSelect value={countryCode} onChange={setCountryCode} />
                        <input
                          id="appointment-phone"
                          type="tel"
                          {...field}
                          placeholder="300 1234567"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-muted/30 text-foreground focus:outline-none focus:border-amber-500/60"
                        />
                      </div>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="consultationMode"
                  control={form.control}
                  render={({ field }) => (
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Consultation Mode</label>
                      <div className="grid grid-cols-2 gap-1.5 h-[38px]">
                        <button
                          type="button"
                          onClick={() => field.onChange('In-Store Showroom')}
                          className={`flex items-center justify-center gap-1 rounded-xl text-[11px] font-medium border cursor-pointer transition-colors ${
                            field.value === 'In-Store Showroom'
                              ? 'bg-foreground text-background border-foreground'
                              : 'bg-muted/30 text-muted-foreground border-input hover:text-foreground'
                          }`}
                        >
                          <MapPin className="size-3" />
                          <span>Showroom</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => field.onChange('WhatsApp Video Call')}
                          className={`flex items-center justify-center gap-1 rounded-xl text-[11px] font-medium border cursor-pointer transition-colors ${
                            field.value === 'WhatsApp Video Call'
                              ? 'bg-foreground text-background border-foreground'
                              : 'bg-muted/30 text-muted-foreground border-input hover:text-foreground'
                          }`}
                        >
                          <Video className="size-3" />
                          <span>Video Call</span>
                        </button>
                      </div>
                    </div>
                  )}
                />
              </div>

              <div className="space-y-2 p-3.5 rounded-xl border border-border/80 bg-muted/20">
                <div className="flex items-center justify-between">
                  <label htmlFor="appointment-date" className="text-xs font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="size-3.5 text-amber-600" />
                    <span>Select Date * (Mon - Sat)</span>
                  </label>
                  {checkingSlots && (
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-mono">
                      <Loader2 className="size-3 animate-spin text-amber-500" />
                      Checking slots...
                    </span>
                  )}
                </div>

                <Controller
                  name="appointmentDate"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <div>
                      <input
                        id="appointment-date"
                        type="date"
                        min={todayStr}
                        {...field}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background text-foreground focus:outline-none focus:border-amber-500/60"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </div>
                  )}
                />

                <div className="pt-2">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1">
                    <Clock className="size-3 text-amber-600" />
                    <span>Select Time Slot *</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    {TIME_SLOTS.map((slot) => {
                      const isBooked = bookedSlots.includes(slot)
                      const isSelected = selectedSlot === slot
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => handleSlotClick(slot)}
                          className={`px-2 py-1.5 rounded-lg text-[10px] font-mono border transition-all cursor-pointer flex flex-col items-center justify-center ${
                            isBooked
                              ? 'bg-destructive/10 text-destructive border-destructive/30 line-through opacity-70'
                              : isSelected
                              ? 'bg-foreground text-background border-foreground font-semibold shadow-xs'
                              : 'bg-background text-muted-foreground border-input hover:border-amber-500/50 hover:text-foreground'
                          }`}
                        >
                          <span>{slot}</span>
                          {isBooked && <span className="text-[8px] font-sans no-underline font-semibold">Reserved</span>}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Controller
                  name="jewelryType"
                  control={form.control}
                  render={({ field }) => (
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Jewellery Focus</label>
                      <select
                        {...field}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-muted/30 text-foreground focus:outline-none focus:border-amber-500/60"
                      >
                        <option value="Bridal Set">Bridal Jewellery Set</option>
                        <option value="Custom Ring">Solitaire &amp; Custom Ring</option>
                        <option value="Diamond Necklace">Polki / Diamond Necklace</option>
                        <option value="Bespoke Bracelet">Gold Bangles &amp; Kadas</option>
                        <option value="Other">Artisanal Bullion / Heirloom</option>
                      </select>
                    </div>
                  )}
                />

                <Controller
                  name="preferredMetal"
                  control={form.control}
                  render={({ field }) => (
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Purity / Metal</label>
                      <select
                        {...field}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-muted/30 text-foreground focus:outline-none focus:border-amber-500/60"
                      >
                        <option value="22K Gold">22K Pure Gold (AU · 916.6)</option>
                        <option value="21K Gold">21K Pure Gold (AU · 875.0)</option>
                        <option value="18K Gold">18K Yellow Gold</option>
                        <option value="18K White Gold">18K White Gold</option>
                        <option value="18K Rose Gold">18K Rose Gold</option>
                      </select>
                    </div>
                  )}
                />
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">
                  Shop #2, Murshid Sunaar Tower, Saddar
                </span>
                <div className="flex items-center gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={handleClose} disabled={submitting} className="text-xs">
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={submitting || !selectedSlot}
                    className="bg-foreground text-background hover:bg-foreground/90 text-xs uppercase tracking-widest gap-1.5 cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="size-3.5 animate-spin text-amber-500" />
                        <span>Confirming...</span>
                      </>
                    ) : (
                      <span>Reserve Appointment</span>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
