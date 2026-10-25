import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AppleIcon } from "@/components/apple-icon";
import { GithubIcon } from "@/components/github-icon";
import { GoogleIcon } from "@/components/google-icon";
import { Button } from "@/components/ui/button";
import { AuthDivider } from "@/components/auth-divider";
import { AuthGalleryShowcase } from "./AuthGalleryShowcase";
import { ComingSoonModal } from "./ComingSoonModal";
import { AuthForm } from "./AuthForm";
import { ChevronLeftIcon, ShieldAlert } from "lucide-react";

export function AuthPage() {
  const location = useLocation();
  const [socialModal, setSocialModal] = useState({ open: false, provider: "" });
  const isRedirectedFromAdmin = location.state?.from?.pathname === "/admin";

  return (
    <main className="relative min-h-screen md:h-screen md:overflow-hidden lg:grid lg:grid-cols-2 bg-background">
      <AuthGalleryShowcase />

      <div className="relative flex min-h-screen flex-col justify-center px-6 sm:px-12 py-10">
        <Button asChild className="absolute top-7 left-5 text-xs tracking-wider" variant="ghost">
          <Link to="/">
            <ChevronLeftIcon className="size-4" />
            Home
          </Link>
        </Button>

        <div className="mx-auto w-full max-w-sm space-y-4">
          <Link to="/" className="lg:hidden flex items-center gap-2.5 mb-2 w-fit">
            <img
              src="/assets/logo.png"
              alt="Khalil & Sons"
              className="size-7 object-contain"
            />
            <span className="font-serif tracking-widest text-base font-light text-foreground">
              KHALIL & SONS
            </span>
          </Link>

          <div className="flex flex-col space-y-1">
            <h1 className="font-semibold font-serif text-3xl tracking-tight text-foreground">
              Sign In or Join
            </h1>
            <p className="text-xs text-muted-foreground">
              Sign in to manage your orders, saved items, and profile.
            </p>
          </div>

          {isRedirectedFromAdmin && (
            <div className="flex items-center gap-2 p-3 text-xs rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300">
              <ShieldAlert className="size-4 shrink-0" />
              <span>Admin login required to open the admin panel.</span>
            </div>
          )}

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
            Khalil & Sons • Safe & Secure Sign In
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
