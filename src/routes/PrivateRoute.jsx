import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Loading from "../components/shared/Loading";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading while checking auth
  if (loading) {
    return <Loading />;
  }

  // User exists, allow access
  if (user) {
    return children;
  }

  // No user, redirect to login
  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;
