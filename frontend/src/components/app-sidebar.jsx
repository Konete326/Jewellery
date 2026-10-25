"use client";

import { Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavGroup } from "@/components/nav-group";
import { navGroups } from "@/components/app-shared";
import { LatestChange } from "@/components/latest-change";
import { Store } from "lucide-react";

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader className="h-16 justify-center border-b border-sidebar-border px-3">
        <SidebarMenuButton asChild className="h-auto py-2">
          <Link to="/admin" className="flex items-center gap-2.5">
            <img
              src="/assets/logo.png"
              alt="Khalil & Sons"
              className="size-8 object-contain shrink-0"
            />
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
      </SidebarFooter>
    </Sidebar>
  );
}
