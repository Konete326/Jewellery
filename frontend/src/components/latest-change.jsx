"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { XIcon, Activity } from "lucide-react";

const systemStatus = {
  badge: "SYSTEM STATUS",
  title: "Atelier Engine Live",
  description: "Connected to MongoDB Atlas",
  link: { href: "/admin", label: "Operational" }
};

export function LatestChange() {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={cn(
        "rounded-lg group/latest-change size-full min-h-27 justify-center border bg-background",
        "relative flex size-full flex-col gap-1 overflow-hidden px-4 pt-3 pb-1 *:text-nowrap",
        "transition-opacity group-data-[collapsible=icon]:pointer-events-none group-data-[collapsible=icon]:opacity-0"
      )}
    >
      <div className="flex items-center gap-1.5 font-light font-mono text-[10px] text-muted-foreground">
        <Activity className="size-3 text-emerald-500" />
        <span>{systemStatus.badge}</span>
      </div>
      <p className="font-heading font-medium text-xs">{systemStatus.title}</p>
      <span className="text-[10px] text-muted-foreground">
        {systemStatus.description}
      </span>
      <Button
        asChild
        className="w-max px-0 font-light text-xs text-emerald-600 dark:text-emerald-400"
        size="sm"
        variant="link"
      >
        <a href={systemStatus.link.href}>{systemStatus.link.label}</a>
      </Button>
      <Button
        className="absolute top-2 right-2 z-10 size-6 rounded-full opacity-0 transition-opacity group-hover/latest-change:opacity-100"
        onClick={() => setIsOpen(false)}
        size="icon-sm"
        variant="ghost"
      >
        <XIcon className="size-3.5 text-muted-foreground" />
      </Button>
    </div>
  );
}
