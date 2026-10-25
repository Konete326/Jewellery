"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { AnimatedGalleryCard } from "@/components/ui/animated-gallery-card";
import { GalleryCardSkeleton } from "@/components/ui/gallery-card-skeleton";

export function ImageGallery({ items, onItemClick, className, columnsCount = 3, isLoadingMore = false }) {
	const displayItems = Array.isArray(items) ? items : [];

	if (displayItems.length === 0) {
		return null;
	}

	const cols = Array.from({ length: columnsCount }, (_, colIndex) =>
		displayItems.filter((_, idx) => idx % columnsCount === colIndex)
	);

	return (
		<div className={cn("mx-auto grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-3", className)}>
			{cols.map((colItems, col) => (
				<div key={col} className="grid gap-6">
					{colItems.map((item, index) => {
						const isPortrait = (col + index) % 2 === 0;
						const ratio = isPortrait ? 4 / 5 : 16 / 10;
						const imageSrc = item.imageUrl || item.src;
						const title = item.title || `Masterpiece ${col * 10 + index + 1}`;
						const rating = item.averageRating || item.rating;

						return (
							<AnimatedGalleryCard
								key={item._id || item.id || `${col}-${index}`}
								alt={title}
								src={imageSrc}
								ratio={ratio}
								placeholder="/images/image-01.jpg"
								item={item}
								rating={rating}
								onClick={() => onItemClick?.(item)}
							/>
						);
					})}
					{isLoadingMore && (
						<GalleryCardSkeleton ratio={col % 2 === 0 ? 4 / 5 : 16 / 10} />
					)}
				</div>
			))}
		</div>
	);
}
