import { configureStore } from '@reduxjs/toolkit';
import adminReducer from './reducers';

export const store = configureStore({
  reducer: {
    admin: adminReducer,
  },
});