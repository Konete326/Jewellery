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
					<NavigationMenuContent className="bg-muted/50 p-1 pr-1.5 dark:bg-background">
						<div className="rounded-lg grid w-lg grid-cols-2 gap-2 border bg-popover p-2 shadow-lg">
							{productLinks.map((item, i) => (
								<NavigationMenuLink asChild key={`item-${item.label}-${i}`}>
									<LinkItem {...item} />
								</NavigationMenuLink>
							))}
						</div>
						<div className="p-2.5 bg-muted/30 border-t border-border/50">
							<p className="text-muted-foreground text-xs">
								Seeking custom curation?{" "}
								<a
									className="font-medium text-foreground hover:underline"
									href="#atelier"
								>
									Book a Private Appointment
								</a>
							</p>
						</div>
					</NavigationMenuContent>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuTrigger className="bg-transparent text-xs tracking-widest uppercase">
						Atelier
					</NavigationMenuTrigger>
					<NavigationMenuContent className="bg-muted/50 p-1 pr-1.5 pb-1.5 dark:bg-background">
						<div className="grid w-lg grid-cols-2 gap-2">
							<div className="rounded-lg space-y-2 border bg-popover p-2 shadow-lg">
								{companyLinks.map((item, i) => (
									<NavigationMenuLink asChild key={`item-${item.label}-${i}`}>
										<LinkItem {...item} />
									</NavigationMenuLink>
								))}
							</div>
							<div className="space-y-2 p-3 flex flex-col justify-center">
								{companyLinks2.map((item, i) => (
									<NavigationMenuLink
										href={item.href}
										key={`item-${item.label}-${i}`}
										className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground p-1.5 rounded-md hover:bg-muted transition-colors"
									>
										{item.icon}
										{item.label}
									</NavigationMenuLink>
								))}
							</div>
						</div>
					</NavigationMenuContent>
				</NavigationMenuItem>
				<NavigationMenuLink asChild className="px-3">
					<Link className="rounded-md p-2 text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors" to="/gallery">
						Masterpieces
					</Link>
				</NavigationMenuLink>
				<NavigationMenuLink asChild className="px-3">
					<Link className="rounded-md p-2 text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors" to="/about">
						About Us
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
