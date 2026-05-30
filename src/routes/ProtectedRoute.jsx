import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loading } from "../components/ui/States";

// Guards routes that require a logged-in user. While the saved session is being
// re-validated we show a loader instead of bouncing to /login.
export default function ProtectedRoute({ children, role }) {
  const { isAuthenticated, initializing, user } = useAuth();
  const location = useLocation();

  if (initializing) {
    return <div className="container-page section"><Loading label="Checking your session…" /></div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (role && user?.type !== role) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
