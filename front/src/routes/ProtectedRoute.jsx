import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("jwtToken");
  let isAuthenticated = false;
  let userRoleFromToken = null;

  if (token) {
    try {
      const decodedToken = jwtDecode(token);

      if (decodedToken.exp * 1000 > Date.now()) {
        isAuthenticated = true;
        userRoleFromToken = decodedToken.role;
        console.log(userRoleFromToken);
      } else {
        localStorage.removeItem("jwtToken");
        isAuthenticated = false;
      }
    } catch (error) {
      console.error("Error decoding JWT token or invalid token:", error);
      localStorage.removeItem("jwtToken");
      isAuthenticated = false;
    }
  }

  if (!isAuthenticated) {
    console.log("User not authenticated. Redirecting to '/'");
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    if (!userRoleFromToken || !allowedRoles.includes(userRoleFromToken)) {
      console.warn(
        `User role '${userRoleFromToken}' not in allowed roles: [${allowedRoles.join(
          ", "
        )}].`
      );

      switch (userRoleFromToken) {
        case "ADMIN":
          return <Navigate to="/admin/dashboard" replace />;
        case "COMPANY":
          return <Navigate to="/socite/dashboard" replace />;
        case "CLIENT":
          return <Navigate to="/client/dashboard" replace />;
        case "DELIVERY_PERSONNEL":
          return <Navigate to="/livreur/dashboard" replace />;
        default:
          return <Navigate to="/unauthorized" replace />;
      }
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
