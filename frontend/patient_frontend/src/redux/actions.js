import axios from "axios";
import { toast } from "react-toastify";

const AUTH_API_GATEWAY_URL = "http://localhost:8080/auth";
const API_GATEWAY_URL = "http://localhost:8080/patient";
const APPOINTMENT_API_GATEWAY_URL = "http://localhost:8080/appointment";
const DOCTOR_API_GATEWAY_URL = "http://localhost:8080/doctor";
const PAYMENT_API_GATEWAY_URL = "http://localhost:8080/payment";

let isRefreshing = false;
let refreshSubscribers = [];

const onRefreshed = (accessToken) => {
  refreshSubscribers.forEach((callback) => callback(accessToken));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback) => {
  refreshSubscribers.push(callback);
};

export const restoreSession = () => async (dispatch) => {
  try {
    const accessToken = localStorage.getItem("access_token");
    const patientId = localStorage.getItem("patient_id");
    if (accessToken && patientId) {
      const res = await axios.get(`${API_GATEWAY_URL}/detail/${patientId}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { access_token: accessToken, patient_id: patientId, ...res.data },
      });
    }
  } catch (error) {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) {
        dispatch({ type: "LOGOUT_SUCCESS" });
        localStorage.clear();
        toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!");
        return;
      }

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshRes = await axios.post(
            `${API_GATEWAY_URL}/token/refresh/`,
            { refresh: refreshToken }
          );
          if (refreshRes && refreshRes.data && refreshRes.data.access) {
            localStorage.setItem("access_token", refreshRes.data.access);
            if (refreshRes.data.refresh) {
              localStorage.setItem("refresh_token", refreshRes.data.refresh);
            }
            onRefreshed(refreshRes.data.access);
            const retryRes = await axios.get(
              `${API_GATEWAY_URL}/detail/${patientId}/`,
              {
                headers: { Authorization: `Bearer ${refreshRes.data.access}` },
              }
            );
            dispatch({
              type: "LOGIN_SUCCESS",
              payload: {
                access_token: refreshRes.data.access,
                patient_id: patientId,
                ...retryRes.data,
              },
            });
          } else {
            throw new Error("Không thể làm mới token");
          }
        } catch (refreshError) {
          dispatch({ type: "LOGOUT_SUCCESS" });
          localStorage.clear();
          toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!");
        } finally {
          isRefreshing = false;
        }
      } else {
        const newToken = await new Promise((resolve) => {
          addRefreshSubscriber(resolve);
        });
        const retryRes = await axios.get(
          `${API_GATEWAY_URL}/detail/${patientId}/`,
          {
            headers: { Authorization: `Bearer ${newToken}` },
          }
        );
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: { access_token: newToken, patient_id: patientId, ...retryRes.data },
        });
      }
    } else {
      dispatch({ type: "LOGOUT_SUCCESS" });
      localStorage.clear();
    }
  }
};

export const registerPatient = (patientData) => async (dispatch) => {
  try {
    const res = await axios.post(`${AUTH_API_GATEWAY_URL}/register/`, patientData);
    if (res && res.status === 201) {
      dispatch({ type: "REGISTER_SUCCESS", payload: res.data });
    } else {
      throw new Error(res.data?.message || "Đăng ký thất bại");
    }
  } catch (error) {
    dispatch({
      type: "REGISTER_FAIL",
      payload: error.response?.data || { message: "Đăng ký thất bại" },
    });
    throw error;
  }
};

export const loginPatient = (credentials) => async (dispatch) => {
  try {
    credentials.role = "patient";  // Thêm role vào payload
    const res = await axios.post(`${AUTH_API_GATEWAY_URL}/login/`, credentials);
    if (res && res.data && res.status === 200) {
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
      localStorage.setItem("access_token", res.data.access_token || "");
      localStorage.setItem("refresh_token", res.data.refresh_token || "");
      localStorage.setItem("patient_id", res.data.user_id || "");
    } else {
      throw new Error(res.data?.message || "Phản hồi từ API không hợp lệ");
    }
  } catch (error) {
    dispatch({
      type: "LOGIN_FAIL",
      payload: error.response?.data || { message: "Đăng nhập thất bại" },
    });
    throw error;
  }
};

export const logoutPatient = () => async (dispatch) => {
  try {
    const refreshToken = localStorage.getItem("refresh_token");
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken || !refreshToken) {
      throw new Error("Không có token để đăng xuất");
    }
    await axios.post(
      `${API_GATEWAY_URL}/logout/`,
      { refresh_token: refreshToken },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    dispatch({ type: "LOGOUT_SUCCESS" });
    localStorage.clear();
  } catch (error) {
    dispatch({
      type: "LOGOUT_FAIL",
      payload: error.response?.data || { message: "Đăng xuất thất bại" },
    });
  }
};

export const getPatientDetail = (id) => async (dispatch) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("Không có token để xác thực");
    const res = await axios.get(`${API_GATEWAY_URL}/detail/${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch({ type: "GET_DETAIL_SUCCESS", payload: res.data });
  } catch (error) {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) {
        dispatch({
          type: "GET_DETAIL_FAIL",
          payload: { message: "Không có refresh token" },
        });
        localStorage.clear();
        toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!");
        return;
      }

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshRes = await axios.post(
            `${API_GATEWAY_URL}/token/refresh/`,
            { refresh: refreshToken }
          );
          if (refreshRes && refreshRes.data && refreshRes.data.access) {
            localStorage.setItem("access_token", refreshRes.data.access);
            if (refreshRes.data.refresh) {
              localStorage.setItem("refresh_token", refreshRes.data.refresh);
            }
            onRefreshed(refreshRes.data.access);
            const retryRes = await axios.get(
              `${API_GATEWAY_URL}/detail/${id}/`,
              {
                headers: { Authorization: `Bearer ${refreshRes.data.access}` },
              }
            );
            dispatch({ type: "GET_DETAIL_SUCCESS", payload: retryRes.data });
          } else {
            throw new Error("Không thể làm mới token");
          }
        } catch (refreshError) {
          dispatch({
            type: "GET_DETAIL_FAIL",
            payload:
              refreshError.response?.data || { message: "Lỗi làm mới token" },
          });
          localStorage.clear();
          toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!");
        } finally {
          isRefreshing = false;
        }
      } else {
        const newToken = await new Promise((resolve) => {
          addRefreshSubscriber(resolve);
        });
        const retryRes = await axios.get(`${API_GATEWAY_URL}/detail/${id}/`, {
          headers: { Authorization: `Bearer ${newToken}` },
        });
        dispatch({ type: "GET_DETAIL_SUCCESS", payload: retryRes.data });
      }
    } else {
      dispatch({
        type: "GET_DETAIL_FAIL",
        payload: error.response?.data || { message: "Không lấy được thông tin" },
      });
    }
  }
};

