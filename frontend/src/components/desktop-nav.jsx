import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/constants/navigation";

export function DesktopNav() {
	const location = useLocation();

	return (
		<nav className="hidden lg:flex items-center gap-1">
			{NAV_LINKS.map((link) => {
				const isActive =
					location.pathname === link.path ||
					(link.path !== "/" && location.pathname.startsWith(link.path));

				return (
					<Link
						key={link.id}
						to={link.path}
						className={cn(
							"inline-flex h-9 items-center justify-center rounded-md px-3 text-xs tracking-widest uppercase transition-colors font-medium select-none",
							isActive
								? "text-foreground bg-accent/60 shadow-2xs font-semibold"
								: "text-muted-foreground hover:text-foreground hover:bg-accent/40"
						)}
					>
						{link.label}
					</Link>
				);
			})}
		</nav>
	);
}

export default DesktopNav;