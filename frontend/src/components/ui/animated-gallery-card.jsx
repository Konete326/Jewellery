"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useInView } from "framer-motion";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Star, ArrowUpRight } from "lucide-react";

export function AnimatedGalleryCard({ alt, src, ratio, placeholder, item, rating, onClick }) {
	const ref = React.useRef(null);
	const isInView = useInView(ref, { once: true, margin: "100px" });
	const [isLoading, setIsLoading] = React.useState(true);
	const [hasError, setHasError] = React.useState(false);

	const displaySrc = hasError && placeholder ? placeholder : src;

	const handleError = () => {
		setHasError(true);
	};

	return (
		<div
			onClick={onClick}
			className={cn(
				"group relative overflow-hidden rounded-2xl border border-neutral-200/80 bg-neutral-900 shadow-xs transition-all duration-500 hover:shadow-2xl hover:border-neutral-400 dark:hover:border-neutral-600",
				onClick && "cursor-pointer"
			)}
		>
			<AspectRatio ref={ref} ratio={ratio} className="bg-neutral-900 relative size-full overflow-hidden">
				<img
					alt={alt}
					src={displaySrc}
					className={cn(
						"size-full object-cover opacity-0 transition-all duration-1000 ease-in-out group-hover:scale-105",
						{ "opacity-100": isInView && !isLoading }
					)}
					onLoad={() => setIsLoading(false)}
					loading="lazy"
					onError={handleError}
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
				<div className="absolute inset-x-0 bottom-0 p-5 text-white opacity-0 transition-all duration-300 translate-y-2 group-hover:translate-y-0 group-hover:opacity-100">
					<div className="flex items-center justify-between mb-1.5">
						<span className="text-[10px] uppercase tracking-widest text-neutral-300 font-mono font-medium">
							Khalil & Sons
						</span>
						{rating && (
							<div className="flex items-center gap-1 bg-black/50 px-2 py-0.5 rounded-full border border-neutral-700 text-neutral-200 text-[11px] font-mono backdrop-blur-xs">
								<Star className="size-3 fill-amber-400 text-amber-400" />
								<span>{Number(rating).toFixed(1)}</span>
							</div>
						)}
					</div>
					<h3 className="font-headline text-lg sm:text-xl text-white font-medium mb-1 line-clamp-1">
						{alt}
					</h3>
					{item?.description && (
						<p className="text-xs text-neutral-300 font-light line-clamp-2 mb-2 leading-relaxed">
							{item.description}
						</p>
					)}
					<div className="inline-flex items-center gap-1 text-[11px] uppercase tracking-widest text-neutral-300 font-medium pt-1 group-hover:text-white">
						<span>Explore Piece</span>
						<ArrowUpRight className="size-3.5" />
					</div>
				</div>
			</AspectRatio>
		</div>
	);
}
