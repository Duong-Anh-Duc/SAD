const initialState = {
  patient: null,
  patients: [],
  doctors: [],
  payments: [],
  appointments: [], // Lịch khám (tất cả trạng thái trừ hoan_thanh)
  medicalHistories: [], // Lịch sử khám bệnh (chỉ hoan_thanh)
  health_insurances: [],
  doctor: null,
  error: null,
  accessToken: null,
  patientId: null,
};

const patientReducer = (state = initialState, action) => {
  switch (action.type) {
    case "REGISTER_SUCCESS":
      return { ...state, patient: action.payload, error: null };
    case "REGISTER_FAIL":
      return { ...state, error: action.payload };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        patient: action.payload,
        accessToken: action.payload.access_token,
        patientId: action.payload.patient_id,
        error: null,
      };
    case "LOGIN_FAIL":
      return { ...state, error: action.payload };
    case "LOGOUT_SUCCESS":
      return initialState;
    case "LOGOUT_FAIL":
      return { ...state, error: action.payload };
    case "GET_DETAIL_SUCCESS":
      return { ...state, patient: action.payload, error: null };
    case "GET_DETAIL_FAIL":
      return { ...state, error: action.payload };
    case "GET_ALL_SUCCESS":
      return { ...state, patients: action.payload, error: null };
    case "GET_ALL_FAIL":
      return { ...state, error: action.payload };
    case "CREATE_APPOINTMENT_SUCCESS":
      return {
        ...state,
        appointments: [...(state.appointments || []), action.payload],
        error: null,
      };
    case "CREATE_APPOINTMENT_FAIL":
      return { ...state, error: action.payload };
    case "CANCEL_APPOINTMENT_SUCCESS":
      return {
        ...state,
        appointments: state.appointments.map((appt) =>
          appt.id === action.payload ? { ...appt, trang_thai: "da_huy" } : appt
        ),
        error: null,
      };
    case "CANCEL_APPOINTMENT_FAIL":
      return { ...state, error: action.payload };
    case "GET_DOCTORS_SUCCESS":
      return { ...state, doctors: action.payload, error: null };
    case "GET_DOCTORS_FAIL":
      return { ...state, error: action.payload };
    case "GET_PAYMENTS_SUCCESS":
      return { ...state, payments: action.payload, error: null };
    case "GET_PAYMENTS_FAIL":
      return { ...state, error: action.payload };
    case "UPDATE_PAYMENT_SUCCESS":
      return {
        ...state,
        payments: state.payments.map((payment) =>
          payment.id === action.payload.id ? action.payload : payment
        ),
        error: null,
      };
    case "UPDATE_PAYMENT_FAIL":
      return { ...state, error: action.payload };
    case "UPDATE_PATIENT_SUCCESS":
      return {
        ...state,
        patient: action.payload,
        error: null,
      };
    case "UPDATE_PATIENT_FAIL":
      return { ...state, error: action.payload };
    case "GET_INSURANCES_SUCCESS":
      return { ...state, health_insurances: action.payload, error: null };
    case "GET_INSURANCES_FAIL":
      return { ...state, error: action.payload };
    case "CREATE_INSURANCE_SUCCESS":
      return {
        ...state,
        health_insurances: [...(state.health_insurances || []), action.payload],
        error: null,
      };
    case "CREATE_INSURANCE_FAIL":
      return { ...state, error: action.payload };
    case "UPDATE_INSURANCE_SUCCESS":
      return {
        ...state,
        health_insurances: state.health_insurances.map((ins) =>
          ins.id === action.payload.id ? action.payload : ins
        ),
        error: null,
      };
    case "UPDATE_INSURANCE_FAIL":
      return { ...state, error: action.payload };
    case "DELETE_INSURANCE_SUCCESS":
      return {
        ...state,
        health_insurances: state.health_insurances.filter(
          (ins) => ins.id !== action.payload
        ),
        error: null,
      };
    case "DELETE_INSURANCE_FAIL":
      return { ...state, error: action.payload };
    case "GET_DOCTOR_DETAIL_SUCCESS":
      return { ...state, doctor: action.payload, error: null };
    case "GET_DOCTOR_DETAIL_FAIL":
      return { ...state, error: action.payload };
    case "GET_PATIENT_APPOINTMENTS_SUCCESS":
      return { ...state, appointments: action.payload, error: null };
    case "GET_PATIENT_APPOINTMENTS_FAIL":
      return { ...state, error: action.payload };
    case "GET_MEDICAL_HISTORY_SUCCESS": // Thêm để lưu lịch sử khám bệnh
      return { ...state, medicalHistories: action.payload, error: null };
    case "GET_MEDICAL_HISTORY_FAIL":
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

export default patientReducer;