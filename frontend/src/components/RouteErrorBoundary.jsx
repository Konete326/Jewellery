import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { RotateCw, Home } from 'lucide-react';

class RouteErrorBoundaryInner extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Route error caught:', error, errorInfo);
  }

  componentDidUpdate(prevProps) {
    if (this.props.location?.pathname !== prevProps.location?.pathname) {
      if (this.state.hasError) {
        this.setState({ hasError: false, error: null });
      }
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[70vh] flex items-center justify-center p-6 bg-background text-foreground">
          <div className="max-w-md w-full text-center space-y-6 rounded-2xl border border-border/80 bg-card p-8 shadow-sm">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/5 text-amber-800 dark:text-amber-300 font-mono text-xs uppercase tracking-widest">
              <span>AU · 916.6</span>
              <span className="text-muted-foreground/40">•</span>
              <span>ATELIER SYSTEM</span>
            </div>
            <div className="space-y-2">
              <h2 className="font-serif text-2xl font-semibold tracking-tight">Something Went Wrong</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                An unexpected display interruption occurred while loading this page. You can safely reload or return to the main showroom.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-10 px-5 rounded-xl bg-foreground text-background text-xs font-mono uppercase tracking-wider font-medium hover:bg-foreground/90 transition-colors shadow-xs cursor-pointer"
              >
                <RotateCw className="size-3.5" />
                <span>Reload Page</span>
              </button>
              <Link
                to="/"
                onClick={() => this.setState({ hasError: false, error: null })}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-10 px-5 rounded-xl border border-border bg-background hover:bg-muted/50 text-foreground text-xs font-mono uppercase tracking-wider font-medium transition-colors cursor-pointer"
              >
                <Home className="size-3.5" />
                <span>Return Home</span>
              </Link>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export function RouteErrorBoundary({ children }) {
  const location = useLocation();
  return <RouteErrorBoundaryInner location={location}>{children}</RouteErrorBoundaryInner>;
}

export default RouteErrorBoundary;
