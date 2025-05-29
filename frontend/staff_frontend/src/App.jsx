import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import styled from "styled-components";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import StaffHome from "./pages/StaffHome";
import StaffLogin from "./pages/StaffLogin";
import StaffRegister from "./pages/StaffRegister";
import { restoreSession } from "./redux/actions";

const AppContainer = styled.div`
  background: linear-gradient(135deg, #f8f9fa 0%, #e6f4ea 100%);
  min-height: 100vh;
`;

const App = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true); // Thêm trạng thái loading

  useEffect(() => {
    const initializeSession = async () => {
      try {
        await dispatch(restoreSession()); // Gọi restoreSession khi ứng dụng khởi động
      } finally {
        setIsLoading(false); // Hoàn thành khôi phục phiên, bỏ trạng thái loading
      }
    };
    initializeSession();
  }, [dispatch]);

  if (isLoading) {
    return <div>Loading...</div>; // Hiển thị loading trong khi khôi phục phiên
  }

  return (
    <Router>
      <AppContainer>
        <Navbar />
        <Routes>
          <Route path="/register" element={<StaffRegister />} />
          <Route path="/login" element={<StaffLogin />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute redirectTo="/login">
                <StaffHome />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<StaffLogin />} />
        </Routes>
      </AppContainer>
    </Router>
  );
};

export default App;