export const getAllPatients = () => async (dispatch) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("Không có token để xác thực");
    const res = await axios.get(`${API_GATEWAY_URL}/all/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch({ type: "GET_ALL_SUCCESS", payload: res.data });
  } catch (error) {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) {
        dispatch({
          type: "GET_ALL_FAIL",
          payload: { message: "Không có refresh token" },
        });
        localStorage.clear();
        toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!");
        return;
      }

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshRes = await axios.post(
            `${API_GATEWAY_URL}/token/refresh/`,
            { refresh: refreshToken }
          );
          if (refreshRes && refreshRes.data && refreshRes.data.access) {
            localStorage.setItem("access_token", refreshRes.data.access);
            if (refreshRes.data.refresh) {
              localStorage.setItem("refresh_token", refreshRes.data.refresh);
            }
            onRefreshed(refreshRes.data.access);
            const retryRes = await axios.get(`${API_GATEWAY_URL}/all/`, {
              headers: { Authorization: `Bearer ${refreshRes.data.access}` },
            });
            dispatch({ type: "GET_ALL_SUCCESS", payload: retryRes.data });
          } else {
            throw new Error("Không thể làm mới token");
          }
        } catch (refreshError) {
          dispatch({
            type: "GET_ALL_FAIL",
            payload:
              refreshError.response?.data || { message: "Lỗi làm mới token" },
          });
          localStorage.clear();
          toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!");
        } finally {
          isRefreshing = false;
        }
      } else {
        const newToken = await new Promise((resolve) => {
          addRefreshSubscriber(resolve);
        });
        const retryRes = await axios.get(`${API_GATEWAY_URL}/all/`, {
          headers: { Authorization: `Bearer ${newToken}` },
        });
        dispatch({ type: "GET_ALL_SUCCESS", payload: retryRes.data });
      }
    } else {
      dispatch({
        type: "GET_ALL_FAIL",
        payload: error.response?.data || { message: "Không lấy được danh sách" },
      });
    }
  }
};

export const createAppointment = (appointmentData) => async (dispatch) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("Không có token để xác thực");
    const res = await axios.post(
      `${APPOINTMENT_API_GATEWAY_URL}/create/`,
      appointmentData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (res && res.status === 201) {
      dispatch({ type: "CREATE_APPOINTMENT_SUCCESS", payload: res.data });
      return res.data;
    } else {
      throw new Error(res.data?.message || "Đặt lịch khám thất bại");
    }
  } catch (error) {
    dispatch({
      type: "CREATE_APPOINTMENT_FAIL",
      payload: error.response?.data || { message: "Đặt lịch khám thất bại" },
    });
    throw error;
  }
};

export const cancelAppointment = (appointmentId) => async (dispatch) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("Không có token để xác thực");
    const res = await axios.put(
      `${APPOINTMENT_API_GATEWAY_URL}/${appointmentId}/process/`,
      { trang_thai: "da_huy" },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (res && res.status === 200) {
      dispatch({ type: "CANCEL_APPOINTMENT_SUCCESS", payload: appointmentId });
      return res.data;
    } else {
      throw new Error(res.data?.message || "Hủy lịch khám thất bại");
    }
  } catch (error) {
    dispatch({
      type: "CANCEL_APPOINTMENT_FAIL",
      payload: error.response?.data || { message: "Hủy lịch khám thất bại" },
    });
    throw error;
  }
};

export const getAllDoctors = () => async (dispatch) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("Không có token để xác thực");
    const res = await axios.get(`${DOCTOR_API_GATEWAY_URL}/all/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch({ type: "GET_DOCTORS_SUCCESS", payload: res.data });
  } catch (error) {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) {
        dispatch({
          type: "GET_DOCTORS_FAIL",
          payload: { message: "Không có refresh token" },
        });
        localStorage.clear();
        toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!");
        return;
      }

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshRes = await axios.post(
            `${API_GATEWAY_URL}/token/refresh/`,
            { refresh: refreshToken }
          );
          if (refreshRes && refreshRes.data && refreshRes.data.access) {
            localStorage.setItem("access_token", refreshRes.data.access);
            if (refreshRes.data.refresh) {
              localStorage.setItem("refresh_token", refreshRes.data.refresh);
            }
            onRefreshed(refreshRes.data.access);
            const retryRes = await axios.get(`${DOCTOR_API_GATEWAY_URL}/all/`, {
              headers: { Authorization: `Bearer ${refreshRes.data.access}` },
            });
            dispatch({ type: "GET_DOCTORS_SUCCESS", payload: retryRes.data });
          } else {
            throw new Error("Không thể làm mới token");
          }
        } catch (refreshError) {
          dispatch({
            type: "GET_DOCTORS_FAIL",
            payload:
              refreshError.response?.data || { message: "Lỗi làm mới token" },
          });
          localStorage.clear();
          toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!");
        } finally {
          isRefreshing = false;
        }
      } else {
        const newToken = await new Promise((resolve) => {
          addRefreshSubscriber(resolve);
        });
        const retryRes = await axios.get(`${DOCTOR_API_GATEWAY_URL}/all/`, {
          headers: { Authorization: `Bearer ${newToken}` },
        });
        dispatch({ type: "GET_DOCTORS_SUCCESS", payload: retryRes.data });
      }
    } else {
      dispatch({
        type: "GET_DOCTORS_FAIL",
        payload:
          error.response?.data || { message: "Không lấy được danh sách bác sĩ" },
      });
    }
  }
};

