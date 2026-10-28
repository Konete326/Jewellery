import React from 'react';
import { Eye, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GalleryManagement } from './GalleryManagement';

export function GalleryAdminView() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-card/60 backdrop-blur-md p-5 sm:p-6 rounded-xl border border-border/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Karachi Atelier
            </Badge>
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground font-serif">
            Atelier Gallery Management
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Curate 22K/24K gold bridal masterpieces with real-time storefront synchronization and interactive card carousel.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" asChild className="cursor-pointer text-xs gap-1.5">
            <Link to="/gallery" target="_blank" rel="noopener noreferrer">
              <Eye className="size-3.5" />
              <span>View Live Storefront</span>
              <ArrowUpRight className="size-3 text-muted-foreground" />
            </Link>
          </Button>
        </div>
      </div>

      <GalleryManagement />
    </div>
  );
}
