import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  User,
  LogOut,
  Heart,
  Mail,
  ChevronDown,
  Images,
  Calendar,
  MapPin,
} from "lucide-react";
import { logoutUser } from "@/lib/auth";

export function UserAccountMenu({ user, onOpenVault, vaultCount = 0 }) {
  const navigate = useNavigate();

  if (!user) {
    return (
      <Button asChild variant="outline" size="sm" className="h-8 text-xs px-3.5 rounded-full font-medium tracking-wider uppercase">
        <Link to="/auth">Sign In</Link>
      </Button>
    );
  }

  const isAdmin = Boolean(user && (user.role === "admin" || user.isAdmin === true));
  const initials = (user.name || user.email || "U").charAt(0).toUpperCase();
  const displayName = user.name ? user.name.split(" ")[0] : "Account";

  const handleSignOut = () => {
    logoutUser();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full border border-border/80 bg-background hover:bg-muted/50 transition-all cursor-pointer shadow-2xs outline-none focus-visible:ring-2 focus-visible:ring-amber-500/30"
          aria-label="User account menu"
        >
          <div className="size-6 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-400 font-serif font-semibold text-[11px] flex items-center justify-center shrink-0">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="size-full rounded-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
          <span className="text-xs font-medium text-foreground max-w-[90px] truncate">
            {displayName}
          </span>
          <ChevronDown className="size-3 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-64 p-2 rounded-2xl border border-border/80 bg-popover shadow-xl animate-in fade-in-0 zoom-in-95 duration-150"
      >
        <DropdownMenuLabel className="p-2 font-normal">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-400 font-serif font-semibold text-base flex items-center justify-center shrink-0">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="size-full rounded-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-foreground truncate">
                {user.name || "Collector"}
              </span>
              <span className="text-[10px] text-muted-foreground truncate">
                {user.email}
              </span>
              <div className="mt-1">
                <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-mono tracking-wider uppercase font-semibold ${
                  isAdmin
                    ? "bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {isAdmin ? "Administrator" : "Client Account"}
                </span>
              </div>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="my-1.5" />

        {isAdmin && (
          <>
            <DropdownMenuGroup>
              <DropdownMenuItem asChild className="p-2 rounded-lg cursor-pointer font-medium text-xs focus:bg-amber-500/10 focus:text-amber-800 dark:focus:text-amber-300">
                <Link to="/admin" className="flex items-center gap-2.5 w-full">
                  <ShieldCheck className="size-4 text-amber-600 dark:text-amber-400" />
                  <span className="flex-1">Admin Portal</span>
                  <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400">→</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="p-2 rounded-lg cursor-pointer text-xs">
                <Link to="/admin/inquiries" className="flex items-center gap-2.5 w-full">
                  <Mail className="size-4 text-muted-foreground" />
                  <span>Client Inquiries</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="p-2 rounded-lg cursor-pointer text-xs">
                <Link to="/admin/gallery" className="flex items-center gap-2.5 w-full">
                  <Images className="size-4 text-muted-foreground" />
                  <span>Manage Gallery</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="my-1.5" />
          </>
        )}

        <DropdownMenuGroup>
          {onOpenVault && (
            <DropdownMenuItem
              onClick={onOpenVault}
              className="p-2 rounded-lg cursor-pointer text-xs flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <Heart className="size-4 text-rose-500" />
                <span>Saved Heirlooms</span>
              </div>
              {vaultCount > 0 && (
                <span className="bg-rose-500/10 text-rose-600 dark:text-rose-400 font-mono text-[10px] px-1.5 py-0.5 rounded-full font-semibold">
                  {vaultCount}
                </span>
              )}
            </DropdownMenuItem>
          )}
          <DropdownMenuItem asChild className="p-2 rounded-lg cursor-pointer text-xs">
            <Link to="/#atelier" className="flex items-center gap-2.5 w-full">
              <Calendar className="size-4 text-neutral-600 dark:text-neutral-400" />
              <span>Bespoke Appointment</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="p-2 rounded-lg cursor-pointer text-xs">
            <Link to="/contact" className="flex items-center gap-2.5 w-full">
              <MapPin className="size-4 text-muted-foreground" />
              <span>Boutique Directions</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-1.5" />

        <DropdownMenuItem
          onClick={handleSignOut}
          className="p-2 rounded-lg cursor-pointer text-xs text-destructive focus:bg-destructive/10 focus:text-destructive flex items-center gap-2.5"
        >
          <LogOut className="size-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
