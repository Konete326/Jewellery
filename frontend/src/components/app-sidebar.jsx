"use client";

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavGroup } from "@/components/nav-group";
import { footerNavLinks, navGroups } from "@/components/app-shared";
import { LatestChange } from "@/components/latest-change";
import { PlusIcon, SearchIcon, Store, Sparkles } from "lucide-react";

export function AppSidebar() {
	return (
		<Sidebar collapsible="icon" variant="floating">
			<SidebarHeader className="h-16 justify-center border-b border-sidebar-border px-3">
				<SidebarMenuButton asChild className="h-auto py-2">
					<Link to="/admin" className="flex items-center gap-2.5">
						<div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600 border border-amber-500/30">
							<Sparkles className="size-4" />
						</div>
						<div className="flex flex-col text-left group-data-[collapsible=icon]:hidden">
							<span className="font-semibold text-sm tracking-tight text-sidebar-foreground">Khalil & Sons</span>
							<span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">Atelier Admin</span>
						</div>
					</Link>
				</SidebarMenuButton>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarMenuItem className="flex flex-col gap-2">
						<div className="flex items-center gap-2">
							<SidebarMenuButton
								className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground"
								tooltip="Add Masterpiece"
							>
								<PlusIcon className="size-4" />
								<span>Add Piece</span>
							</SidebarMenuButton>
							<Button
								aria-label="Search store"
								className="size-8 group-data-[collapsible=icon]:opacity-0"
								size="icon"
								variant="outline"
							>
								<SearchIcon className="size-3.5" />
								<span className="sr-only">Search store</span>
							</Button>
						</div>
						<Link
							to="/"
							className="group-data-[collapsible=icon]:hidden flex items-center justify-between px-3 py-2 rounded-lg border border-border/80 bg-muted/40 hover:bg-muted text-xs font-medium text-foreground transition-colors"
						>
							<span className="flex items-center gap-2">
								<Store className="size-3.5 text-amber-600" />
								View Live Store
							</span>
							<span className="text-[10px] text-muted-foreground font-mono">/</span>
						</Link>
					</SidebarMenuItem>
				</SidebarGroup>
				{navGroups.map((group, index) => (
					<NavGroup key={`sidebar-group-${index}`} {...group} />
				))}
			</SidebarContent>
			<SidebarFooter>
				<LatestChange />
				<SidebarMenu className="mt-2">
					{footerNavLinks.map((item) => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton
								asChild
								className="text-muted-foreground"
								isActive={item.isActive}
								size="sm"
							>
								<a href={item.path}>
									{item.icon}
									<span>{item.title}</span>
								</a>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}
