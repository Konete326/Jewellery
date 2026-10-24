import React from 'react';
import { Sparkles, Eye, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GalleryManagement } from './GalleryManagement';

export function GalleryAdminView() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-linear-to-r from-amber-500/10 via-amber-500/5 to-transparent p-5 rounded-xl border border-amber-500/20">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/20 text-amber-700 dark:text-amber-300 mb-2">
            <Sparkles className="size-3" />
            <span>Masterpiece Curation & Provenance</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground font-serif">
            Atelier Gallery Management
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Curate and manage the high-jewelry showcases synchronized with Cloudinary and the live client carousel.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            to="/gallery"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg border border-border bg-background hover:bg-muted text-foreground transition-colors shadow-xs"
          >
            <Eye className="size-3.5" />
            <span>Preview Client Slider</span>
            <ArrowRight className="size-3" />
          </Link>
        </div>
      </div>

      <GalleryManagement />
    </div>
  );
}
