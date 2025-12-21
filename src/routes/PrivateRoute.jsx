import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Loading from "../components/shared/Loading";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading while checking auth state
  if (loading) {
    return <Loading />;
  }

  // If user exists, allow access
  if (user) {
    return children;
  }

  // Redirect to login with current location
  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;
