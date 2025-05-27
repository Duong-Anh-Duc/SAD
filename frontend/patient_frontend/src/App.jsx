import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import styled from "styled-components";
import ManageHealthInsurance from "./components/ManageHealthInsurance";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import DoctorDetail from "./pages/DoctorDetail";
import DoctorList from "./pages/DoctorList";
import PatientDashboard from "./pages/PatientDashboard";
import PatientDetail from "./pages/PatientDetail";
import PatientLogin from "./pages/PatientLogin";
import PatientRegister from "./pages/PatientRegister";
import PaymentList from "./pages/PaymentList";
import { restoreSession } from "./redux/actions";

const AppContainer = styled.div`
  background: linear-gradient(135deg, #f8f9fa 0%, #e6f4ea 100%);
  min-height: 100vh;
`;

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  return (
    <Router>
      <AppContainer>
        <Navbar />
        <Routes>
          <Route
            path="/register"
            element={
              <ProtectedRoute redirectTo="/dashboard">
                <PatientRegister />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={
              <ProtectedRoute redirectTo="/dashboard">
                <PatientLogin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute redirectTo="/login">
                <PatientDashboard />
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
            path="/doctors"
            element={
              <ProtectedRoute redirectTo="/login">
                <DoctorList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctors/:id"
            element={
              <ProtectedRoute redirectTo="/login">
                <DoctorDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payments"
            element={
              <ProtectedRoute redirectTo="/login">
                <PaymentList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/health-insurance"
            element={
              <ProtectedRoute redirectTo="/login">
                <ManageHealthInsurance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute redirectTo="/dashboard">
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
