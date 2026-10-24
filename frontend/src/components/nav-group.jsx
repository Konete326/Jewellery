import { Link, useLocation } from "react-router-dom";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavGroup({ label, items }) {
  const location = useLocation();

  const isItemActive = (path) => {
    if (path === "/admin") {
      return location.pathname === "/admin" || location.pathname === "/admin/dashboard";
    }
    return location.pathname === path;
  };

  return (
    <SidebarGroup>
      {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarMenu>
        {items.map((item) => {
          const active = isItemActive(item.path);
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                <Link to={item.path} className="flex items-center gap-2">
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
