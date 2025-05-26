import { DollarOutlined } from "@ant-design/icons";
import { Button, Table } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import { getPayments, updatePaymentStatus } from "../redux/actions";

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
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ErrorText = styled.p`
  color: #ff4d4f;
  margin-bottom: 16px;
  font-weight: 500;
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

const PayButton = styled(Button)`
  background: #28a745;
  border-color: #28a745;
  color: white;
  border-radius: 8px;
  transition: background-color 0.3s ease, transform 0.3s ease;

  &:hover {
    background: #218838;
    border-color: #218838;
    transform: scale(1.02);
  }
`;

const PaymentList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const payments = useSelector((state) => state.patient.payments);
  const patient = useSelector((state) => state.patient.patient);
  const error = useSelector((state) => state.patient.error);

  useEffect(() => {
    if (patient?.patient?.id) {
      dispatch(getPayments(patient.patient.id)).catch(() => {
        toast.error("Không lấy được danh sách hóa đơn!", {
          position: "top-right",
          autoClose: 3000,
        });
        if (error?.message === "Lỗi làm mới token") {
          navigate("/login");
        }
      });
    }
  }, [dispatch, navigate, patient, error]);

  const handlePay = async (paymentId) => {
    try {
      await dispatch(updatePaymentStatus(paymentId, "da_thanh_toan"));
      toast.success("Thanh toán thành công!", {
        position: "top-right",
        autoClose: 3000,
      });
      dispatch(getPayments(patient.patient.id));
    } catch (error) {
      toast.error("Thanh toán thất bại!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const columns = [
    {
      title: "Mã cuộc hẹn",
      dataIndex: "appointment_id",
      key: "appointment_id",
    },
    { title: "Số tiền", dataIndex: "so_tien", key: "so_tien" },
    { title: "Trạng thái", dataIndex: "trang_thai", key: "trang_thai" },
    { title: "Phương thức", dataIndex: "phuong_thuc", key: "phuong_thuc" },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) =>
        record.trang_thai === "chua_thanh_toan" ? (
          <PayButton onClick={() => handlePay(record.id)}>Thanh toán</PayButton>
        ) : null,
    },
  ];

  return (
    <Container>
      <Title>
        <DollarOutlined style={{ fontSize: "30px", color: "#28a745" }} />
        Danh sách hóa đơn
      </Title>
      {error && <ErrorText>{error.message}</ErrorText>}
      <StyledTable columns={columns} dataSource={payments} rowKey="id" />
    </Container>
  );
};

export default PaymentList;
