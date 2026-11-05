import React from 'react';
import { Search, Loader2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function TrackOrderSearchForm({
  orderNumber,
  phone,
  onOrderNumberChange,
  onPhoneChange,
  onSubmit,
  loading,
  onReset,
  hasData
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!loading) {
      onSubmit();
    }
  };

  const isFormValid = Boolean(orderNumber.trim() && phone.trim());

  return (
    <div className="w-full max-w-xl mx-auto rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-3">
          <div className="space-y-1">
            <label
              htmlFor="orderNumber"
              className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground"
            >
              Order Number
            </label>
            <input
              id="orderNumber"
              type="text"
              required
              autoComplete="off"
              spellCheck="false"
              placeholder="e.g. KS-861335-9871"
              value={orderNumber}
              onChange={(e) => onOrderNumberChange(e.target.value.toUpperCase())}
              disabled={loading}
              className="w-full h-10 px-3.5 rounded-lg border border-border/80 bg-background text-xs font-mono tracking-wide text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-amber-500/40 focus:border-amber-500/60 transition-all disabled:opacity-60"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="orderPhone"
              className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground"
            >
              Phone Number
            </label>
            <input
              id="orderPhone"
              type="tel"
              required
              autoComplete="tel"
              placeholder="e.g. 0300 1234567"
              value={phone}
              onChange={(e) => onPhoneChange(e.target.value)}
              disabled={loading}
              className="w-full h-10 px-3.5 rounded-lg border border-border/80 bg-background text-xs font-mono tracking-wide text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-amber-500/40 focus:border-amber-500/60 transition-all disabled:opacity-60"
            />
          </div>
        </div>

        <div className="pt-1 flex items-center gap-2">
          <Button
            type="submit"
            disabled={!isFormValid || loading}
            className="flex-1 h-10 text-xs font-medium bg-foreground text-background hover:bg-neutral-800 transition-colors cursor-pointer shadow-xs"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="size-3.5 animate-spin" />
                <span>Checking Status...</span>
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Search className="size-3.5" />
                <span>Track Order</span>
              </span>
            )}
          </Button>

          {hasData && (
            <Button
              type="button"
              variant="outline"
              onClick={onReset}
              className="h-10 px-3.5 text-xs font-mono text-muted-foreground hover:text-foreground cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="size-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
