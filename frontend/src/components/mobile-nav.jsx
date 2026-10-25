import { cn } from "@/lib/utils";
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Portal, PortalBackdrop } from "@/components/portal";
import { companyLinks, companyLinks2, productLinks } from "@/components/nav-links";
import { LinkItem } from "@/components/sheard";
import { isAdmin } from "@/lib/auth";
import { XIcon, MenuIcon, ShieldCheck } from "lucide-react";

export function MobileNav() {
	const [open, setOpen] = React.useState(false);
	const adminLoggedIn = isAdmin();

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
						<div className="mt-5 flex flex-col gap-2">
							<Button asChild className="w-full" variant="outline" onClick={() => setOpen(false)}>
								<Link to="/auth">{adminLoggedIn ? "Account" : "Sign In"}</Link>
							</Button>
							{adminLoggedIn && (
								<Button asChild className="w-full bg-foreground text-background" onClick={() => setOpen(false)}>
									<Link to="/admin" className="flex items-center justify-center gap-1.5">
										<ShieldCheck className="size-3.5 text-amber-500" />
										<span>Admin Portal</span>
									</Link>
								</Button>
							)}
						</div>
					</div>
				</Portal>
			)}
		</div>
	);
}