export const getPayments = (patientId) => async (dispatch) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("Không có token để xác thực");
    const res = await axios.get(
      `${PAYMENT_API_GATEWAY_URL}/list/?patient_id=${patientId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    dispatch({ type: "GET_PAYMENTS_SUCCESS", payload: res.data });
  } catch (error) {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) {
        dispatch({
          type: "GET_PAYMENTS_FAIL",
          payload: { message: "Không có refresh token" },
        });
        localStorage.clear();
        toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!");
        return;
      }

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshRes = await axios.post(
            `${API_GATEWAY_URL}/token/refresh/`,
            { refresh: refreshToken }
          );
          if (refreshRes && refreshRes.data && refreshRes.data.access) {
            localStorage.setItem("access_token", refreshRes.data.access);
            if (refreshRes.data.refresh) {
              localStorage.setItem("refresh_token", refreshRes.data.refresh);
            }
            onRefreshed(refreshRes.data.access);
            const retryRes = await axios.get(
              `${PAYMENT_API_GATEWAY_URL}/list/?patient_id=${patientId}`,
              {
                headers: { Authorization: `Bearer ${refreshRes.data.access}` },
              }
            );
            dispatch({ type: "GET_PAYMENTS_SUCCESS", payload: retryRes.data });
          } else {
            throw new Error("Không thể làm mới token");
          }
        } catch (refreshError) {
          dispatch({
            type: "GET_PAYMENTS_FAIL",
            payload:
              refreshError.response?.data || { message: "Lỗi làm mới token" },
          });
          localStorage.clear();
          toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!");
        } finally {
          isRefreshing = false;
        }
      } else {
        const newToken = await new Promise((resolve) => {
          addRefreshSubscriber(resolve);
        });
        const retryRes = await axios.get(
          `${PAYMENT_API_GATEWAY_URL}/list/?patient_id=${patientId}`,
          {
            headers: { Authorization: `Bearer ${newToken}` },
          }
        );
        dispatch({ type: "GET_PAYMENTS_SUCCESS", payload: retryRes.data });
      }
    } else {
      dispatch({
        type: "GET_PAYMENTS_FAIL",
        payload:
          error.response?.data || { message: "Không lấy được danh sách hóa đơn" },
      });
    }
  }
};

export const updatePaymentStatus = (paymentId, status) => async (dispatch) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("Không có token để xác thực");
    const res = await axios.put(
      `${PAYMENT_API_GATEWAY_URL}/${paymentId}/update-status/`,
      { trang_thai: status },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (res && res.status === 200) {
      dispatch({ type: "UPDATE_PAYMENT_SUCCESS", payload: res.data });
      return res.data;
    } else {
      throw new Error(res.data?.message || "Cập nhật trạng thái thất bại");
    }
  } catch (error) {
    dispatch({
      type: "UPDATE_PAYMENT_FAIL",
      payload:
        error.response?.data || { message: "Cập nhật trạng thái thất bại" },
    });
    throw error;
  }
};

export const updatePatient = (id, patientData) => async (dispatch) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("Không có token để xác thực");
    const res = await axios.put(
      `${API_GATEWAY_URL}/detail/${id}/update/`,
      patientData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    dispatch({ type: "UPDATE_PATIENT_SUCCESS", payload: res.data });
    return res.data;
  } catch (error) {
    dispatch({
      type: "UPDATE_PATIENT_FAIL",
      payload: error.response?.data || { message: "Cập nhật thất bại" },
    });
    throw error;
  }
};

export const getHealthInsurances = (patientId) => async (dispatch) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("Không có token để xác thực");
    const res = await axios.get(
      `${API_GATEWAY_URL}/health-insurance/?patient_id=${patientId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    dispatch({ type: "GET_INSURANCES_SUCCESS", payload: res.data });
  } catch (error) {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) {
        dispatch({
          type: "GET_INSURANCES_FAIL",
          payload: { message: "Không có refresh token" },
        });
        localStorage.clear();
        toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!");
        return;
      }

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshRes = await axios.post(
            `${API_GATEWAY_URL}/token/refresh/`,
            { refresh: refreshToken }
          );
          if (refreshRes && refreshRes.data && refreshRes.data.access) {
            localStorage.setItem("access_token", refreshRes.data.access);
            if (refreshRes.data.refresh) {
              localStorage.setItem("refresh_token", refreshRes.data.refresh);
            }
            onRefreshed(refreshRes.data.access);
            const retryRes = await axios.get(
              `${API_GATEWAY_URL}/health-insurance/?patient_id=${patientId}`,
              {
                headers: { Authorization: `Bearer ${refreshRes.data.access}` },
              }
            );
            dispatch({ type: "GET_INSURANCES_SUCCESS", payload: retryRes.data });
          } else {
            throw new Error("Không thể làm mới token");
          }
        } catch (refreshError) {
          dispatch({
            type: "GET_INSURANCES_FAIL",
            payload:
              refreshError.response?.data || { message: "Lỗi làm mới token" },
          });
          localStorage.clear();
          toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!");
        } finally {
          isRefreshing = false;
        }
      } else {
        const newToken = await new Promise((resolve) => {
          addRefreshSubscriber(resolve);
        });
        const retryRes = await axios.get(
          `${API_GATEWAY_URL}/health-insurance/?patient_id=${patientId}`,
          {
            headers: { Authorization: `Bearer ${newToken}` },
          }
        );
        dispatch({ type: "GET_INSURANCES_SUCCESS", payload: retryRes.data });
      }
    } else {
      dispatch({
        type: "GET_INSURANCES_FAIL",
        payload: error.response?.data || { message: "Không lấy được bảo hiểm" },
      });
    }
  }
};

