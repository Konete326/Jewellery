import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export function LinkItem({
	label,
	description,
	icon,
	className,
	href,
	...props
}) {
	const isInternal = Boolean(href && href.startsWith("/"));

	const content = (
		<>
			<div
				className={cn(
					"flex aspect-square size-10 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-800 dark:text-amber-300 shrink-0 transition-all duration-200 group-hover:bg-amber-500/25 group-hover:text-amber-950 dark:group-hover:text-amber-200 group-hover:border-amber-500/50 group-hover:scale-105",
					"[&_svg:not([class*='size-'])]:size-4"
				)}
			>
				{icon}
			</div>
			<div className="flex flex-col items-start justify-center min-w-0">
				<span className="font-medium text-xs sm:text-sm text-foreground tracking-wide group-hover:text-[#2d3435] dark:group-hover:text-amber-200 transition-colors">
					{label}
				</span>
				{description && (
					<span className="line-clamp-1 text-muted-foreground text-[11px] font-light leading-snug">
						{description}
					</span>
				)}
			</div>
		</>
	);

	const linkClasses = cn(
		"group flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200 hover:bg-amber-500/8 dark:hover:bg-amber-500/10 border border-transparent hover:border-amber-500/20",
		className
	);

	if (isInternal) {
		return (
			<Link
				to={href}
				className={linkClasses}
				{...props}
			>
				{content}
			</Link>
		);
	}

	return (
		<a
			href={href}
			className={linkClasses}
			{...props}
		>
			{content}
		</a>
	);
}
