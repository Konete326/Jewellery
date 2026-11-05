import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { collectionLinks, maisonLinks, clientCareLinks } from "@/components/nav-links";
import { LinkItem } from "@/components/sheard";

function NavDropdown({ label, children }) {
	const [open, setOpen] = useState(false);
	const containerRef = useRef(null);
	const timeoutRef = useRef(null);

	const handleMouseEnter = () => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
		setOpen(true);
	};

	const handleMouseLeave = () => {
		timeoutRef.current = setTimeout(() => {
			setOpen(false);
		}, 200);
	};

	const handleClose = () => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
		setTimeout(() => {
			setOpen(false);
		}, 0);
	};

	const handleToggle = () => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
		setOpen((prev) => !prev);
	};

	useEffect(() => {
		if (!open) return;
		const handleClickOutside = (e) => {
			if (containerRef.current && !containerRef.current.contains(e.target)) {
				setOpen(false);
			}
		};
		document.addEventListener("pointerdown", handleClickOutside);
		return () => document.removeEventListener("pointerdown", handleClickOutside);
	}, [open]);

	return (
		<div
			ref={containerRef}
			className="relative inline-block"
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			<button
				type="button"
				onClick={handleToggle}
				className={cn(
					"inline-flex h-9 items-center justify-center gap-1 rounded-md px-3 text-xs tracking-widest uppercase transition-colors outline-none cursor-pointer font-medium select-none",
					open
						? "bg-accent/60 text-foreground"
						: "text-muted-foreground hover:text-foreground hover:bg-accent/40"
				)}
				aria-expanded={open}
			>
				<span>{label}</span>
				<ChevronDown
					className={cn(
						"size-3 transition-transform duration-200 opacity-70",
						open && "rotate-180 opacity-100"
					)}
				/>
			</button>

			{open && (
				<div className="absolute top-full left-0 pt-1.5 z-50">
					<div className="w-72 p-2 rounded-xl border border-border/80 bg-popover text-popover-foreground shadow-xl animate-in fade-in-0 zoom-in-95 duration-150">
						{typeof children === "function" ? children(handleClose) : children}
					</div>
				</div>
			)}
		</div>
	);
}

export function DesktopNav() {
	return (
		<nav className="hidden lg:flex items-center gap-1">
			<NavDropdown label="Collections">
				{(close) => (
					<div className="space-y-1">
						{collectionLinks.map((item, i) => (
							<LinkItem
								key={`col-${item.label}-${i}`}
								{...item}
								onClick={close}
							/>
						))}
						<div className="pt-2 mt-1 border-t border-border/50 px-2.5">
							<Link
								to="/gallery"
								onClick={close}
								className="text-[11px] font-mono uppercase tracking-wider text-amber-700 dark:text-amber-400 hover:underline inline-flex items-center gap-1 transition-colors"
							>
								<span>View All Jewellery</span>
								<span>→</span>
							</Link>
						</div>
					</div>
				)}
			</NavDropdown>

			<Link
				className="inline-flex h-9 items-center justify-center rounded-md px-3 text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground hover:bg-accent/40 transition-colors font-medium"
				to="/rates"
			>
				Live Rates
			</Link>

			<NavDropdown label="About Us">
				{(close) => (
					<div className="space-y-1">
						{maisonLinks.map((item, i) => (
							<LinkItem
								key={`mai-${item.label}-${i}`}
								{...item}
								onClick={close}
							/>
						))}
						<div className="pt-2 mt-1 border-t border-border/50 px-2.5">
							<Link
								to="/about"
								onClick={close}
								className="text-[11px] font-mono uppercase tracking-wider text-amber-700 dark:text-amber-400 hover:underline inline-flex items-center gap-1 transition-colors"
							>
								<span>About Khalil & Sons</span>
								<span>→</span>
							</Link>
						</div>
					</div>
				)}
			</NavDropdown>

			<NavDropdown label="Customer Care">
				{(close) => (
					<div className="space-y-1">
						{clientCareLinks.map((item, i) => (
							<LinkItem
								key={`care-${item.label}-${i}`}
								{...item}
								onClick={close}
							/>
						))}
						<div className="pt-2 mt-1 border-t border-border/50 px-2.5">
							<Link
								to="/contact"
								onClick={close}
								className="text-[11px] font-mono uppercase tracking-wider text-amber-700 dark:text-amber-400 hover:underline inline-flex items-center gap-1 transition-colors"
							>
								<span>Contact Our Showroom</span>
								<span>→</span>
							</Link>
						</div>
					</div>
				)}
			</NavDropdown>
		</nav>
	);
}
