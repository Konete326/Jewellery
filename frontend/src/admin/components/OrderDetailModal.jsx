import React, { useState, useEffect } from 'react';
import {
  X,
  PackageCheck,
  Check,
  Copy,
  MessageCircle,
  ShieldCheck,
  Lock,
  Unlock,
  Truck,
  Store,
  CreditCard,
  FileText,
  User,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatPKR } from '@/utils/pricing';
import { openWhatsAppChat } from '@/utils/whatsapp';
import { toast } from 'sonner';

const ORDER_STATUS_OPTIONS = [
  'Pending',
  'Confirmed',
  'Processing',
  'Ready',
  'Delivered',
  'Cancelled'
];

const PAYMENT_STATUS_OPTIONS = ['Unpaid', 'Partial', 'Paid', 'Refunded'];

export function OrderDetailModal({ isOpen, onClose, onSave, order, loading }) {
  const [formData, setFormData] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (order) {
      setFormData({
        orderStatus: order.orderStatus || 'Pending',
        paymentStatus: order.paymentStatus || 'Unpaid',
        isAvailabilityVerified: Boolean(order.isAvailabilityVerified),
        totalAmount: Number(order.totalAmount) || 0,
        advancePaid: Number(order.advancePaid) || 0,
        balanceDue:
          order.balanceDue !== undefined
            ? Number(order.balanceDue)
            : Math.max(0, (Number(order.totalAmount) || 0) - (Number(order.advancePaid) || 0)),
        goldRateLock: {
          isLocked: Boolean(order.goldRateLock?.isLocked),
          lockedRate: Number(order.goldRateLock?.lockedRate) || 0,
          karat: order.goldRateLock?.karat || '22K'
        },
        paymentDetails: {
          method: order.paymentDetails?.method || 'Bank Transfer',
          transactionRef: order.paymentDetails?.transactionRef || '',
          bankName: order.paymentDetails?.bankName || ''
        },
        tracking: {
          courier: order.tracking?.courier || '',
          trackingNumber: order.tracking?.trackingNumber || ''
        },
        internalNotes: order.internalNotes || '',
        customerNote: order.customerNote || ''
      });
    }
  }, [order, isOpen]);

  if (!isOpen || !order || !formData) return null;

  const handleCopyOrderNumber = () => {
    navigator.clipboard.writeText(order.orderNumber);
    setCopied(true);
    toast.success('Order number copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAdvanceChange = (val) => {
    const num = Math.max(0, Number(val) || 0);
    const balance = Math.max(0, formData.totalAmount - num);
    setFormData((prev) => ({
      ...prev,
      advancePaid: num,
      balanceDue: balance,
      paymentStatus:
        num === 0
          ? 'Unpaid'
          : num >= prev.totalAmount
          ? 'Paid'
          : 'Partial'
    }));
  };

  const handleWhatsAppCustomer = () => {
    const custName = order.customer?.name || 'Valued Patron';
    const num = order.orderNumber;
    const ordStatus = formData.orderStatus;
    const payStatus = formData.paymentStatus;
    const balance = formatPKR(formData.balanceDue);
    const rateNote = formData.goldRateLock.isLocked
      ? `\n🔒 *Gold Rate Locked:* ${formData.goldRateLock.karat} @ PKR ${formData.goldRateLock.lockedRate?.toLocaleString()} / tola`
      : '';
    const trackingNote = formData.tracking.trackingNumber
      ? `\n🚚 *Tracking:* ${formData.tracking.courier || 'Courier'} - ${formData.tracking.trackingNumber}`
      : '';

    const msg = `Dear *${custName}*,\n\nGreetings from *Khalil & Sons Jewellers*, Saddar, Karachi.\n\nRegarding your Order *${num}*:\n• *Order Status:* ${ordStatus}\n• *Payment Status:* ${payStatus} (Balance Due: ${balance})${rateNote}${trackingNote}\n\nOur master goldsmiths are ensuring your heirloom jewellery meets our authentic Mughal hallmark standards. Please feel free to reach out for any further custom adjustments.`;

    const cleanPhone = (order.customer?.phone || '').replace(/[^\d+]/g, '');
    openWhatsAppChat(msg, cleanPhone);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(order._id, formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <button
        type="button"
        aria-label="Close backdrop"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs cursor-default w-full h-full border-0 p-0 focus-visible:outline-none"
        tabIndex={-1}
      />

      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer focus-visible:outline-none rounded-md"
        >
          <X className="size-4" />
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-border/80">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full border border-border bg-muted/40 flex items-center justify-center text-foreground shrink-0">
              <PackageCheck className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg sm:text-xl font-semibold text-foreground">
                  Order {order.orderNumber}
                </h3>
                <button
                  type="button"
                  onClick={handleCopyOrderNumber}
                  className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  title="Copy Order Number"
                >
                  {copied ? <Check className="size-3 text-amber-600" /> : <Copy className="size-3" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground font-mono">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleWhatsAppCustomer}
              className="h-8 px-3 text-xs gap-1.5 cursor-pointer text-emerald-700 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
            >
              <MessageCircle className="size-3.5" />
              <span>WhatsApp Update</span>
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl border border-border/80 bg-muted/20">
            <div className="space-y-1 text-xs">
              <span className="font-mono uppercase tracking-wider text-[10px] text-muted-foreground block mb-1">
                Client Contact Information
              </span>
              <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
                <User className="size-3.5 text-muted-foreground" />
                <span>{order.customer?.name}</span>
              </p>
              <p className="text-muted-foreground flex items-center gap-1.5">
                <Mail className="size-3.5 text-muted-foreground" />
                <a href={`mailto:${order.customer?.email}`} className="hover:underline">
                  {order.customer?.email}
                </a>
              </p>
              <p className="text-muted-foreground flex items-center gap-1.5 font-mono">
                <Phone className="size-3.5 text-muted-foreground" />
                <a href={`tel:${order.customer?.phone}`} className="hover:underline">
                  {order.customer?.phone}
                </a>
              </p>
            </div>

            <div className="space-y-1 text-xs">
              <span className="font-mono uppercase tracking-wider text-[10px] text-muted-foreground block mb-1">
                Fulfillment & Destination
              </span>
              <div className="flex items-center gap-1.5">
                {order.fulfillmentType === 'Showroom Pickup' ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono border border-border/80 bg-background text-foreground font-medium">
                    <Store className="size-3" />
                    <span>Showroom Pickup (Saddar Flagship)</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono border border-border/80 bg-background text-foreground font-medium">
                    <Truck className="size-3" />
                    <span>Insured Delivery</span>
                  </span>
                )}
              </div>
              <p className="text-muted-foreground flex items-start gap-1.5 mt-1">
                <MapPin className="size-3.5 text-muted-foreground shrink-0 mt-0.5" />
                <span>
                  {order.customer?.shippingAddress || 'Murshid Sunaar Tower, Dr. Daud Pota Road, Saddar, Karachi'}
                  {order.customer?.city ? `, ${order.customer.city}` : ''}
                </span>
              </p>
              {order.customerNote && (
                <p className="text-[11px] text-muted-foreground italic mt-1 bg-background/80 p-2 rounded-lg border border-border/60">
                  Note: "{order.customerNote}"
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <span className="font-mono uppercase tracking-wider text-xs text-muted-foreground block">
              Ordered Masterpieces ({order.items?.length || 0})
            </span>
            <div className="divide-y divide-border/60 rounded-xl border border-border/80 bg-card overflow-hidden">
              {order.items?.map((item, index) => (
                <div key={index} className="p-3 sm:px-4 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="size-10 rounded-lg object-cover border border-border/80 shrink-0"
                      />
                    ) : (
                      <div className="size-10 rounded-lg border border-border/80 bg-muted/40 flex items-center justify-center shrink-0">
                        <PackageCheck className="size-4 text-muted-foreground" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <h4 className="font-serif font-medium text-foreground truncate text-sm">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-muted-foreground font-mono">
                        {item.purity || '22K'} • {item.category || 'Fine Jewellery'} • Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono font-medium text-foreground text-sm block">
                      {formatPKR(item.price * item.quantity)}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      @{formatPKR(item.price)} each
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl border border-border/80 bg-card space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono uppercase tracking-wider text-xs text-foreground font-medium flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-amber-600" />
                <span>Step 4: Product Availability Verification</span>
              </span>
              <label className="flex items-center gap-2 cursor-pointer text-xs select-none">
                <input
                  type="checkbox"
                  checked={formData.isAvailabilityVerified}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isAvailabilityVerified: e.target.checked
                    }))
                  }
                  className="rounded border-border text-amber-600 focus:ring-amber-500/30"
                />
                <span className="font-medium text-foreground">Verified in Inventory / Workshop</span>
              </label>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-border/80 bg-card space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono uppercase tracking-wider text-xs text-foreground font-medium flex items-center gap-1.5">
                {formData.goldRateLock.isLocked ? (
                  <Lock className="size-4 text-amber-600" />
                ) : (
                  <Unlock className="size-4 text-muted-foreground" />
                )}
                <span>Step 5: Gold Rate-Lock Verification</span>
              </span>
              <label className="flex items-center gap-2 cursor-pointer text-xs select-none">
                <input
                  type="checkbox"
                  checked={formData.goldRateLock.isLocked}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      goldRateLock: {
                        ...prev.goldRateLock,
                        isLocked: e.target.checked,
                        lockedAt: e.target.checked ? new Date() : null
                      }
                    }))
                  }
                  className="rounded border-border text-amber-600 focus:ring-amber-500/30"
                />
                <span className="font-medium text-foreground">Lock Gold Price Benchmark</span>
              </label>
            </div>

            {formData.goldRateLock.isLocked && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border/60">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-muted-foreground">
                    Locked Rate / Tola (PKR)
                  </label>
                  <input
                    type="number"
                    value={formData.goldRateLock.lockedRate || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        goldRateLock: {
                          ...prev.goldRateLock,
                          lockedRate: Number(e.target.value) || 0
                        }
                      }))
                    }
                    placeholder="e.g. 422000"
                    className="w-full bg-background border border-input rounded-lg px-3 py-1.5 text-xs font-mono text-foreground"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-muted-foreground">
                    Assay Purity Standard
                  </label>
                  <select
                    value={formData.goldRateLock.karat}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        goldRateLock: {
                          ...prev.goldRateLock,
                          karat: e.target.value
                        }
                      }))
                    }
                    className="w-full bg-background border border-input rounded-lg px-3 py-1.5 text-xs text-foreground cursor-pointer"
                  >
                    <option value="22K">22K Bridal (.916)</option>
                    <option value="21K">21K Heritage (.875)</option>
                    <option value="18K">18K Modern (.750)</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 rounded-xl border border-border/80 bg-card space-y-3">
            <span className="font-mono uppercase tracking-wider text-xs text-foreground font-medium flex items-center gap-1.5">
              <CreditCard className="size-4 text-amber-600" />
              <span>Step 6: Payment & Advance Verification</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase text-muted-foreground">
                  Payment Status
                </label>
                <select
                  value={formData.paymentStatus}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, paymentStatus: e.target.value }))
                  }
                  className="w-full bg-background border border-input rounded-lg px-3 py-2 text-xs font-medium text-foreground cursor-pointer"
                >
                  {PAYMENT_STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase text-muted-foreground">
                  Advance Paid (PKR)
                </label>
                <input
                  type="number"
                  value={formData.advancePaid}
                  onChange={(e) => handleAdvanceChange(e.target.value)}
                  className="w-full bg-background border border-input rounded-lg px-3 py-2 text-xs font-mono text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase text-muted-foreground">
                  Balance Due (PKR)
                </label>
                <input
                  type="text"
                  readOnly
                  value={formatPKR(formData.balanceDue)}
                  className="w-full bg-muted/40 border border-input rounded-lg px-3 py-2 text-xs font-mono font-semibold text-foreground cursor-default"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border/60">
              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase text-muted-foreground">
                  Payment Channel
                </label>
                <input
                  type="text"
                  value={formData.paymentDetails.method}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      paymentDetails: { ...prev.paymentDetails, method: e.target.value }
                    }))
                  }
                  placeholder="e.g. Meezan Bank / Raast"
                  className="w-full bg-background border border-input rounded-lg px-3 py-1.5 text-xs text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase text-muted-foreground">
                  Transaction / Deposit Reference
                </label>
                <input
                  type="text"
                  value={formData.paymentDetails.transactionRef}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      paymentDetails: { ...prev.paymentDetails, transactionRef: e.target.value }
                    }))
                  }
                  placeholder="e.g. TID-9821820"
                  className="w-full bg-background border border-input rounded-lg px-3 py-1.5 text-xs font-mono text-foreground"
                />
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-border/80 bg-card space-y-3">
            <span className="font-mono uppercase tracking-wider text-xs text-foreground font-medium flex items-center gap-1.5">
              <FileText className="size-4 text-amber-600" />
              <span>Step 7-9: Order Workflow Status & Tracking</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase text-muted-foreground">
                  Order Status
                </label>
                <select
                  value={formData.orderStatus}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, orderStatus: e.target.value }))
                  }
                  className="w-full bg-background border border-input rounded-lg px-3 py-2 text-xs font-medium text-foreground cursor-pointer"
                >
                  {ORDER_STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase text-muted-foreground">
                  Courier / Transit Partner
                </label>
                <input
                  type="text"
                  value={formData.tracking.courier}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      tracking: { ...prev.tracking, courier: e.target.value }
                    }))
                  }
                  placeholder="e.g. TCS / Leopards / Atelier Valet"
                  className="w-full bg-background border border-input rounded-lg px-3 py-2 text-xs text-foreground"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase text-muted-foreground">
                  Tracking Number / Airway Bill
                </label>
                <input
                  type="text"
                  value={formData.tracking.trackingNumber}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      tracking: { ...prev.tracking, trackingNumber: e.target.value }
                    }))
                  }
                  placeholder="e.g. 770182910"
                  className="w-full bg-background border border-input rounded-lg px-3 py-2 text-xs font-mono text-foreground"
                />
              </div>
            </div>

            <div className="space-y-1 pt-2 border-t border-border/60">
              <label className="text-[11px] font-mono uppercase text-muted-foreground">
                Step 8: Atelier Workshop Notes (Internal Preparation Log)
              </label>
              <textarea
                rows={2}
                value={formData.internalNotes}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, internalNotes: e.target.value }))
                }
                placeholder="e.g. Ring sized to 14, hallmarked AU 916.6, cleaned and packed in velvet casket."
                className="w-full bg-background border border-input rounded-lg p-2.5 text-xs text-foreground"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-border/80 flex items-center justify-between gap-3">
            <span className="text-xs text-muted-foreground font-mono">
              Total Order Amount: <strong className="text-foreground">{formatPKR(formData.totalAmount)}</strong>
            </span>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                disabled={loading}
                className="h-9 px-4 text-xs cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="h-9 px-5 text-xs bg-foreground text-background hover:bg-neutral-800 cursor-pointer shadow-xs"
              >
                {loading ? 'Saving...' : 'Save Order Updates'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
