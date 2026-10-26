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
      subtext: 'Client reviews received',
      icon: MessageSquare,
      color: 'text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800'
    },
    {
      title: 'Average Rating',
      value: loading ? '—' : `${avgRating} ★`,
      subtext: 'Across all masterpieces',
      icon: Star,
      color: 'text-yellow-500 bg-yellow-500/10'
    },
    {
      title: '5-Star Excellence',
      value: loading ? '—' : `${fiveStars}`,
      subtext: totalReviews > 0 ? `${Math.round((fiveStars / totalReviews) * 100)}% of total reviews` : '100% satisfaction',
      icon: Award,
      color: 'text-emerald-500 bg-emerald-500/10'
    },
    {
      title: 'Pieces Reviewed',
      value: loading ? '—' : `${uniquePieces}`,
      subtext: 'Distinct jewelry designs',
      icon: Gem,
      color: 'text-sky-500 bg-sky-500/10'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="p-4 sm:p-5 rounded-xl border border-border bg-card shadow-xs flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground">{card.title}</span>
              <div className={`size-8 rounded-lg ${card.color} flex items-center justify-center shrink-0`}>
                <Icon className="size-4" />
              </div>
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground font-serif">
                {card.value}
              </span>
              <p className="text-[11px] text-muted-foreground mt-0.5">{card.subtext}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
