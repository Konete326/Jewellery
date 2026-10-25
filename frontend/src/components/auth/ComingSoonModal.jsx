import { X, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ComingSoonModal({ isOpen, onClose, provider = "Social Provider" }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      <div className="relative w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-2xl text-card-foreground animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <X className="size-4" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
            <Crown className="size-6" />
          </div>

          <h3 className="font-semibold text-lg tracking-tight">
            {provider} Login Coming Soon
          </h3>

          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
            Social sign-in with {provider} will be available soon.
            Please use your email and password to sign in.
          </p>

          <div className="mt-6 w-full flex flex-col gap-2">
            <Button
              onClick={onClose}
              className="w-full bg-foreground text-background hover:opacity-90"
            >
              Continue With Email
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
