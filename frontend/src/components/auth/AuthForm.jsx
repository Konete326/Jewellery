import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AtSignIcon, KeyRoundIcon, UserIcon, ShieldAlert, Loader2 } from "lucide-react";
import { loginWithEmail, registerWithEmail } from "@/lib/auth";
import { toast } from "sonner";

export function AuthForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please provide both email and password.");
      return;
    }

    if (isSignUp && !name.trim()) {
      setError("Please provide your full name.");
      return;
    }

    try {
      setLoading(true);
      let user;
      if (isSignUp) {
        user = await registerWithEmail(name.trim(), email.trim(), password);
        toast.success("Account Created", {
          description: `Welcome to Khalil & Sons, ${user.name}`
        });
      } else {
        user = await loginWithEmail(email.trim(), password);
        toast.success("Welcome Back", {
          description: `Signed in as ${user.name}`
        });
      }

      const destination =
        user.role === "admin"
          ? location.state?.from?.pathname || "/admin"
          : "/";
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.message || "Authentication failed. Please verify credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <div className="flex items-center gap-2 p-3 text-xs rounded-lg border border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400">
          <ShieldAlert className="size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {isSignUp && (
        <div className="relative">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            type="text"
            className="pl-9 h-11"
            required={isSignUp}
            disabled={loading}
          />
          <UserIcon className="absolute left-3 top-3.5 size-4 text-muted-foreground pointer-events-none" />
        </div>
      )}

      <div className="relative">
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your.email@example.com"
          type="email"
          className="pl-9 h-11"
          required
          disabled={loading}
        />
        <AtSignIcon className="absolute left-3 top-3.5 size-4 text-muted-foreground pointer-events-none" />
      </div>

      <div className="relative">
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          type="password"
          className="pl-9 h-11"
          required
          disabled={loading}
        />
        <KeyRoundIcon className="absolute left-3 top-3.5 size-4 text-muted-foreground pointer-events-none" />
      </div>

      <Button
        className="w-full h-11 mt-2 text-xs uppercase tracking-widest flex items-center justify-center gap-2"
        type="submit"
        disabled={loading}
      >
        {loading && <Loader2 className="size-4 animate-spin" />}
        <span>{isSignUp ? "Create Account" : "Sign In"}</span>
      </Button>

      <div className="pt-2 text-center">
        <button
          type="button"
          disabled={loading}
          onClick={() => {
            setIsSignUp(!isSignUp);
            setError("");
          }}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
        </button>
      </div>
    </form>
  );
}
