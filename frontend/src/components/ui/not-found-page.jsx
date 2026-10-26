import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Frown } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export function NotFoundPage({
  className,
  homeHref = "/",
  title = "404",
  description = "Oops! Page not found",
  helperText = "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.",
  backLabel = "Back to Home",
  icon,
  buttonClassName,
  extraActions,
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.5 }}
      className={cn("flex min-h-[60svh] flex-col items-center justify-center space-y-6 text-center px-4", className)}
    >
      <motion.div
        animate={shouldReduceMotion ? { rotate: 0 } : { rotate: [0, 5, -5, 0] }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : {
                duration: 2,
                ease: "easeInOut",
                repeat: Number.POSITIVE_INFINITY,
              }
        }
        className="inline-block"
      >
        {icon ?? <Frown className="mx-auto h-24 w-24 text-muted-foreground" />}
      </motion.div>
      <h1 className="font-bold text-4xl sm:text-5xl text-foreground font-serif tracking-tight">{title}</h1>
      <p className="text-muted-foreground text-lg sm:text-xl font-light">{description}</p>
      <p className="mx-auto max-w-md text-muted-foreground text-xs sm:text-sm font-light leading-relaxed">{helperText}</p>
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Link
          to={homeHref}
          className={cn(
            "inline-flex items-center rounded-xl bg-primary px-5 py-2.5 font-medium text-primary-foreground text-xs uppercase tracking-wider transition-all hover:bg-primary/90 shadow-xs cursor-pointer",
            buttonClassName,
          )}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {backLabel}
        </Link>
        {extraActions}
      </div>
    </motion.div>
  );
}

export default NotFoundPage;
