import React, { useState, useEffect, useRef } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MasterpieceLightboxModal({
  isOpen,
  onClose,
  imageUrl,
  title = 'Haute Joaillerie Masterpiece',
  description
}) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (isOpen) {
      setZoomLevel(1);
      setPanOffset({ x: 0, y: 0 });
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-' || e.key === '_') {
        handleZoomOut();
      } else if (e.key === '0') {
        handleResetZoom();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, zoomLevel]);

  if (!isOpen || !imageUrl) return null;

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(2.5, Number((prev + 0.5).toFixed(1))));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => {
      const next = Math.max(1, Number((prev - 0.5).toFixed(1)));
      if (next === 1) setPanOffset({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleMouseDown = (e) => {
    if (zoomLevel <= 1) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - panOffset.x,
      y: e.clientY - panOffset.y
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging || zoomLevel <= 1) return;
    setPanOffset({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="High-resolution image inspection"
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-black/95 text-white backdrop-blur-xl animate-in fade-in duration-200 select-none overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <header className="w-full px-4 sm:px-8 py-4 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between gap-4 z-20">
        <div className="flex items-center gap-3 min-w-0">
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-300 font-mono text-[10px] uppercase tracking-widest shrink-0">
            <span>AU · 916.6</span>
            <span className="text-amber-500/40">•</span>
            <span>4K INSPECT</span>
          </div>
          <div className="min-w-0">
            <h3 className="font-serif text-sm sm:text-base font-medium truncate text-neutral-100">
              {title}
            </h3>
            <p className="text-[10px] sm:text-xs text-neutral-400 font-mono uppercase tracking-wider hidden sm:block">
              Drag to pan · Double resolution atelier inspection
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div className="flex items-center rounded-xl border border-white/15 bg-white/5 p-1 backdrop-blur-md">
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoomLevel <= 1}
              className="p-1.5 sm:p-2 rounded-lg text-neutral-300 hover:text-white hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
              title="Zoom out (-)"
            >
              <ZoomOut className="size-4" />
            </button>

            <span className="px-2 font-mono text-xs text-amber-300 min-w-[50px] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>

            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoomLevel >= 2.5}
              className="p-1.5 sm:p-2 rounded-lg text-neutral-300 hover:text-white hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
              title="Zoom in (+)"
            >
              <ZoomIn className="size-4" />
            </button>

            <button
              type="button"
              onClick={handleResetZoom}
              className="p-1.5 sm:p-2 rounded-lg text-neutral-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Reset 100% (0)"
            >
              <RotateCcw className="size-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="size-9 sm:size-10 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer shadow-xs"
            title="Close inspection (Esc)"
          >
            <X className="size-5" />
          </button>
        </div>
      </header>

      <main
        className="flex-1 w-full relative flex items-center justify-center overflow-hidden cursor-default"
        onMouseDown={handleMouseDown}
      >
        <div
          className={cn(
            'transition-transform will-change-transform flex items-center justify-center max-h-full max-w-full',
            isDragging ? 'cursor-grabbing duration-0' : 'cursor-grab duration-200'
          )}
          style={{
            transform: `translate3d(${panOffset.x}px, ${panOffset.y}px, 0) scale(${zoomLevel})`
          }}
        >
          <img
            src={imageUrl}
            alt={title}
            draggable={false}
            className="max-h-[80vh] max-w-[90vw] object-contain rounded-lg shadow-2xl pointer-events-none"
          />
        </div>

        {zoomLevel === 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none px-3.5 py-1.5 rounded-full bg-black/60 border border-white/10 text-[11px] font-mono text-neutral-300 backdrop-blur-md">
            Click + to inspect micro gold filigree at 200% resolution
          </div>
        )}
      </main>

      <footer className="w-full px-4 sm:px-8 py-3 bg-gradient-to-t from-black/80 to-transparent flex flex-col sm:flex-row items-center justify-between gap-2 z-20">
        <p className="text-xs text-neutral-400 font-light text-center sm:text-left line-clamp-1">
          {description || 'Certified handcrafted 22K and 24K gold jewellery heirloom by Khalil & Sons Jewellers, Karachi.'}
        </p>
        <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 shrink-0">
          Saddar Karachi Atelier Inspection
        </span>
      </footer>
    </div>
  );
}

export default MasterpieceLightboxModal;
