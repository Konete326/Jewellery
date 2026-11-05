import React from 'react';
import { Truck } from 'lucide-react';

const ORDER_STATUS_OPTIONS = [
  'Pending',
  'Confirmed',
  'Processing',
  'Ready',
  'Delivered',
  'Cancelled'
];

export function OrderLogisticsSection({ formData, onChange }) {
  const tracking = formData.tracking || {};

  const handleStatusChange = (val) => {
    onChange((prev) => ({
      ...prev,
      orderStatus: val
    }));
  };

  const handleCourierChange = (val) => {
    onChange((prev) => ({
      ...prev,
      tracking: {
        ...prev.tracking,
        courier: val
      }
    }));
  };

  const handleTrackingNumChange = (val) => {
    onChange((prev) => ({
      ...prev,
      tracking: {
        ...prev.tracking,
        trackingNumber: val
      }
    }));
  };

  const handleNotesChange = (val) => {
    onChange((prev) => ({
      ...prev,
      internalNotes: val
    }));
  };

  return (
    <div className="p-3.5 sm:p-4 rounded-xl border border-border/80 bg-card space-y-3.5">
      <div className="flex items-center justify-between">
        <span className="font-mono uppercase tracking-wider text-xs text-foreground font-medium flex items-center gap-1.5">
          <Truck className="size-3.5 text-amber-600 shrink-0" />
          <span>Fulfillment & Atelier Workshop Log</span>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="space-y-1">
          <label className="text-[10px] font-mono uppercase text-muted-foreground block">
            Order Status
          </label>
          <select
            value={formData.orderStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="w-full bg-background border border-input rounded-lg px-2.5 py-1.5 text-xs font-medium text-foreground cursor-pointer focus:ring-1 focus:ring-amber-500/40 focus:border-amber-500/60 outline-none"
          >
            {ORDER_STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-mono uppercase text-muted-foreground block">
            Transit Partner
          </label>
          <input
            type="text"
            value={tracking.courier || ''}
            onChange={(e) => handleCourierChange(e.target.value)}
            placeholder="e.g. TCS / Leopards / Atelier Valet"
            className="w-full bg-background border border-input rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:ring-1 focus:ring-amber-500/40 focus:border-amber-500/60 outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-mono uppercase text-muted-foreground block">
            Tracking / Airway Bill
          </label>
          <input
            type="text"
            value={tracking.trackingNumber || ''}
            onChange={(e) => handleTrackingNumChange(e.target.value)}
            placeholder="e.g. 770182910"
            className="w-full bg-background border border-input rounded-lg px-2.5 py-1.5 text-xs font-mono text-foreground focus:ring-1 focus:ring-amber-500/40 focus:border-amber-500/60 outline-none"
          />
        </div>
      </div>

      <div className="space-y-1 pt-2.5 border-t border-border/60">
        <label className="text-[10px] font-mono uppercase text-muted-foreground block">
          Workshop Preparation Notes (Internal Goldsmith Log)
        </label>
        <textarea
          rows={2}
          value={formData.internalNotes || ''}
          onChange={(e) => handleNotesChange(e.target.value)}
          placeholder="e.g. Ring sized to 14, hallmarked AU · 916.6, cleaned and placed in velvet casket."
          className="w-full bg-background border border-input rounded-lg p-2.5 text-xs text-foreground focus:ring-1 focus:ring-amber-500/40 focus:border-amber-500/60 outline-none resize-none"
        />
      </div>
    </div>
  );
}
