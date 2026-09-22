import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { Role } from "../types";

interface Props {
  children: ReactNode;
  role?: Role; // optionally restrict to one role, e.g. only INSTRUCTOR
}

// Wrap a page in <ProtectedRoute> to require login (and optionally a role)
// before it renders. This mirrors what authMiddleware + authorise() do on
// the backend, but on the frontend it's just for UX (hiding pages/showing
// a redirect) - the backend still enforces the real security rules.
export function ProtectedRoute({ children, role }: Props) {
  const { user, loading } = useAuth();

  if (loading) {
    return <p className="p-8 text-center text-gray-500">Loading...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
