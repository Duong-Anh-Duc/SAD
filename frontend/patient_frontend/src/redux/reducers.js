const initialState = {
  patient: null,
  patients: [],
  error: null,
  accessToken: null,
  patientId: null,
};

const patientReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'REGISTER_SUCCESS':
      return { ...state, patient: action.payload, error: null };
    case 'REGISTER_FAIL':
      return { ...state, error: action.payload };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        patient: action.payload,
        accessToken: action.payload.access_token,
        patientId: action.payload.patient_id,
        error: null
      };
    case 'LOGIN_FAIL':
      return { ...state, error: action.payload };
    case 'LOGOUT_SUCCESS':
      return initialState;
    case 'LOGOUT_FAIL':
      return { ...state, error: action.payload };
    case 'GET_DETAIL_SUCCESS':
      return { ...state, patient: action.payload, error: null };
    case 'GET_DETAIL_FAIL':
      return { ...state, error: action.payload };
    case 'GET_ALL_SUCCESS':
      return { ...state, patients: action.payload, error: null };
    case 'GET_ALL_FAIL':
      return { ...state, error: action.payload };
    case 'CREATE_APPOINTMENT_SUCCESS':
      return {
        ...state,
        patient: {
          ...state.patient,
          appointments: [...(state.patient.appointments || []), action.payload],
        },
        error: null,
      };
    case 'CREATE_APPOINTMENT_FAIL':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

export default patientReducer;