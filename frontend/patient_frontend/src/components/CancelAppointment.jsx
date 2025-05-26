import { Button } from "antd";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import styled from "styled-components";
import { cancelAppointment } from "../redux/actions";

const CancelButton = styled(Button)`
  background: #ff4d4f;
  border-color: #ff4d4f;
  color: white;
  border-radius: 8px;
  transition: background-color 0.3s ease, transform 0.3s ease;

  &:hover {
    background: #d9363e;
    border-color: #d9363e;
    transform: scale(1.02);
  }
`;

const CancelAppointment = ({ appointmentId, onSuccess }) => {
  const dispatch = useDispatch();

  const handleCancel = async () => {
    try {
      await dispatch(cancelAppointment(appointmentId));
      toast.success("Hủy lịch khám thành công!", {
        position: "top-right",
        autoClose: 3000,
      });
      onSuccess();
    } catch (error) {
      toast.error("Hủy lịch khám thất bại!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return <CancelButton onClick={handleCancel}>Hủy</CancelButton>;
};

export default CancelAppointment;
