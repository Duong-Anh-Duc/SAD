import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Appointments from "../components/Appointments";
import MedicalHistory from "../components/MedicalHistory";
import PatientInfo from "../components/PatientInfo";
import useAuth from "../hooks/useAuth";
import { getPatientDetail } from "../redux/actions";

const Container = styled.div`
  max-width: 1000px;
  margin: 40px auto;
  padding: 0 16px;
`;

const PatientDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const patientData = useSelector((state) => state.patient.patient);
  const { handleApiError } = useAuth();

  useEffect(() => {
    const patientId = localStorage.getItem("patient_id");
    if (patientId) {
      dispatch(getPatientDetail(patientId)).catch(handleApiError);
    } else {
      navigate("/login");
    }
  }, [dispatch, navigate]);

  if (!patientData)
    return (
      <div style={{ textAlign: "center", margin: "40px", fontSize: "18px" }}>
        Đang tải...
      </div>
    );

  const patient = patientData.patient || {};
  const appointments = patientData.appointments || [];

  const handleUpdate = () => {
    dispatch(getPatientDetail(patient.id));
  };

  return (
    <Container>
      <PatientInfo patient={patient} onUpdate={handleUpdate} />
      <MedicalHistory patientId={patient.id} />{" "}
      {/* Truyền patientId thay vì medicalHistories */}
      <Appointments
        appointments={appointments}
        patientId={patient.id}
        onUpdate={handleUpdate}
      />
    </Container>
  );
};

export default PatientDetail;
