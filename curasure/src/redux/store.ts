import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import doctorReducer from './slices/doctorSlice';
// import patientReducer from './slices/patientSlice';
// import insuranceReducer from './slices/insuranceSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    doctor: doctorReducer
    // patient: patientReducer,
    // insurance: insuranceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;