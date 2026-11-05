import React from 'react';
import { Check, MapPin, Sparkles } from 'lucide-react';
import { getVerifiedStoreProfile } from '@/utils/storeConfig';

const TRACKING_STEPS = [
  { key: 'Pending', label: 'Order Received' },
  { key: 'Confirmed', label: 'Rate Locked' },
  { key: 'Processing', label: 'In Workshop' },
  { key: 'Ready', label: 'Ready for Pickup' },
  { key: 'Delivered', label: 'Picked Up' }
];

export function TrackOrderStatusTimeline({ order }) {
  if (!order) return null;

  const storeProfile = getVerifiedStoreProfile();
  const currentStatus = order.orderStatus || 'Pending';
  const isReady = currentStatus === 'Ready';
  const isDelivered = currentStatus === 'Delivered';

  const currentIndex = TRACKING_STEPS.findIndex((s) => s.key === currentStatus);
  const activeIndex = currentIndex === -1 ? 0 : currentIndex;

  const formattedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : '';

  const getStatusBadge = () => {
    switch (currentStatus) {
      case 'Ready':
        return 'border-teal-500/30 bg-teal-500/10 text-teal-700 dark:text-teal-300';
      case 'Delivered':
        return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300';
      case 'Processing':
        return 'border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-300';
      case 'Confirmed':
        return 'border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300';
      case 'Cancelled':
        return 'border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300';
      default:
        return 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300';
    }
  };

  return (
    <div className="w-full rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-serif text-lg sm:text-xl font-medium text-foreground">
              Order #{order.orderNumber}
            </h3>
            <span
              className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] uppercase font-semibold border ${getStatusBadge()}`}
            >
              {currentStatus === 'Ready' ? 'Ready for Pickup' : currentStatus === 'Delivered' ? 'Picked Up' : currentStatus}
            </span>
          </div>
          <p className="text-xs text-muted-foreground font-mono mt-0.5">
            Booked on {formattedDate} • Showroom Pickup
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
          <MapPin className="size-3.5 text-amber-700 dark:text-amber-400 shrink-0" />
          <span className="truncate">{storeProfile.hub || 'Saddar, Karachi'}</span>
        </div>
      </div>

      {isReady && (
        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-2">
          <div className="flex items-center gap-2 text-foreground font-serif text-base font-medium">
            <Sparkles className="size-4 text-amber-600 shrink-0" />
            <span>Ready for Showroom Pickup</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your jewellery has completed crafting and purity testing. It is ready for you to pick up at {storeProfile.address || 'our Saddar, Karachi showroom'}.
          </p>
          <div className="pt-1 text-[11px] font-mono text-muted-foreground flex items-center gap-3 flex-wrap">
            {storeProfile.openingHours && <span>Hours: {storeProfile.openingHours}</span>}
            {storeProfile.openingHours && <span>•</span>}
            <span>Ref: {order.orderNumber}</span>
          </div>
        </div>
      )}

      {isDelivered && (
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-2">
          <div className="flex items-center gap-2 text-foreground font-serif text-base font-medium">
            <Check className="size-4 text-emerald-600 shrink-0" />
            <span>Order Picked Up</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            This order has been picked up by the customer at our Saddar showroom.
          </p>
        </div>
      )}

      {currentStatus === 'Cancelled' && (
        <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/5 space-y-1">
          <h4 className="font-serif text-sm font-medium text-rose-800 dark:text-rose-300">
            Order Cancelled
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            This order has been cancelled. For any questions regarding payment or details, please contact our Saddar showroom.
          </p>
        </div>
      )}

      {currentStatus !== 'Cancelled' && (
        <div className="py-2">
          <div className="grid grid-cols-5 gap-1 sm:gap-2">
            {TRACKING_STEPS.map((step, idx) => {
              const isCompleted = idx < activeIndex || isDelivered;
              const isCurrent = idx === activeIndex && !isDelivered;

              return (
                <div key={step.key} className="flex flex-col items-center text-center space-y-2">
                  <div
                    className={`w-full h-1.5 rounded-full transition-colors ${
                      isCompleted
                        ? 'bg-emerald-600'
                        : isCurrent
                        ? 'bg-amber-600'
                        : 'bg-muted'
                    }`}
                  />
                  <span
                    className={`text-[10px] sm:text-[11px] font-mono uppercase tracking-wider leading-tight ${
                      isCurrent
                        ? 'text-foreground font-semibold'
                        : isCompleted
                        ? 'text-emerald-700 dark:text-emerald-400'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
