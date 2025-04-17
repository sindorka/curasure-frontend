// src/redux/slices/doctorSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Define types
export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  time: string;
  reason: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  diagnosis: string;
  treatment: string;
  notes: string;
  followUp?: string;
}

interface DoctorState {
  patients: Patient[];
  appointments: Appointment[];
  medicalRecords: MedicalRecord[];
  isLoading: boolean;
  error: string | null;
}

// Fetch doctor's patients
export const fetchPatients = createAsyncThunk<
  Patient[],
  void,
  { state: RootState; rejectValue: string }
>('doctor/fetchPatients', async (_, { getState, rejectWithValue }) => {
  try {
    const { token } = getState().auth;
    const response = await fetch('/api/doctor/patients', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch patients');
    }
    
    return await response.json() as Patient[];
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch patients');
  }
});

// Fetch doctor's appointments
export const fetchAppointments = createAsyncThunk<
  Appointment[],
  void,
  { state: RootState; rejectValue: string }
>('doctor/fetchAppointments', async (_, { getState, rejectWithValue }) => {
  try {
    const { token } = getState().auth;
    const response = await fetch('/api/doctor/appointments', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch appointments');
    }
    
    return await response.json() as Appointment[];
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch appointments');
  }
});

// Create medical record
export const createMedicalRecord = createAsyncThunk<
  MedicalRecord,
  Omit<MedicalRecord, 'id'>,
  { state: RootState; rejectValue: string }
>('doctor/createMedicalRecord', async (recordData, { getState, rejectWithValue }) => {
  try {
    const { token } = getState().auth;
    const response = await fetch('/api/doctor/medical-records', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(recordData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to create medical record');
    }
    
    return await response.json() as MedicalRecord;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to create medical record');
  }
});

const initialState: DoctorState = {
  patients: [],
  appointments: [],
  medicalRecords: [],
  isLoading: false,
  error: null,
};

const doctorSlice = createSlice({
  name: 'doctor',
  initialState,
  reducers: {
    clearDoctorError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchPatients
      .addCase(fetchPatients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.patients = action.payload;
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch patients';
      })
      
      // Handle fetchAppointments
      .addCase(fetchAppointments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.appointments = action.payload;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch appointments';
      })
      
      // Handle createMedicalRecord
      .addCase(createMedicalRecord.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createMedicalRecord.fulfilled, (state, action) => {
        state.isLoading = false;
        state.medicalRecords.push(action.payload);
      })
      .addCase(createMedicalRecord.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to create medical record';
      });
  },
});

export const { clearDoctorError } = doctorSlice.actions;

// Selectors
export const selectDoctorPatients = (state: RootState) => state.doctor.patients;
export const selectDoctorAppointments = (state: RootState) => state.doctor.appointments;
export const selectDoctorMedicalRecords = (state: RootState) => state.doctor.medicalRecords;
export const selectDoctorLoading = (state: RootState) => state.doctor.isLoading;
export const selectDoctorError = (state: RootState) => state.doctor.error;

export default doctorSlice.reducer;