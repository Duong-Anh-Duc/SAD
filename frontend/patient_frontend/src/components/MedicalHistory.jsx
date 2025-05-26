import { UserOutlined } from "@ant-design/icons";
import { Table } from "antd";
import styled from "styled-components";

const Title = styled.h2`
  font-size: 30px;
  font-weight: 700;
  color: #28a745;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StyledTable = styled(Table)`
  .ant-table-thead > tr > th {
    background: #28a745;
    color: white;
    font-weight: 600;
  }

  .ant-table-tbody > tr:hover > td {
    background: #e6f4ea;
  }
`;

const MedicalHistory = ({ medicalHistories }) => {
  const columns = [
    { title: "Ngày khám", dataIndex: "ngay_kham", key: "ngay_kham" },
    { title: "Chẩn đoán", dataIndex: "chan_doan", key: "chan_doan" },
    { title: "Điều trị", dataIndex: "dieu_tri", key: "dieu_tri" },
    { title: "Bác sĩ", dataIndex: "bac_si", key: "bac_si" },
  ];

  return (
    <>
      <Title>
        <UserOutlined style={{ fontSize: "30px", color: "#28a745" }} />
        Lịch sử khám bệnh
      </Title>
      <StyledTable
        columns={columns}
        dataSource={medicalHistories}
        rowKey="id"
      />
    </>
  );
};

export default MedicalHistory;
