import { Card } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import useAuth from "../hooks/useAuth";
import { getDoctorDetail } from "../redux/actions";

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
`;

const DoctorDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const doctor = useSelector((state) => state.patient.doctor);
  const { handleApiError } = useAuth();

  useEffect(() => {
    dispatch(getDoctorDetail(id)).catch(handleApiError);
  }, [dispatch, id, handleApiError]);

  if (!doctor) return <div>Đang tải...</div>;

  return (
    <Container>
      <Title>Thông tin bác sĩ</Title>
      <StyledCard>
        <p>
          <strong>Tên:</strong> {doctor.ten}
        </p>
        <p>
          <strong>Khoa:</strong> {doctor.khoa}
        </p>
        <p>
          <strong>Chức vụ:</strong> {doctor.chuc_vu}
        </p>
        <p>
          <strong>Số điện thoại:</strong> {doctor.so_dt}
        </p>
        <p>
          <strong>Giới thiệu:</strong> {doctor.gioi_thieu}
        </p>
      </StyledCard>
    </Container>
  );
};

export default DoctorDetail;
