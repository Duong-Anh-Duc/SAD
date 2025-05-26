import { DollarOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import { getPatientDetail } from "../redux/actions";

const Container = styled.div`
  max-width: 1000px;
  margin: 40px auto;
  padding: 0 16px;
`;

const Title = styled.h2`
  font-size: 30px;
  font-weight: 700;
  color: #28a745;
  margin-bottom: 24px;
`;

const StyledCard = styled(Card)`
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
`;

const ActionButton = styled(Button)`
  background: #28a745;
  border-color: #28a745;
  color: white;
  border-radius: 10px;
  margin: 8px;
  &:hover {
    background: #218838;
    border-color: #218838;
  }
`;

const PatientDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const patientData = useSelector((state) => state.patient.patient);

  useEffect(() => {
    const patientId = localStorage.getItem("patient_id");
    if (patientId) {
      dispatch(getPatientDetail(patientId)).catch(() => {
        toast.error("Không lấy được thông tin bệnh nhân!");
        navigate("/login");
      });
    } else {
      navigate("/login");
    }
  }, [dispatch, navigate]);

  if (!patientData) return <div>Đang tải...</div>;

  const patient = patientData.patient || {};

  return (
    <Container>
      <Title>Chào mừng, {patient.ten}!</Title>
      <StyledCard>
        <p>
          <strong>Email:</strong> {patient.email}
        </p>
        <p>
          <strong>Số điện thoại:</strong> {patient.so_dt}
        </p>
      </StyledCard>
      <StyledCard title="Hành động nhanh">
        <ActionButton icon={<UserOutlined />}>
          <Link to="/detail">Xem/Cập nhật thông tin</Link>
        </ActionButton>
        <ActionButton icon={<UserOutlined />}>
          <Link to="/health-insurance">Quản lý bảo hiểm</Link>
        </ActionButton>
        <ActionButton icon={<UserOutlined />}>
          <Link to="/doctors">Tìm bác sĩ</Link>
        </ActionButton>
        <ActionButton icon={<DollarOutlined />}>
          <Link to="/payments">Thanh toán hóa đơn</Link>
        </ActionButton>
      </StyledCard>
    </Container>
  );
};

export default PatientDashboard;
