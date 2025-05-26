import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, redirectTo }) => {
  const patient = useSelector((state) => state.patient.patient);
  const isLoggedIn = !!localStorage.getItem("access_token") && !!patient;

  if (isLoggedIn && redirectTo === "/dashboard") {
    return <Navigate to="/dashboard" />;
  }

  if (!isLoggedIn && redirectTo !== "/dashboard") {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
