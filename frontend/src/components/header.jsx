"use client";

import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useScroll } from "@/hooks/use-scroll";
import { Button } from "@/components/ui/button";
import { DesktopNav } from "@/components/desktop-nav";
import { MobileNav } from "@/components/mobile-nav";
import { Search, ShoppingBag, Sparkles } from "lucide-react";

export function Header({ onOpenSearch, onOpenCart, cartCount = 0 }) {
	const scrolled = useScroll(10);

	return (
		<header
			className={cn(
				"sticky top-0 z-40 w-full border-b transition-all duration-300",
				scrolled
					? "border-border/80 bg-background/90 backdrop-blur-md shadow-xs"
					: "border-transparent bg-background/70 backdrop-blur-xs"
			)}
		>
			<nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-8">
				<div className="flex items-center gap-6">
					<Link
						to="/"
						className="flex items-center gap-2.5 group transition-opacity hover:opacity-90"
					>
						<div className="flex size-7 items-center justify-center rounded-md bg-amber-500/15 text-amber-600 border border-amber-500/30">
							<Sparkles className="size-3.5" />
						</div>
						<span className="font-serif text-lg sm:text-xl tracking-[0.2em] font-light text-foreground">
							KHALIL & SONS
						</span>
					</Link>
					<DesktopNav />
				</div>

				<div className="hidden items-center gap-3 md:flex">
					{onOpenSearch && (
						<Button
							variant="ghost"
							size="icon"
							onClick={onOpenSearch}
							className="size-9 text-muted-foreground hover:text-foreground"
							aria-label="Search collections"
						>
							<Search className="size-4" />
						</Button>
					)}

					{onOpenCart && (
						<Button
							variant="ghost"
							size="icon"
							onClick={onOpenCart}
							className="relative size-9 text-muted-foreground hover:text-foreground"
							aria-label="Shopping bag"
						>
							<ShoppingBag className="size-4" />
							{cartCount > 0 && (
								<span className="absolute -top-0.5 -right-0.5 bg-foreground text-background text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-mono">
									{cartCount}
								</span>
							)}
						</Button>
					)}

					<Button asChild variant="outline" size="sm" className="h-8 text-xs px-3">
						<Link to="/auth">Sign In</Link>
					</Button>

					<Button asChild size="sm" className="h-8 text-xs px-3 bg-foreground text-background">
						<Link to="/admin" className="flex items-center gap-1.5">
							<span className="text-amber-500 font-semibold">Admin Portal</span>
							<span>→</span>
						</Link>
					</Button>
				</div>

				<div className="flex items-center gap-2 md:hidden">
					{onOpenCart && (
						<Button
							variant="ghost"
							size="icon"
							onClick={onOpenCart}
							className="relative size-9 text-muted-foreground hover:text-foreground"
						>
							<ShoppingBag className="size-4" />
							{cartCount > 0 && (
								<span className="absolute -top-0.5 -right-0.5 bg-foreground text-background text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-mono">
									{cartCount}
								</span>
							)}
						</Button>
					)}
					<MobileNav />
				</div>
			</nav>
		</header>
	);
}
