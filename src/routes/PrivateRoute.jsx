import { Navigate, useLocation } from "react-router-dom";
import Loading from "../components/shared/Loading";

const PrivateRoute = ({ children }) => {
  // Temporary - allow all access for now
  const user = true;
  const loading = false;
  const location = useLocation();

  if (loading) {
    return <Loading />;
  }

  if (user) {
    return children;
  }

  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;
