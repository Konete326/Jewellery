import { useState } from "react";
import { Link } from "react-router-dom";
import { AppleIcon } from "@/components/apple-icon";
import { GithubIcon } from "@/components/github-icon";
import { GoogleIcon } from "@/components/google-icon";
import { Button } from "@/components/ui/button";
import { AuthDivider } from "@/components/auth-divider";
import { FloatingPaths } from "@/components/floating-paths";
import { ComingSoonModal } from "./ComingSoonModal";
import { AuthForm } from "./AuthForm";
import { ChevronLeftIcon, Sparkles } from "lucide-react";

export function AuthPage() {
  const [socialModal, setSocialModal] = useState({ open: false, provider: "" });

  return (
    <main className="relative min-h-screen md:h-screen md:overflow-hidden lg:grid lg:grid-cols-2 bg-background">
      <div className="relative hidden h-full flex-col border-r border-border bg-secondary p-10 lg:flex dark:bg-secondary/20">
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-background" />

        <div className="z-10 flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-md bg-amber-500/20 text-amber-600 border border-amber-500/30">
            <Sparkles className="size-4" />
          </div>
          <span className="font-serif tracking-widest text-lg font-light">KHALIL & SONS</span>
        </div>

        <div className="z-10 mt-auto">
          <blockquote className="space-y-3">
            <p className="font-serif italic text-2xl text-foreground/90 leading-snug">
              &ldquo;True luxury is found in the artist's touch, preserving the silent language of the goldsmith.&rdquo;
            </p>
            <footer className="text-xs uppercase tracking-widest text-muted-foreground">
              Florence Atelier • Est. 1924
            </footer>
          </blockquote>
        </div>

        <div className="absolute inset-0">
          <FloatingPaths position={1} />
          <FloatingPaths position={-1} />
        </div>
      </div>

      <div className="relative flex min-h-screen flex-col justify-center px-6 sm:px-12 py-10">
        <Button asChild className="absolute top-7 left-5 text-xs tracking-wider" variant="ghost">
          <Link to="/">
            <ChevronLeftIcon className="size-4" />
            Home
          </Link>
        </Button>

        <div className="mx-auto w-full max-w-sm space-y-4">
          <div className="flex flex-col space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium mb-1">
              <Sparkles className="size-3.5" />
              <span>Atelier Security Gateway</span>
            </div>
            <h1 className="font-semibold font-serif text-3xl tracking-tight text-foreground">
              Sign In or Join
            </h1>
            <p className="text-xs text-muted-foreground">
              Access your bespoke orders or sign in with admin credentials.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setSocialModal({ open: true, provider: "Google" })}
              className="w-full h-10 px-2"
            >
              <GoogleIcon className="size-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setSocialModal({ open: true, provider: "Apple" })}
              className="w-full h-10 px-2"
            >
              <AppleIcon className="size-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setSocialModal({ open: true, provider: "GitHub" })}
              className="w-full h-10 px-2"
            >
              <GithubIcon className="size-4" />
            </Button>
          </div>

          <AuthDivider>OR WITH EMAIL</AuthDivider>

          <AuthForm />

          <p className="text-center text-[11px] text-muted-foreground pt-4">
            Authorized Personnel: Enter registered credentials to unlock the Atelier Admin Portal.
          </p>
        </div>
      </div>

      <ComingSoonModal
        isOpen={socialModal.open}
        onClose={() => setSocialModal({ open: false, provider: "" })}
        provider={socialModal.provider}
      />
    </main>
  );
}
