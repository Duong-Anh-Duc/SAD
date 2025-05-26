import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, redirectTo }) => {
  const patient = useSelector((state) => state.patient.patient);
  const isLoggedIn = !!localStorage.getItem("access_token") && !!patient;

  // Nếu người dùng đã đăng nhập và cố truy cập login/register, chuyển hướng đến /detail
  if (isLoggedIn && redirectTo === "/detail") {
    return <Navigate to="/detail" />;
  }

  // Nếu người dùng chưa đăng nhập và cố truy cập trang yêu cầu đăng nhập (như /detail), chuyển hướng đến /login
  if (!isLoggedIn && redirectTo !== "/detail") {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
