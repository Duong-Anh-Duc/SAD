import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { restoreSession } from "../redux/actions";

const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(restoreSession()).catch(() => {
      toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!");
      navigate("/login");
    });
  }, [dispatch, navigate]);

  const handleApiError = (error) => {
    if (error?.message === "Lỗi làm mới token") {
      toast.error("Phiên đăng nhập hết hạn!");
      navigate("/login");
    } else {
      toast.error(error?.message || "Có lỗi xảy ra!");
    }
  };

  return { handleApiError };
};

export default useAuth;