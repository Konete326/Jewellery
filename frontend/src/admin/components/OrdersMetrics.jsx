import React from 'react';
import { PackageCheck, Clock, Hammer, CheckCircle2, AlertCircle } from 'lucide-react';
import { formatPKR } from '@/utils/pricing';

export function OrdersMetrics({ orders = [] }) {
  const total = orders.length;
  const pendingCount = orders.filter((o) => o.orderStatus === 'Pending').length;
  const inWorkshopCount = orders.filter(
    (o) => o.orderStatus === 'Confirmed' || o.orderStatus === 'Processing'
  ).length;
  const readyOrDelivered = orders.filter(
    (o) => o.orderStatus === 'Ready' || o.orderStatus === 'Delivered'
  ).length;
  const unpaidOrPartial = orders.filter(
    (o) => o.paymentStatus === 'Unpaid' || o.paymentStatus === 'Partial'
  ).length;

  const totalValue = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

  const cards = [
    {
      label: 'Total Orders',
      value: total,
      sub: `${formatPKR(totalValue)} volume`,
      icon: PackageCheck,
      badgeText: 'ALL TIME',
      badgeClass: 'border-border/80 bg-muted/30 text-foreground'
    },
    {
      label: 'Pending Verification',
      value: pendingCount,
      sub: 'Awaiting atelier review',
      icon: Clock,
      badgeText: 'STEP 1-3',
      badgeClass: 'border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300'
    },
    {
      label: 'In Atelier Workshop',
      value: inWorkshopCount,
      sub: 'Confirmed & processing',
      icon: Hammer,
      badgeText: 'ACTIVE CRAFT',
      badgeClass: 'border-neutral-400/30 bg-muted/60 text-foreground'
    },
    {
      label: 'Ready & Delivered',
      value: readyOrDelivered,
      sub: 'Completed fulfillment',
      icon: CheckCircle2,
      badgeText: 'DISPATCHED',
      badgeClass: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300'
    },
    {
      label: 'Payment Pending',
      value: unpaidOrPartial,
      sub: 'Unpaid or partial advance',
      icon: AlertCircle,
      badgeText: 'SETTLEMENT',
      badgeClass: 'border-rose-500/25 bg-rose-500/10 text-rose-700 dark:text-rose-400'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
      {cards.map((c, i) => {
        const IconComponent = c.icon;
        return (
          <div
            key={i}
            className="p-4 rounded-xl border border-border/80 bg-card/60 backdrop-blur-xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">{c.label}</span>
              <span
                className={`text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border font-medium ${c.badgeClass}`}
              >
                {c.badgeText}
              </span>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-2xl font-bold tracking-tight text-foreground">
                  {c.value}
                </span>
                <IconComponent className="size-3.5 text-muted-foreground/60 inline-block" />
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5 font-light">{c.sub}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
