import React from 'react';
import { X, ZoomIn } from 'lucide-react';

export function MasterpieceLightboxModal({ isOpen, onClose, imageUrl, title, description }) {
  if (!isOpen || !imageUrl) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-5xl w-full max-h-[92vh] flex flex-col items-center bg-card rounded-2xl border border-border/80 overflow-hidden shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 size-10 rounded-full bg-black/60 text-white hover:bg-black/80 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="size-5" />
        </button>

        <div className="w-full flex-1 min-h-[380px] max-h-[75vh] bg-neutral-950 flex items-center justify-center overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="max-h-[75vh] w-auto max-w-full object-contain"
          />
        </div>

        <div className="w-full p-5 bg-card border-t border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="font-serif text-lg font-medium text-foreground">{title}</h3>
            {description && (
              <p className="text-xs text-muted-foreground font-light mt-0.5 max-w-2xl">
                {description}
              </p>
            )}
          </div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-amber-700 dark:text-amber-400 shrink-0">
            Florentine Archival Masterpiece
          </span>
        </div>
      </div>
    </div>
  );
}
