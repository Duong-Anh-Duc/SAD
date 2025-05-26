import { configureStore } from '@reduxjs/toolkit';
import patientReducer from './reducers';

export const store = configureStore({
  reducer: {
    patient: patientReducer,
  },
});