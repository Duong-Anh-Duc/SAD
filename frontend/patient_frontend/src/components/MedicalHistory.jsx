import { UserOutlined } from "@ant-design/icons";
import { Table, Tag } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { getMedicalHistory } from "../redux/actions";

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
    text-align: center;
  }

  .ant-table-tbody > tr:hover > td {
    background: #e6f4ea;
  }
`;

const MedicalHistory = ({ patientId }) => {
  const dispatch = useDispatch();
  const medicalHistories = useSelector(
    (state) => state.patient.medicalHistories || []
  );

  useEffect(() => {
    dispatch(getMedicalHistory(patientId)); // Gọi API lấy lịch sử khám bệnh
  }, [dispatch, patientId]);

  // Thêm log để kiểm tra dữ liệu
  console.log("Medical Histories:", medicalHistories);

  // Đảm bảo chỉ hiển thị các cuộc hẹn có trạng thái hoan_thanh
  const filteredHistories = medicalHistories.filter(
    (appt) => appt.trang_thai === "hoan_thanh"
  );

  const columns = [
    {
      title: "Bác sĩ ID",
      dataIndex: "doctor_id",
      key: "doctor_id",
      align: "center",
    },
    {
      title: "Ngày khám",
      dataIndex: "ngay_kham",
      key: "ngay_kham",
      align: "center",
    },
    {
      title: "Giờ khám",
      dataIndex: "gio_kham",
      key: "gio_kham",
      align: "center",
    },
    {
      title: "Trạng thái",
      dataIndex: "trang_thai",
      key: "trang_thai",
      align: "center",
      render: (trang_thai) => {
        let color, displayText;
        switch (trang_thai) {
          case "cho_xac_nhan":
            color = "gold";
            displayText = "Chờ xác nhận";
            break;
          case "da_xac_nhan":
            color = "blue";
            displayText = "Đã xác nhận";
            break;
          case "hoan_thanh":
            color = "green";
            displayText = "Hoàn thành";
            break;
          case "da_huy":
            color = "red";
            displayText = "Đã hủy";
            break;
          default:
            color = "default";
            displayText = trang_thai;
        }
        return <Tag color={color}>{displayText}</Tag>;
      },
    },
    { title: "Mô tả", dataIndex: "mo_ta", key: "mo_ta", align: "center" },
  ];

  return (
    <>
      <Title>
        <UserOutlined style={{ fontSize: "30px", color: "#28a745" }} />
        Lịch sử khám bệnh
      </Title>
      <StyledTable
        columns={columns}
        dataSource={filteredHistories}
        rowKey="id"
      />
    </>
  );
};

export default MedicalHistory;
