import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, redirectTo }) => {
  const doctor = useSelector((state) => state.doctor.doctor);
  const isLoggedIn = !!localStorage.getItem("access_token") && !!doctor;

  if (isLoggedIn && redirectTo === "/detail") {
    return <Navigate to="/detail" />;
  }

  if (!isLoggedIn && redirectTo !== "/detail") {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
