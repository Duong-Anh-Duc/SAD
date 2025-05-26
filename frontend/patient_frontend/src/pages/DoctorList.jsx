import { UserOutlined } from "@ant-design/icons";
import { Avatar, List } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import { getAllDoctors } from "../redux/actions";

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

const StyledList = styled(List)`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  .ant-list-item {
    padding: 20px 24px;
    border-bottom: 1px solid #e8e8e8;
    transition: background-color 0.3s ease, transform 0.3s ease;

    &:hover {
      background-color: #e6f4ea;
      transform: translateX(5px);
    }
  }

  .ant-list-item-meta-title {
    font-weight: 600;
    color: #28a745;
  }

  .ant-list-item-meta-description {
    color: #555;
  }
`;

const DoctorList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const doctors = useSelector((state) => state.patient.doctors);
  const error = useSelector((state) => state.patient.error);

  useEffect(() => {
    dispatch(getAllDoctors()).catch(() => {
      toast.error("Không lấy được danh sách bác sĩ!", {
        position: "top-right",
        autoClose: 3000,
      });
      if (error?.message === "Lỗi làm mới token") {
        navigate("/login");
      }
    });
  }, [dispatch, navigate, error]);

  return (
    <Container>
      <Title>
        <UserOutlined style={{ fontSize: "30px", color: "#28a745" }} />
        Danh sách bác sĩ
      </Title>
      {error && <ErrorText>{error.message}</ErrorText>}
      <StyledList
        itemLayout="horizontal"
        dataSource={doctors}
        renderItem={(doctor) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Avatar
                  icon={<UserOutlined />}
                  style={{ backgroundColor: "#28a745" }}
                />
              }
              title={doctor.ten}
              description={`Khoa: ${doctor.khoa} | Chức vụ: ${doctor.chuc_vu} | SĐT: ${doctor.so_dt}`}
            />
          </List.Item>
        )}
      />
    </Container>
  );
};

export default DoctorList;
