import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import styled from "styled-components";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute"; // Thêm ProtectedRoute
import PatientDetail from "./pages/PatientDetail";
import PatientLogin from "./pages/PatientLogin";
import PatientRegister from "./pages/PatientRegister";

const AppContainer = styled.div`
  background: linear-gradient(135deg, #f8f9fa 0%, #e6f4ea 100%);
  min-height: 100vh;
`;

const App = () => {
  return (
    <Router>
      <AppContainer>
        <Navbar />
        <Routes>
          <Route
            path="/register"
            element={
              <ProtectedRoute redirectTo="/detail">
                <PatientRegister />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={
              <ProtectedRoute redirectTo="/detail">
                <PatientLogin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/detail"
            element={
              <ProtectedRoute redirectTo="/login">
                <PatientDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute redirectTo="/detail">
                <PatientLogin />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AppContainer>
    </Router>
  );
};

export default App;
