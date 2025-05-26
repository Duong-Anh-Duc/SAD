import { EditOutlined } from "@ant-design/icons";
import { Button, Card, Modal } from "antd";
import { useState } from "react";
import styled from "styled-components";
import UpdatePatientForm from "./UpdatePatientForm";

const StyledCard = styled(Card)`
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  margin-bottom: 32px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }

  .ant-card-body {
    padding: 32px;
  }

  p {
    font-size: 16px;
    margin-bottom: 16px;
    color: #333;
    display: flex;
    align-items: center;
    gap: 8px;

    strong {
      color: #28a745;
      margin-right: 8px;
      font-weight: 600;
    }
  }
`;

const PatientInfo = ({ patient, onUpdate }) => {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const showEditModal = () => setIsEditModalVisible(true);
  const handleEditOk = () => {
    setIsEditModalVisible(false);
    onUpdate();
  };
  const handleEditCancel = () => setIsEditModalVisible(false);

  if (!patient) return null;

  return (
    <>
      <StyledCard>
        <p>
          <strong>Tên:</strong> {patient.ten}
        </p>
        <p>
          <strong>Email:</strong> {patient.email}
        </p>
        <p>
          <strong>Ngày sinh:</strong> {patient.ngay_sinh}
        </p>
        <p>
          <strong>Giới tính:</strong> {patient.gioi_tinh}
        </p>
        <p>
          <strong>Số điện thoại:</strong> {patient.so_dt}
        </p>
        <p>
          <strong>Địa chỉ:</strong> {patient.dia_chi}
        </p>
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={showEditModal}
          style={{ marginBottom: 16 }}
        >
          Chỉnh sửa
        </Button>
      </StyledCard>
      <Modal
        title="Chỉnh sửa thông tin"
        visible={isEditModalVisible}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
        footer={null}
      >
        <UpdatePatientForm patient={patient} onSuccess={handleEditOk} />
      </Modal>
    </>
  );
};

export default PatientInfo;
