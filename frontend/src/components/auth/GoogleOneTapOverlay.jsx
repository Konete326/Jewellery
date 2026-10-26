import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { GoogleIcon } from '@/components/google-icon';
import { Button } from '@/components/ui/button';
import { X, Loader2, Gem } from 'lucide-react';
import { getAuthUser, loginWithGoogle } from '@/lib/auth';
import { toast } from 'sonner';

export function GoogleOneTapOverlay() {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(getAuthUser());

  const isAuthOrAdmin =
    location.pathname.startsWith('/auth') ||
    location.pathname.startsWith('/admin') ||
    location.pathname === '/login' ||
    location.pathname === '/signup';

  useEffect(() => {
    const handleAuthChange = (e) => {
      const current = e.detail || getAuthUser();
      setUser(current);
      if (current) setVisible(false);
    };

    const handleOpenTrigger = () => {
      if (!getAuthUser()) {
        setVisible(true);
      }
    };

    window.addEventListener('khalil_auth_change', handleAuthChange);
    window.addEventListener('open_google_onetap', handleOpenTrigger);

    return () => {
      window.removeEventListener('khalil_auth_change', handleAuthChange);
      window.removeEventListener('open_google_onetap', handleOpenTrigger);
    };
  }, []);

  useEffect(() => {
    if (user || isAuthOrAdmin) {
      setVisible(false);
      return;
    }

    const dismissed = sessionStorage.getItem('khalil_onetap_dismissed');
    if (!dismissed) {
      const timer = setTimeout(() => {
        if (!getAuthUser()) {
          setVisible(true);
        }
      }, 2400);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, user, isAuthOrAdmin]);

  const handleDismiss = () => {
    sessionStorage.setItem('khalil_onetap_dismissed', 'true');
    setVisible(false);
  };

  const handleSignIn = async () => {
    try {
      setLoading(true);
      const signedInUser = await loginWithGoogle();
      toast.success(`Welcome, ${signedInUser.name || 'Valued Collector'}!`, {
        description: 'Instant 1-Tap Google Sign-In Successful'
      });
      setVisible(false);
    } catch (err) {
      if (err?.code !== 'auth/popup-closed-by-user') {
        toast.error('Google Sign-In Failed', {
          description: err.message || 'Unable to connect Google account.'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!visible || user || isAuthOrAdmin) return null;

  return (
    <aside
      role="region"
      aria-label="Google One-Tap Sign In"
      className="fixed bottom-4 right-4 left-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 sm:max-w-sm w-auto animate-in slide-in-from-bottom-5 fade-in duration-300"
    >
      <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-card/95 backdrop-blur-md p-5 shadow-[0_12px_40px_-10px_rgba(217,119,6,0.22)]">
        <div className="flex items-center justify-between pb-3 border-b border-border/70">
          <div className="flex items-center gap-2.5">
            <img
              src="/assets/logo.png"
              alt="Khalil & Sons"
              className="size-6 object-contain"
            />
            <div>
              <span className="font-serif tracking-widest text-xs font-semibold text-foreground">
                KHALIL & SONS
              </span>
              <span className="text-[10px] text-muted-foreground block -mt-0.5">
                Atelier Karachi • Est. 1992
              </span>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            aria-label="Dismiss sign-in prompt"
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="py-3.5 space-y-1">
          <div className="flex items-center gap-1.5 text-foreground">
            <Gem className="size-3.5 text-neutral-600 dark:text-neutral-300" />
            <h3 className="font-serif text-sm font-semibold text-foreground">
              Sign In with Google
            </h3>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            1-Click authentication to rate masterpieces, preserve bridal favorites, and receive concierge appraisals.
          </p>
        </div>

        <div className="space-y-2 pt-1">
          <Button
            type="button"
            disabled={loading}
            onClick={handleSignIn}
            className="w-full h-10 px-4 flex items-center justify-center gap-2.5 bg-foreground text-background hover:bg-foreground/90 transition-all font-medium text-xs shadow-xs cursor-pointer"
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin text-amber-500" />
            ) : (
              <GoogleIcon className="size-4 shrink-0" />
            )}
            <span>{loading ? 'Connecting with Google...' : 'Continue with Google'}</span>
          </Button>

          <div className="flex items-center justify-between px-1 text-[11px] text-muted-foreground">
            <button
              onClick={handleDismiss}
              className="hover:text-foreground transition-colors cursor-pointer"
            >
              Not now
            </button>
            <Link
              to="/auth"
              onClick={() => setVisible(false)}
              className="hover:text-foreground transition-colors hover:underline"
            >
              Use email & password
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
