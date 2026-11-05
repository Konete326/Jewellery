import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export const LinkItem = React.forwardRef(function LinkItem(
	{ label, description, icon, className, href, onClick, ...props },
	ref
) {
	const isInternal = Boolean(href && href.startsWith("/"));

	const content = (
		<>
			{icon && (
				<div className="shrink-0 text-amber-700 dark:text-amber-400 mt-0.5">
					{icon}
				</div>
			)}
			<div className="flex flex-col items-start justify-center min-w-0">
				<span className="font-medium text-xs text-foreground tracking-wide group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
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
		"group flex items-start gap-3 p-2.5 rounded-lg transition-colors hover:bg-muted/40 border border-transparent hover:border-border/60",
		className
	);

	if (isInternal) {
		return (
			<Link
				ref={ref}
				to={href}
				onClick={onClick}
				className={linkClasses}
				{...props}
			>
				{content}
			</Link>
		);
	}

	return (
		<a
			ref={ref}
			href={href}
			onClick={onClick}
			className={linkClasses}
			{...props}
		>
			{content}
		</a>
	);
});
