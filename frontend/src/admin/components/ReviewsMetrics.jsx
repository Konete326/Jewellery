import React from 'react';
import { Star, MessageSquare, Gem, Award } from 'lucide-react';

export function ReviewsMetrics({ reviews = [], loading = false }) {
  const totalReviews = reviews.length;
  const fiveStars = reviews.filter((r) => Number(r.rating) === 5).length;
  const avgRating = totalReviews > 0
    ? (reviews.reduce((sum, r) => sum + (Number(r.rating) || 5), 0) / totalReviews).toFixed(1)
    : '5.0';
  const uniquePieces = new Set(reviews.map((r) => r.masterpieceId || r.masterpieceTitle)).size;

  const cards = [
    {
      title: 'Total Appraisals',
      value: loading ? '—' : `${totalReviews}`,
      subtext: 'Client reviews',
      icon: MessageSquare
    },
    {
      title: 'Average Rating',
      value: loading ? '—' : `${avgRating} ★`,
      subtext: 'All masterpieces',
      icon: Star
    },
    {
      title: '5-Star Excellence',
      value: loading ? '—' : `${fiveStars}`,
      subtext: totalReviews > 0 ? `${Math.round((fiveStars / totalReviews) * 100)}% satisfaction` : '100% satisfaction',
      icon: Award
    },
    {
      title: 'Pieces Reviewed',
      value: loading ? '—' : `${uniquePieces}`,
      subtext: 'Jewellery designs',
      icon: Gem
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="py-2 px-3 sm:px-3.5 rounded-xl border border-border/80 bg-card shadow-xs flex items-center justify-between gap-2.5"
          >
            <div className="min-w-0">
              <span className="text-[11px] font-medium text-muted-foreground block truncate">
                {card.title}
              </span>
              <span className="text-base sm:text-lg font-serif font-semibold tracking-tight text-foreground block">
                {card.value}
              </span>
              <p className="text-[10px] text-muted-foreground/75 truncate">{card.subtext}</p>
            </div>
            <Icon className="size-4 text-muted-foreground/60 shrink-0" />
          </div>
        );
      })}
    </div>
  );
}
