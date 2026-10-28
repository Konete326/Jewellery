"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useScroll } from "@/hooks/use-scroll";
import { Button } from "@/components/ui/button";
import { DesktopNav } from "@/components/desktop-nav";
import { MobileNav } from "@/components/mobile-nav";
import { getAuthUser } from "@/lib/auth";
import { getLocalVaultIds } from "@/lib/wishlist";
import { getLocalCartCount, subscribeToTabSync } from "@/utils/tabSync";
import { AtelierVaultDrawer } from "@/components/vault/AtelierVaultDrawer";
import { SearchIcon, CartIcon, HeartIcon } from "@/components/icons";
import { StoreStatusBadge } from "@/components/StoreStatusBadge";
import { UserAccountMenu } from "@/components/UserAccountMenu";

export function Header({ onOpenSearch, onOpenCart, cartCount }) {
	const scrolled = useScroll(10);
	const [user, setUser] = useState(getAuthUser());
	const [vaultOpen, setVaultOpen] = useState(false);
	const [vaultCount, setVaultCount] = useState(getLocalVaultIds().length);
	const [currentCartCount, setCurrentCartCount] = useState(() => {
		if (typeof cartCount === "number" && cartCount > 0) return cartCount;
		return getLocalCartCount();
	});

	useEffect(() => {
		if (typeof cartCount === "number") {
			setCurrentCartCount(cartCount);
		}
	}, [cartCount]);

	useEffect(() => {
		const handleAuthChange = (e) => {
			setUser(e.detail || getAuthUser());
		};
		const handleStorage = (e) => {
			if (e.key === "auth_user") {
				setUser(getAuthUser());
			}
		};
		const handleVaultChange = (e) => {
			setVaultCount(e.detail?.count ?? getLocalVaultIds().length);
		};
		const handleCartChange = (e) => {
			setCurrentCartCount(e.detail?.count ?? getLocalCartCount());
		};

		const unsubscribe = subscribeToTabSync((data) => {
			if (data?.type === "CART_UPDATE") {
				setCurrentCartCount(data.count ?? getLocalCartCount());
			} else if (data?.type === "VAULT_UPDATE") {
				setVaultCount(data.count ?? getLocalVaultIds().length);
			}
		});

		window.addEventListener("khalil_auth_change", handleAuthChange);
		window.addEventListener("storage", handleStorage);
		window.addEventListener("khalil_vault_change", handleVaultChange);
		window.addEventListener("khalil_cart_change", handleCartChange);

		return () => {
			unsubscribe();
			window.removeEventListener("khalil_auth_change", handleAuthChange);
			window.removeEventListener("storage", handleStorage);
			window.removeEventListener("khalil_vault_change", handleVaultChange);
			window.removeEventListener("khalil_cart_change", handleCartChange);
		};
	}, []);

	return (
		<>
			<header
				className={cn(
					"sticky top-0 z-40 w-full border-b transition-all duration-300",
					scrolled
						? "border-border/80 bg-background/90 backdrop-blur-md shadow-xs"
						: "border-transparent bg-background/70 backdrop-blur-xs"
				)}
			>
				<nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-3 sm:px-8">
					<div className="flex items-center gap-3 sm:gap-6 min-w-0">
						<Link
							to="/"
							className="flex items-center gap-2 sm:gap-3 group transition-opacity hover:opacity-90 shrink-0"
						>
							<img
								src="/assets/logo.png"
								alt="Khalil & Sons"
								className="size-7 sm:size-8 object-contain shrink-0"
							/>
							<span className="font-serif text-xs sm:text-base md:text-xl tracking-[0.1em] sm:tracking-[0.18em] font-light text-foreground whitespace-nowrap">
								KHALIL & SONS
							</span>
						</Link>
						<DesktopNav />
					</div>

					<div className="hidden items-center gap-2.5 md:flex">
						<StoreStatusBadge variant="pill" className="hidden xl:inline-flex" />
						{onOpenSearch && (
							<Button
								variant="ghost"
								size="icon"
								onClick={onOpenSearch}
								className="size-9 text-muted-foreground hover:text-foreground cursor-pointer"
								aria-label="Search collections"
							>
								<SearchIcon size={18} className="shrink-0" />
							</Button>
						)}

						<Button
							variant="ghost"
							size="icon"
							onClick={() => setVaultOpen(true)}
							className="relative size-9 text-muted-foreground hover:text-foreground cursor-pointer"
							aria-label="Atelier Vault"
							title="Atelier Vault (Saved Heirlooms)"
						>
							<HeartIcon size={18} className="shrink-0" />
							{vaultCount > 0 && (
								<span className="absolute -top-0.5 -right-0.5 bg-rose-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-mono">
									{vaultCount}
								</span>
							)}
						</Button>

						{onOpenCart && (
							<Button
								variant="ghost"
								size="icon"
								onClick={onOpenCart}
								className="relative size-9 text-muted-foreground hover:text-foreground cursor-pointer"
								aria-label="Shopping bag"
							>
								<CartIcon size={18} className="shrink-0" />
								{currentCartCount > 0 && (
									<span className="absolute -top-0.5 -right-0.5 bg-foreground text-background text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-mono">
										{currentCartCount}
									</span>
								)}
							</Button>
						)}

						<UserAccountMenu
							user={user}
							onOpenVault={() => setVaultOpen(true)}
							vaultCount={vaultCount}
						/>
					</div>

					<div className="flex items-center gap-2 md:hidden">
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setVaultOpen(true)}
							className="relative size-9 text-muted-foreground hover:text-foreground cursor-pointer hidden sm:inline-flex"
							aria-label="Atelier Vault"
						>
							<HeartIcon size={18} className="shrink-0" />
							{vaultCount > 0 && (
								<span className="absolute -top-0.5 -right-0.5 bg-rose-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-mono">
									{vaultCount}
								</span>
							)}
						</Button>

						{onOpenCart && (
							<Button
								variant="ghost"
								size="icon"
								onClick={onOpenCart}
								className="relative size-9 text-muted-foreground hover:text-foreground cursor-pointer"
							>
								<CartIcon size={18} className="shrink-0" />
								{currentCartCount > 0 && (
									<span className="absolute -top-0.5 -right-0.5 bg-foreground text-background text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-mono">
										{currentCartCount}
									</span>
								)}
							</Button>
						)}
						<MobileNav />
					</div>
				</nav>
			</header>

			<AtelierVaultDrawer
				isOpen={vaultOpen}
				onClose={() => setVaultOpen(false)}
			/>
		</>
	);
}
