import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
  children,
  allowedRole,
}) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" />;
  }

  // convert về array
  const roles = Array.isArray(allowedRole)
    ? allowedRole
    : [allowedRole];

  if (
    allowedRole &&
    !roles.includes(user.role)
  ) {
    return <Navigate to="/" />;
  }

  return children;
}