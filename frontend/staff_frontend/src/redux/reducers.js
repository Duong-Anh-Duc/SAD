const initialState = {
  staff: null,
  patients: [],
  healthInsurances: [],
  appointments: [],
  clinicReports: [],
  payments: [],
  error: null,
};

const staffReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'REGISTER_SUCCESS':
      return { ...state, staff: action.payload, error: null };
    case 'REGISTER_FAIL':
      return { ...state, error: action.payload };
    case 'LOGIN_SUCCESS':
      return { ...state, staff: action.payload, error: null };
    case 'LOGIN_FAIL':
      return { ...state, error: action.payload };
    case 'LOGOUT_SUCCESS':
      return initialState;
    case 'LOGOUT_FAIL':
      return { ...state, error: action.payload };
    case 'FETCH_PATIENTS_SUCCESS':
      return { ...state, patients: action.payload, error: null };
    case 'FETCH_PATIENTS_FAIL':
      return { ...state, error: action.payload };
    case 'CREATE_PATIENT_SUCCESS':
      return { ...state, patients: [...state.patients, action.payload], error: null };
    case 'CREATE_PATIENT_FAIL':
      return { ...state, error: action.payload };
    case 'UPDATE_PATIENT_SUCCESS':
      return {
        ...state,
        patients: state.patients.map(patient =>
          patient.id === action.payload.id ? action.payload : patient
        ),
        error: null
      };
    case 'UPDATE_PATIENT_FAIL':
      return { ...state, error: action.payload };
    case 'DELETE_PATIENT_SUCCESS':
      return {
        ...state,
        patients: state.patients.filter(patient => patient.id !== action.payload),
        error: null
      };
    case 'DELETE_PATIENT_FAIL':
      return { ...state, error: action.payload };
    case 'FETCH_HEALTH_INSURANCES_SUCCESS':
      return { ...state, healthInsurances: action.payload, error: null };
    case 'FETCH_HEALTH_INSURANCES_FAIL':
      return { ...state, error: action.payload };
    case 'CREATE_HEALTH_INSURANCE_SUCCESS':
      return { ...state, healthInsurances: [...state.healthInsurances, action.payload], error: null };
    case 'CREATE_HEALTH_INSURANCE_FAIL':
      return { ...state, error: action.payload };
    case 'UPDATE_HEALTH_INSURANCE_SUCCESS':
      return {
        ...state,
        healthInsurances: state.healthInsurances.map(insurance =>
          insurance.id === action.payload.id ? action.payload : insurance
        ),
        error: null
      };
    case 'UPDATE_HEALTH_INSURANCE_FAIL':
      return { ...state, error: action.payload };
    case 'DELETE_HEALTH_INSURANCE_SUCCESS':
      return {
        ...state,
        healthInsurances: state.healthInsurances.filter(insurance => insurance.id !== action.payload),
        error: null
      };
    case 'DELETE_HEALTH_INSURANCE_FAIL':
      return { ...state, error: action.payload };
    case 'FETCH_APPOINTMENTS_SUCCESS':
      return { ...state, appointments: action.payload, error: null };
    case 'FETCH_APPOINTMENTS_FAIL':
      return { ...state, error: action.payload };
    case 'PROCESS_APPOINTMENT_SUCCESS':
      return {
        ...state,
        appointments: state.appointments.map(appointment =>
          appointment.id === action.payload.id ? action.payload : appointment
        ),
        error: null
      };
    case 'PROCESS_APPOINTMENT_FAIL':
      return { ...state, error: action.payload };
    case 'FETCH_CLINIC_REPORTS_SUCCESS':
      return { ...state, clinicReports: action.payload, error: null };
    case 'FETCH_CLINIC_REPORTS_FAIL':
      return { ...state, error: action.payload };
    case 'FETCH_PAYMENTS_SUCCESS':
      return { ...state, payments: action.payload, error: null };
    case 'FETCH_PAYMENTS_FAIL':
      return { ...state, error: action.payload };
    case 'UPDATE_PAYMENT_STATUS_SUCCESS':
      return {
        ...state,
        payments: state.payments.map(payment =>
          payment.id === action.payload.id ? action.payload : payment
        ),
        error: null
      };
    case 'UPDATE_PAYMENT_STATUS_FAIL':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

export default staffReducer;