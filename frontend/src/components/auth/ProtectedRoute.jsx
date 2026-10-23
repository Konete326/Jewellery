import { Navigate, useLocation } from "react-router-dom";

export function ProtectedRoute({ children, requiredRole = "admin" }) {
  const location = useLocation();

  const getAuthenticatedUser = () => {
    try {
      const stored = localStorage.getItem("auth_user");
      if (!stored) return null;
      return JSON.parse(stored);
    } catch {
      return null;
    }
  };

  const user = getAuthenticatedUser();

  if (!user || user.role !== requiredRole) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
}
