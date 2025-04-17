import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Define type interfaces for different role profiles
interface DoctorProfile {
  name: string;
  specialization?: string;
  hospital?: string;
  hospitalCovidCare: boolean;
  covidCare?: {
    totalBeds: number;
    bedsAvailable: number;
  };
  patients: any[];
  appointments: any[];
}

interface PatientProfile {
  name: string;
  age: number;
  insurancePlan?: string;
  appointments: {
    date: string;
    time: string;
    doctor: string;
  }[];
  medicalRecords?: any[];
}

interface InsuranceProfile {
  name: string;
  patients: any[];
  insurancePlans: any[];
  claims?: any[];
}

// Combined profile type using discriminated union
interface ProfileState {
  role: string | null;
  data: DoctorProfile | PatientProfile | InsuranceProfile | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Helper function to get initial profile from localStorage
const getInitialProfile = (): ProfileState => {
  try {
    const userData = localStorage.getItem('userData');
    const userRole = localStorage.getItem('role');
    
    if (!userData || !userRole) {
      return {
        role: null,
        data: null,
        status: 'idle',
        error: null
      };
    }
    
    return {
      role: userRole,
      data: JSON.parse(userData),
      status: 'idle',
      error: null
    };
  } catch (error) {
    console.error("Error parsing profile data from localStorage:", error);
    return {
      role: null,
      data: null,
      status: 'idle',
      error: null
    };
  }
};

// Async thunk for fetching profile data
export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: { token: string, role: string } };
      
      if (!auth.token || !auth.role) {
        return rejectWithValue('Authentication required');
      }
      
      const response = await fetch(`http://localhost:5002/api/profile/${auth.role}`, {
        headers: {
          'Authorization': `Bearer ${auth.token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to fetch profile');
      }
      
      const data = await response.json();
      return { role: auth.role, data };
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred');
    }
  }
);

// Update profile thunk
export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (profileData: any, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: { token: string, role: string } };
      
      if (!auth.token || !auth.role) {
        return rejectWithValue('Authentication required');
      }
      
      const response = await fetch(`http://localhost:5002/api/profile/${auth.role}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        },
        body: JSON.stringify(profileData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to update profile');
      }
      
      const data = await response.json();
      return { role: auth.role, data };
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred');
    }
  }
);

// Fetch appointments for the respective role
export const fetchAppointments = createAsyncThunk(
  'profile/fetchAppointments',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: { token: string, role: string } };
      
      if (!auth.token || !auth.role) {
        return rejectWithValue('Authentication required');
      }
      
      const response = await fetch(`http://localhost:5002/api/${auth.role}/appointments`, {
        headers: {
          'Authorization': `Bearer ${auth.token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to fetch appointments');
      }
      
      const appointments = await response.json();
      return appointments;
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred');
    }
  }
);

// Doctor-specific thunk for covid care updates
export const updateCovidCare = createAsyncThunk(
  'profile/updateCovidCare',
  async (covidCareData: { totalBeds: number, bedsAvailable: number }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: { token: string, role: string } };
      
      if (!auth.token || auth.role !== 'doctor') {
        return rejectWithValue('Unauthorized');
      }
      
      const response = await fetch('http://localhost:5002/api/doctor/covid-care', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        },
        body: JSON.stringify(covidCareData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to update covid care');
      }
      
      const data = await response.json();
      return data.covidCare;
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred');
    }
  }
);

// Initial state
const initialState: ProfileState = getInitialProfile();

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.data = null;
      state.role = null;
      state.status = 'idle';
      state.error = null;
    },
    setRole: (state, action) => {
      state.role = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch profile cases
      .addCase(fetchProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.role = action.payload.role;
        state.data = action.payload.data;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Update profile cases
      .addCase(updateProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload.data;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Fetch appointments cases
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        if (state.data) {
          // Update appointments based on the role
          if (state.role === 'doctor' && 'appointments' in state.data) {
            (state.data as DoctorProfile).appointments = action.payload;
          } else if (state.role === 'patient' && 'appointments' in state.data) {
            (state.data as PatientProfile).appointments = action.payload;
          }
        }
      })
      
      // Update covid care cases (doctor-specific)
      .addCase(updateCovidCare.fulfilled, (state, action) => {
        if (state.role === 'doctor' && state.data) {
          (state.data as DoctorProfile).covidCare = action.payload;
        }
      });
  }
});

export const { clearProfile, setRole } = profileSlice.actions;
export default profileSlice.reducer;

// Selector functions for easy access to role-specific data
export const selectDoctorProfile = (state: { profile: ProfileState }) => 
  state.profile.role === 'doctor' ? state.profile.data as DoctorProfile : null;

export const selectPatientProfile = (state: { profile: ProfileState }) => 
  state.profile.role === 'patient' ? state.profile.data as PatientProfile : null;

export const selectInsuranceProfile = (state: { profile: ProfileState }) => 
  state.profile.role === 'insurance_provider' ? state.profile.data as InsuranceProfile : null;

// General profile selector
export const selectProfile = (state: { profile: ProfileState }) => state.profile.data;
export const selectProfileRole = (state: { profile: ProfileState }) => state.profile.role;
export const selectProfileStatus = (state: { profile: ProfileState }) => state.profile.status;
export const selectProfileError = (state: { profile: ProfileState }) => state.profile.error;