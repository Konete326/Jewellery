import { Navigate, useLocation } from "react-router-dom";
import { getAuthUser, getAuthToken } from "@/lib/auth";

export function ProtectedRoute({ children, requiredRole = null }) {
  const location = useLocation();
  const user = getAuthUser();
  const token = getAuthToken();

  if (!user || !token || (requiredRole && user.role !== requiredRole)) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
}