export const createHealthInsurance = (insuranceData) => async (dispatch) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("Không có token để xác thực");
    const res = await axios.post(
      `${API_GATEWAY_URL}/health-insurance/`,
      insuranceData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    dispatch({ type: "CREATE_INSURANCE_SUCCESS", payload: res.data });
    return res.data;
  } catch (error) {
    dispatch({
      type: "CREATE_INSURANCE_FAIL",
      payload: error.response?.data || { message: "Thêm bảo hiểm thất bại" },
    });
    throw error;
  }
};

export const updateHealthInsurance = (id, insuranceData) => async (dispatch) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("Không có token để xác thực");
    const res = await axios.put(
      `${API_GATEWAY_URL}/health-insurance/${id}/`,
      insuranceData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    dispatch({ type: "UPDATE_INSURANCE_SUCCESS", payload: res.data });
    return res.data;
  } catch (error) {
    dispatch({
      type: "UPDATE_INSURANCE_FAIL",
      payload: error.response?.data || { message: "Cập nhật bảo hiểm thất bại" },
    });
    throw error;
  }
};

export const deleteHealthInsurance = (id) => async (dispatch) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("Không có token để xác thực");
    await axios.delete(`${API_GATEWAY_URL}/health-insurance/${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch({ type: "DELETE_INSURANCE_SUCCESS", payload: id });
  } catch (error) {
    dispatch({
      type: "DELETE_INSURANCE_FAIL",
      payload: error.response?.data || { message: "Xóa bảo hiểm thất bại" },
    });
    throw error;
  }
};