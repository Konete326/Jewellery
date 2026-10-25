"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useScroll } from "@/hooks/use-scroll";
import { Button } from "@/components/ui/button";
import { DesktopNav } from "@/components/desktop-nav";
import { MobileNav } from "@/components/mobile-nav";
import { getAuthUser, logoutUser } from "@/lib/auth";
import { Search, ShoppingBag, ShieldCheck, User, LogOut } from "lucide-react";
import { StoreStatusBadge } from "@/components/StoreStatusBadge";

export function Header({ onOpenSearch, onOpenCart, cartCount = 0 }) {
	const scrolled = useScroll(10);
	const [user, setUser] = useState(getAuthUser());
	const adminLoggedIn = Boolean(user && user.role === "admin");

	useEffect(() => {
		const handleAuthChange = (e) => {
			setUser(e.detail || getAuthUser());
		};
		const handleStorage = (e) => {
			if (e.key === "auth_user") {
				setUser(getAuthUser());
			}
		};
		window.addEventListener("khalil_auth_change", handleAuthChange);
		window.addEventListener("storage", handleStorage);
		return () => {
			window.removeEventListener("khalil_auth_change", handleAuthChange);
			window.removeEventListener("storage", handleStorage);
		};
	}, []);

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
						className="flex items-center gap-3 group transition-opacity hover:opacity-90"
					>
						<img
							src="/assets/logo.png"
							alt="Khalil & Sons"
							className="size-8 object-contain"
						/>
						<span className="font-serif text-lg sm:text-xl tracking-[0.2em] font-light text-foreground">
							KHALIL & SONS
						</span>
					</Link>
					<DesktopNav />
				</div>

				<div className="hidden items-center gap-3 md:flex">
					<StoreStatusBadge variant="pill" className="hidden lg:inline-flex" />
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

					{user ? (
						<div className="flex items-center gap-2">
							{adminLoggedIn && (
								<Button asChild size="sm" className="h-8 text-xs px-3 bg-foreground text-background hover:bg-neutral-800">
									<Link to="/admin" className="flex items-center gap-1.5">
										<ShieldCheck className="size-3.5 text-amber-500" />
										<span className="text-amber-400 font-medium">Admin Portal</span>
										<span>→</span>
									</Link>
								</Button>
							)}
							<div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 rounded-md border border-border text-xs">
								{user?.avatar ? (
									<img
										src={user.avatar}
										alt={user.name}
										referrerPolicy="no-referrer"
										className="size-4 rounded-full object-cover"
									/>
								) : (
									<User className="size-3.5 text-amber-700 dark:text-amber-400" />
								)}
								<span className="font-medium text-foreground max-w-[110px] truncate">
									{user.name ? user.name.split(" ")[0] : "Account"}
								</span>
							</div>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => logoutUser()}
								className="h-8 text-xs px-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
								title="Sign Out"
							>
								<LogOut className="size-3.5" />
								<span className="hidden xl:inline">Sign Out</span>
							</Button>
						</div>
					) : (
						<Button asChild variant="outline" size="sm" className="h-8 text-xs px-3">
							<Link to="/auth">Sign In</Link>
						</Button>
					)}
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
