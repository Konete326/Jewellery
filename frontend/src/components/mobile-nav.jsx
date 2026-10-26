import { cn } from "@/lib/utils";
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Portal, PortalBackdrop } from "@/components/portal";
import { companyLinks, companyLinks2, productLinks } from "@/components/nav-links";
import { LinkItem } from "@/components/sheard";
import { getAuthUser, logoutUser } from "@/lib/auth";
import { XIcon, MenuIcon, ShieldCheck, LogOut, User, Download } from "lucide-react";

export function MobileNav() {
	const [open, setOpen] = React.useState(false);
	const [user, setUser] = React.useState(() => getAuthUser());
	const [isInstalled, setIsInstalled] = React.useState(() => {
		if (typeof window === "undefined") return false;
		return (
			localStorage.getItem("khalil_pwa_installed") === "true" ||
			window.matchMedia("(display-mode: standalone)").matches
		);
	});

	React.useEffect(() => {
		const syncAuth = () => setUser(getAuthUser());
		window.addEventListener("khalil_auth_change", syncAuth);
		window.addEventListener("storage", syncAuth);
		return () => {
			window.removeEventListener("khalil_auth_change", syncAuth);
			window.removeEventListener("storage", syncAuth);
		};
	}, []);

	const handleLogout = () => {
		logoutUser();
		setOpen(false);
	};

	const isAdmin = user && (user.role === "admin" || user.isAdmin === true);

	return (
		<div className="md:hidden">
			<Button
				aria-controls="mobile-menu"
				aria-expanded={open}
				aria-label="Toggle menu"
				className="md:hidden size-9"
				onClick={() => setOpen(!open)}
				size="icon"
				variant="outline"
			>
				<div
					className={cn(
						"transition-all",
						open ? "scale-100 opacity-100" : "scale-0 opacity-0"
					)}
				>
					<XIcon className="size-4" />
				</div>
				<div
					className={cn(
						"absolute transition-all",
						open ? "scale-0 opacity-0" : "scale-100 opacity-100"
					)}
				>
					<MenuIcon className="size-4" />
				</div>
			</Button>
			{open && (
				<Portal className="top-14">
					<PortalBackdrop onClick={() => setOpen(false)} />
					<div
						className={cn(
							"size-full overflow-y-auto p-4 bg-background border-b border-border shadow-2xl",
							"data-[slot=open]:zoom-in-97 ease-out data-[slot=open]:animate-in"
						)}
						data-slot={open ? "open" : "closed"}
					>
						<div className="flex w-full flex-col gap-y-2">
							<span className="text-xs uppercase tracking-widest text-muted-foreground font-medium px-2">Collections</span>
							{productLinks.map((link) => (
								<LinkItem
									className="rounded-lg p-2 active:bg-muted dark:active:bg-muted/50"
									key={`product-${link.label}`}
									onClick={() => setOpen(false)}
									{...link}
								/>
							))}
							<span className="text-xs uppercase tracking-widest text-muted-foreground font-medium px-2 mt-2">About & Heritage</span>
							{companyLinks.map((link) => (
								<LinkItem
									className="rounded-lg p-2 active:bg-muted dark:active:bg-muted/50"
									key={`company-${link.label}`}
									onClick={() => setOpen(false)}
									{...link}
								/>
							))}
							<div className="flex flex-col gap-1 pt-1">
								{companyLinks2.map((link) => (
									<LinkItem
										className="rounded-lg p-2 active:bg-muted dark:active:bg-muted/50"
										key={`company2-${link.label}`}
										onClick={() => setOpen(false)}
										{...link}
									/>
								))}
							</div>
							<div className="pt-2 border-t border-border flex flex-col gap-1">
								<Link
									to="/rates"
									onClick={() => setOpen(false)}
									className="flex items-center gap-2 p-2 rounded-lg text-xs font-medium uppercase tracking-widest text-foreground hover:bg-muted"
								>
									<span>Gold & Silver Rates</span>
								</Link>
								<Link
									to="/gallery"
									onClick={() => setOpen(false)}
									className="flex items-center gap-2 p-2 rounded-lg text-xs font-medium uppercase tracking-widest text-foreground hover:bg-muted"
								>
									<span>Gallery</span>
								</Link>
								<Link
									to="/contact"
									onClick={() => setOpen(false)}
									className="flex items-center gap-2 p-2 rounded-lg text-xs font-medium uppercase tracking-widest text-foreground hover:bg-muted"
								>
									<span>Contact</span>
								</Link>
							</div>
						</div>
						<div className="mt-5 flex flex-col gap-2 pt-3 border-t border-border">
							{user ? (
								<>
									<div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-muted/50">
										<div className="size-7 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 font-semibold flex items-center justify-center text-xs">
											{(user.name || user.email || "U").charAt(0).toUpperCase()}
										</div>
										<div className="flex flex-col min-w-0">
											<span className="text-xs font-medium text-foreground truncate">{user.name || "Customer"}</span>
											<span className="text-[10px] text-muted-foreground truncate">{user.email}</span>
										</div>
									</div>
									{isAdmin && (
										<Button asChild className="w-full bg-foreground text-background" onClick={() => setOpen(false)}>
											<Link to="/admin" className="flex items-center justify-center gap-1.5">
												<ShieldCheck className="size-3.5 text-amber-500" />
												<span>Admin Portal</span>
											</Link>
										</Button>
									)}
									<Button
										type="button"
										variant="outline"
										className="w-full text-destructive hover:bg-destructive/10"
										onClick={handleLogout}
									>
										<LogOut className="size-3.5 mr-1.5" />
										<span>Sign Out</span>
									</Button>
								</>
							) : (
								<Button asChild className="w-full" variant="outline" onClick={() => setOpen(false)}>
									<Link to="/auth" className="flex items-center justify-center gap-1.5">
										<User className="size-3.5" />
										<span>Sign In</span>
									</Link>
								</Button>
							)}

							{!isInstalled && (
								<Button
									type="button"
									variant="outline"
									className="w-full border-amber-500/30 text-amber-700 dark:text-amber-400 hover:bg-amber-500/10 cursor-pointer"
									onClick={() => {
										setOpen(false);
										window.dispatchEvent(new CustomEvent("khalil_open_pwa_prompt"));
									}}
								>
									<Download className="size-3.5 mr-1.5 text-amber-500" />
									<span>Install Mobile App</span>
								</Button>
							)}
						</div>
					</div>
				</Portal>
			)}
		</div>
	);
}
