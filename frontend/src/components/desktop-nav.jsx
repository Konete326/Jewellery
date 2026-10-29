import { Link } from "react-router-dom";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { companyLinks, productLinks } from "@/components/nav-links";
import { LinkItem } from "@/components/sheard";

export function DesktopNav() {
	return (
		<NavigationMenu className="hidden md:flex">
			<NavigationMenuList>
				<NavigationMenuItem className="bg-transparent">
					<NavigationMenuTrigger className="bg-transparent text-xs tracking-widest uppercase hover:text-foreground">
						Collections
					</NavigationMenuTrigger>
					<NavigationMenuContent className="bg-popover p-2 rounded-xl border border-border/70 shadow-lg">
						<div className="w-64 space-y-1">
							{productLinks.map((item, i) => (
								<NavigationMenuLink asChild key={`item-${item.label}-${i}`}>
									<LinkItem {...item} />
								</NavigationMenuLink>
							))}
							<div className="pt-2 mt-1 border-t border-border/50 px-2">
								<NavigationMenuLink asChild>
									<Link
										to="/gallery"
										className="text-[11px] font-medium text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
									>
										<span>View All Gallery Pieces</span>
										<span>→</span>
									</Link>
								</NavigationMenuLink>
							</div>
						</div>
					</NavigationMenuContent>
				</NavigationMenuItem>

				<NavigationMenuItem>
					<NavigationMenuTrigger className="bg-transparent text-xs tracking-widest uppercase hover:text-foreground">
						About
					</NavigationMenuTrigger>
					<NavigationMenuContent className="bg-popover p-2 rounded-xl border border-border/70 shadow-lg">
						<div className="w-64 space-y-1">
							{companyLinks.map((item, i) => (
								<NavigationMenuLink asChild key={`item-${item.label}-${i}`}>
									<LinkItem {...item} />
								</NavigationMenuLink>
							))}
							<div className="pt-2 mt-1 border-t border-border/50 px-2">
								<NavigationMenuLink asChild>
									<Link
										to="/about"
										className="text-[11px] font-medium text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
									>
										<span>Explore 1992 Legacy</span>
										<span>→</span>
									</Link>
								</NavigationMenuLink>
							</div>
						</div>
					</NavigationMenuContent>
				</NavigationMenuItem>

				<NavigationMenuLink asChild className="px-3">
					<Link className="rounded-md p-2 text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors" to="/rates">
						Live Rates
					</Link>
				</NavigationMenuLink>

				<NavigationMenuLink asChild className="px-3">
					<Link className="rounded-md p-2 text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors" to="/gallery">
						Gallery
					</Link>
				</NavigationMenuLink>

				<NavigationMenuLink asChild className="px-3">
					<Link className="rounded-md p-2 text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors" to="/contact">
						Contact
					</Link>
				</NavigationMenuLink>
			</NavigationMenuList>
		</NavigationMenu>
	);
}
