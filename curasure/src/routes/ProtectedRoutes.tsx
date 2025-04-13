// import { ReactNode } from "react";
// import { Navigate } from "react-router-dom";

// interface ProtectedRouteProps {
//     children: ReactNode;
//     role?: string;
// }

// const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
//     const isAuthenticated = localStorage.getItem("token");
//     const userRole = localStorage.getItem("role");

//     if (!isAuthenticated) {
//         return <Navigate to="/login" />;
//     }

//     if (role && userRole !== role) {
//         return <Navigate to="/login" />;
//     }

//     return children;
// };

// export default ProtectedRoute;

import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";

interface ProtectedRouteProps {
  children: ReactNode;
  role?: string;
}

const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  // Get authentication state from Redux store
  const { token, role: userRole } = useAppSelector((state) => state.auth);
  console.log('protected routes', token, role);
  // If no token is found in Redux state, redirect to login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // If role is specified and doesn't match, redirect to login
  // if (role && userRole !== role) {
  //   return <Navigate to="/unauthorized" replace />; // Consider creating an unauthorized page
  // }

  return <>{children}</>;
};

export default ProtectedRoute;