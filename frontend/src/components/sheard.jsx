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
					"flex aspect-square size-8 items-center justify-center rounded-lg border border-border/70 bg-muted/30 text-foreground shrink-0 transition-colors group-hover:bg-muted group-hover:text-foreground",
					"[&_svg:not([class*='size-'])]:size-3.5"
				)}
			>
				{icon}
			</div>
			<div className="flex flex-col items-start justify-center min-w-0">
				<span className="font-medium text-xs text-foreground tracking-wide group-hover:text-foreground transition-colors">
					{label}
				</span>
				{description && (
					<span className="line-clamp-1 text-muted-foreground text-[10px] font-light leading-snug">
						{description}
					</span>
				)}
			</div>
		</>
	);

	const linkClasses = cn(
		"group flex items-center gap-2.5 p-2 rounded-lg transition-colors hover:bg-muted/50 border border-transparent hover:border-border/40",
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
