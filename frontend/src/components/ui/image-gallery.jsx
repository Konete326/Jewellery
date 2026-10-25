"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { AnimatedGalleryCard } from "@/components/ui/animated-gallery-card";

const DEFAULT_JEWELRY_ITEMS = [
	{
		title: "The Florentine Ruby Choker",
		src: "/assets/products/choker-ruby-01.jpg",
		description: "22K handmade gold necklace with natural red rubies",
		rating: 4.9,
	},
	{
		title: "Royal Polki Kada Armlet",
		src: "/assets/products/kada-polki-01.jpg",
		description: "Uncut diamonds set in 22K solid gold with detailed enamel work",
		rating: 5.0,
	},
	{
		title: "Archival Aurelian Guluband",
		src: "/assets/products/guluband-01.jpg",
		description: "Handmade 22K solid gold collar necklace with delicate gold wirework",
		rating: 4.8,
	},
	{
		title: "Imperial Florentine Jhumkas",
		src: "/assets/products/jhumka-01.jpg",
		description: "22K gold drop earrings with delicate pearls and carved designs",
		rating: 4.9,
	},
	{
		title: "Medici Uncut Polki Solitaire",
		src: "/assets/products/ring-polki-01.jpg",
		description: "Handcrafted 18K solid yellow gold ring with uncut raw diamonds",
		rating: 5.0,
	},
	{
		title: "Tuscan Mist Pearl Cascade",
		src: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200",
		description: "South Sea natural pearls crafted on gold wire",
		rating: 4.7,
	},
];

export function ImageGallery({ items, onItemClick, className, columnsCount = 3 }) {
	const displayItems = items && items.length > 0 ? items : DEFAULT_JEWELRY_ITEMS;
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
								placeholder="/assets/products/choker-ruby-01.jpg"
								item={item}
								rating={rating}
								onClick={() => onItemClick?.(item)}
							/>
						);
					})}
				</div>
			))}
		</div>
	);
}
