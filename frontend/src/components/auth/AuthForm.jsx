import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AtSignIcon, KeyRoundIcon, UserIcon, ShieldAlert } from "lucide-react";

export function AuthForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || "admin@gmail.com";
  const adminPass = import.meta.env.VITE_ADMIN_PASSWORD || "admin123";

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please provide both email and password.");
      return;
    }

    if (email.trim().toLowerCase() === adminEmail.toLowerCase()) {
      if (password === adminPass) {
        localStorage.setItem("auth_user", JSON.stringify({ email, role: "admin", name: "Admin" }));
        const destination = location.state?.from?.pathname || "/admin";
        navigate(destination, { replace: true });
        return;
      } else {
        setError("Invalid admin email or password. Please try again.");
        return;
      }
    }

    localStorage.setItem("auth_user", JSON.stringify({ email, name: name || "Customer", role: "user" }));
    navigate("/");
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
        />
        <KeyRoundIcon className="absolute left-3 top-3.5 size-4 text-muted-foreground pointer-events-none" />
      </div>

      <Button className="w-full h-11 mt-2 text-xs uppercase tracking-widest" type="submit">
        {isSignUp ? "Create Account" : "Sign In"}
      </Button>

      <div className="pt-2 text-center">
        <button
          type="button"
          onClick={() => {
            setIsSignUp(!isSignUp);
            setError("");
          }}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
        </button>
      </div>
    </form>
  );
}
