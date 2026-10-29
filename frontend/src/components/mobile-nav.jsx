import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Portal } from "@/components/portal";
import { productLinks } from "@/components/nav-links";
import { getAuthUser, logoutUser } from "@/lib/auth";
import { XIcon, MenuIcon, ShieldCheck, LogOut, Download } from "lucide-react";
import { UserIcon } from "@/components/icons";

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

	React.useEffect(() => {
		if (!open) return;
		const handleKeyDown = (e) => {
			if (e.key === "Escape") setOpen(false);
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [open]);

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
				aria-label="Toggle navigation menu"
				className="size-9 cursor-pointer"
				onClick={() => setOpen(true)}
				size="icon"
				variant="outline"
			>
				<MenuIcon className="size-4" />
			</Button>

			{open && (
				<Portal>
					<div
						className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity cursor-pointer animate-in fade-in duration-200"
						onClick={() => setOpen(false)}
					/>

					<aside
						id="mobile-menu"
						role="dialog"
						aria-modal="true"
						className="fixed inset-y-0 right-0 z-50 w-full max-w-xs sm:max-w-sm bg-background border-l border-border shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200"
					>
						<div>
							<div className="flex items-center justify-between p-4 border-b border-border/70">
								<div className="flex items-center gap-2.5">
									<img
										src="/assets/logo.png"
										alt="Khalil & Sons"
										className="size-7 object-contain"
									/>
									<div className="flex flex-col">
										<span className="font-serif text-sm tracking-[0.16em] font-light text-foreground">
											KHALIL & SONS
										</span>
										<span className="text-[9px] font-mono tracking-widest text-muted-foreground uppercase">
											AU · 999.0 Certified
										</span>
									</div>
								</div>
								<button
									type="button"
									onClick={() => setOpen(false)}
									aria-label="Close menu"
									className="size-8 rounded-lg border border-border/70 hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer"
								>
									<XIcon className="size-4" />
								</button>
							</div>

							<div className="p-4 space-y-4">
								<div className="space-y-1">
									<Link
										to="/"
										onClick={() => setOpen(false)}
										className="flex items-center justify-between p-2.5 rounded-lg text-sm font-serif text-foreground hover:bg-muted/60 transition-colors"
									>
										<span>Home</span>
										<span className="text-muted-foreground text-xs font-mono">01</span>
									</Link>
									<Link
										to="/rates"
										onClick={() => setOpen(false)}
										className="flex items-center justify-between p-2.5 rounded-lg text-sm font-serif text-foreground hover:bg-muted/60 transition-colors"
									>
										<span>Sarafa Market Rates</span>
										<span className="text-muted-foreground text-xs font-mono">02</span>
									</Link>
									<Link
										to="/gallery"
										onClick={() => setOpen(false)}
										className="flex items-center justify-between p-2.5 rounded-lg text-sm font-serif text-foreground hover:bg-muted/60 transition-colors"
									>
										<span>Haute Joaillerie Gallery</span>
										<span className="text-muted-foreground text-xs font-mono">03</span>
									</Link>
									<Link
										to="/about"
										onClick={() => setOpen(false)}
										className="flex items-center justify-between p-2.5 rounded-lg text-sm font-serif text-foreground hover:bg-muted/60 transition-colors"
									>
										<span>Atelier Heritage (1992)</span>
										<span className="text-muted-foreground text-xs font-mono">04</span>
									</Link>
									<Link
										to="/contact"
										onClick={() => setOpen(false)}
										className="flex items-center justify-between p-2.5 rounded-lg text-sm font-serif text-foreground hover:bg-muted/60 transition-colors"
									>
										<span>Contact & Boutique</span>
										<span className="text-muted-foreground text-xs font-mono">05</span>
									</Link>
								</div>

								<div className="pt-3 border-t border-border/60">
									<span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block mb-2 px-1">
										Featured Masterpieces
									</span>
									<div className="space-y-1">
										{productLinks.map((link) => (
											<Link
												key={`mobile-${link.label}`}
												to={link.href}
												onClick={() => setOpen(false)}
												className="flex items-center justify-between p-2 rounded-lg text-xs text-foreground/80 hover:text-foreground hover:bg-muted/40 transition-colors"
											>
												<span>{link.label}</span>
												<span className="text-[10px] text-muted-foreground font-light">{link.description?.split(' ')[0]}</span>
											</Link>
										))}
									</div>
								</div>
							</div>
						</div>

						<div className="p-4 border-t border-border/70 space-y-2.5 bg-muted/20">
							{user ? (
								<>
									<div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-background border border-border/60">
										<div className="size-8 rounded-full bg-muted border border-border text-foreground font-semibold flex items-center justify-center text-xs font-mono shrink-0">
											{(user.name || user.email || "U").charAt(0).toUpperCase()}
										</div>
										<div className="flex flex-col min-w-0 flex-1">
											<span className="text-xs font-medium text-foreground truncate">{user.name || "Customer"}</span>
											<span className="text-[10px] text-muted-foreground truncate font-mono">{user.email}</span>
										</div>
									</div>
									{isAdmin && (
										<Button asChild className="w-full bg-foreground text-background hover:bg-neutral-800 text-xs h-9 cursor-pointer" onClick={() => setOpen(false)}>
											<Link to="/admin" className="flex items-center justify-center gap-1.5">
												<ShieldCheck className="size-3.5" />
												<span>Admin Dashboard</span>
											</Link>
										</Button>
									)}
									<Button
										type="button"
										variant="outline"
										className="w-full border-border text-muted-foreground hover:text-destructive hover:bg-destructive/10 text-xs h-9 cursor-pointer"
										onClick={handleLogout}
									>
										<LogOut className="size-3.5 mr-1.5" />
										<span>Sign Out</span>
									</Button>
								</>
							) : (
								<Button asChild className="w-full bg-foreground text-background hover:bg-neutral-800 text-xs h-9 cursor-pointer" onClick={() => setOpen(false)}>
									<Link to="/auth" className="flex items-center justify-center gap-1.5">
										<UserIcon size={15} className="shrink-0" />
										<span>Sign In</span>
									</Link>
								</Button>
							)}

							{!isInstalled && (
								<Button
									type="button"
									variant="outline"
									className="w-full border-border text-foreground hover:bg-muted text-xs h-9 cursor-pointer"
									onClick={() => {
										setOpen(false);
										window.dispatchEvent(new CustomEvent("khalil_open_pwa_prompt"));
									}}
								>
									<Download className="size-3.5 mr-1.5" />
									<span>Install Web App</span>
								</Button>
							)}

							<div className="pt-1 text-center text-[10px] font-mono text-muted-foreground">
								Murshid Sunaar Tower, Saddar, Karachi
							</div>
						</div>
					</aside>
				</Portal>
			)}
		</div>
	);
}
