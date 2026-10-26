import { Link } from "react-router-dom";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { companyLinks, companyLinks2, productLinks } from "@/components/nav-links";
import { LinkItem } from "@/components/sheard";

export function DesktopNav() {
	return (
		<NavigationMenu className="hidden md:flex">
			<NavigationMenuList>
				<NavigationMenuItem className="bg-transparent">
					<NavigationMenuTrigger className="bg-transparent text-xs tracking-widest uppercase">
						Collections
					</NavigationMenuTrigger>
					<NavigationMenuContent className="bg-popover p-3 rounded-2xl border border-border/80 shadow-xl">
						<div className="grid w-[540px] grid-cols-2 gap-2">
							{productLinks.map((item, i) => (
								<NavigationMenuLink asChild key={`item-${item.label}-${i}`}>
									<LinkItem {...item} />
								</NavigationMenuLink>
							))}
						</div>
						<div className="mt-3 p-3 bg-muted/40 rounded-xl border border-border/50 flex items-center justify-between">
							<span className="text-muted-foreground text-xs font-light">
								Looking for a bespoke custom design?
							</span>
							<NavigationMenuLink asChild>
								<Link
									className="font-medium text-xs text-amber-700 dark:text-amber-400 hover:underline inline-flex items-center gap-1"
									to="/contact"
								>
									<span>Book an Appointment</span>
									<span>→</span>
								</Link>
							</NavigationMenuLink>
						</div>
					</NavigationMenuContent>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuTrigger className="bg-transparent text-xs tracking-widest uppercase">
						About
					</NavigationMenuTrigger>
					<NavigationMenuContent className="bg-popover p-3 rounded-2xl border border-border/80 shadow-xl">
						<div className="grid w-[540px] grid-cols-2 gap-3">
							<div className="space-y-1">
								{companyLinks.map((item, i) => (
									<NavigationMenuLink asChild key={`item-${item.label}-${i}`}>
										<LinkItem {...item} />
									</NavigationMenuLink>
								))}
							</div>
							<div className="p-3 bg-muted/30 rounded-xl border border-border/50 flex flex-col justify-between">
								<div>
									<span className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono font-medium block mb-2 px-1">
										Atelier Quick Links
									</span>
									<div className="space-y-1">
										{companyLinks2.map((item, i) => {
											const isInternal = item.href.startsWith("/");
											const rowClasses = "flex items-center gap-2.5 text-xs font-medium text-muted-foreground hover:text-foreground p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors";
											return isInternal ? (
												<NavigationMenuLink asChild key={`item-${item.label}-${i}`}>
													<Link to={item.href} className={rowClasses}>
														{item.icon}
														<span>{item.label}</span>
													</Link>
												</NavigationMenuLink>
											) : (
												<NavigationMenuLink asChild key={`item-${item.label}-${i}`}>
													<a href={item.href} className={rowClasses}>
														{item.icon}
														<span>{item.label}</span>
													</a>
												</NavigationMenuLink>
											);
										})}
									</div>
								</div>
								<NavigationMenuLink asChild>
									<Link
										to="/about"
										className="mt-2 text-[11px] font-medium text-amber-700 dark:text-amber-400 hover:underline inline-flex items-center gap-1 px-1"
									>
										<span>Explore Our 1992 Heritage →</span>
									</Link>
								</NavigationMenuLink>
							</div>
						</div>
						<div className="mt-3 p-3 bg-muted/40 rounded-xl border border-border/50 flex items-center justify-between">
							<span className="text-muted-foreground text-xs font-light">
								Learn about our 3-decade legacy
							</span>
							<NavigationMenuLink asChild>
								<Link
									to="/about"
									className="font-medium text-xs text-foreground hover:underline inline-flex items-center gap-1"
								>
									<span>View About Page</span>
									<span>→</span>
								</Link>
							</NavigationMenuLink>
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
