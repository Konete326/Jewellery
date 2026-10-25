import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GoogleIcon } from "@/components/google-icon";
import { Button } from "@/components/ui/button";
import { AuthDivider } from "@/components/auth-divider";
import { AuthGalleryShowcase } from "./AuthGalleryShowcase";
import { AuthForm } from "./AuthForm";
import { ChevronLeftIcon, ShieldAlert, Loader2, ShieldCheck, LogOut, ArrowRight } from "lucide-react";
import { loginWithGoogle, getAuthUser, logoutUser } from "@/lib/auth";
import { toast } from "sonner";

export function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [user, setUser] = useState(() => getAuthUser());
  const isRedirectedFromAdmin = location.state?.from?.pathname === "/admin";

  useEffect(() => {
    const syncAuth = () => setUser(getAuthUser());
    window.addEventListener("khalil_auth_change", syncAuth);
    window.addEventListener("storage", syncAuth);
    return () => {
      window.removeEventListener("khalil_auth_change", syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      const authedUser = await loginWithGoogle();
      toast.success(`Welcome, ${authedUser.name || "Collector"}!`, {
        description: "Authenticated securely via Google"
      });
      const destination =
        authedUser.role === "admin" || isRedirectedFromAdmin
          ? location.state?.from?.pathname || "/admin"
          : "/";
      navigate(destination, { replace: true });
    } catch (error) {
      if (error?.code !== "auth/popup-closed-by-user") {
        toast.error("Google Authentication Failed", {
          description: error.message || "Could not sign in with Google account."
        });
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSignOut = () => {
    logoutUser();
    setUser(null);
    toast.info("Signed Out", { description: "You have been disconnected from your session." });
  };

  const isAdmin = user && (user.role === "admin" || user.isAdmin === true);

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

          {user ? (
            <div className="space-y-5 rounded-2xl border border-border/80 bg-card p-6 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 font-serif font-semibold text-lg flex items-center justify-center border border-amber-500/30">
                  {(user.name || user.email || "U").charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col min-w-0">
                  <h2 className="font-serif text-lg font-semibold text-foreground truncate">{user.name || "Customer"}</h2>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-muted/60 text-xs flex items-center justify-between">
                <span className="text-muted-foreground">Account Status</span>
                <span className="font-medium text-foreground capitalize">
                  {isAdmin ? "Administrator" : "Client Account"}
                </span>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                {isAdmin && (
                  <Button asChild className="w-full bg-foreground text-background">
                    <Link to="/admin" className="flex items-center justify-center gap-2">
                      <ShieldCheck className="size-4 text-amber-500" />
                      <span>Open Admin Portal</span>
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </Button>
                )}
                <Button asChild variant="outline" className="w-full">
                  <Link to="/" className="flex items-center justify-center gap-2">
                    <span>Return to Store</span>
                  </Link>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleSignOut}
                  className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive flex items-center justify-center gap-2 mt-1"
                >
                  <LogOut className="size-4" />
                  <span>Sign Out</span>
                </Button>
              </div>
            </div>
          ) : (
            <>
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

              <Button
                type="button"
                variant="outline"
                disabled={googleLoading}
                onClick={handleGoogleSignIn}
                className="w-full h-11 px-4 flex items-center justify-center gap-3 cursor-pointer border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all font-medium text-xs shadow-xs"
              >
                {googleLoading ? (
                  <Loader2 className="size-4 animate-spin text-amber-600" />
                ) : (
                  <GoogleIcon className="size-4 shrink-0" />
                )}
                <span>{googleLoading ? "Connecting with Google..." : "Continue with Google"}</span>
              </Button>

              <AuthDivider>OR WITH EMAIL</AuthDivider>

              <AuthForm />

              <p className="text-center text-[11px] text-muted-foreground pt-4">
                Khalil & Sons • Safe & Secure Sign In
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
