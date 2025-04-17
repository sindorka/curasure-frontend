import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";

interface ProtectedRouteProps {
  children: ReactNode;
  role?: string;
}

const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const { token, user, success } = useAppSelector((state) => state.auth);

  if (!token || !success) {
    return <Navigate to="/login" />;
  }

  if (user.role !== role) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;