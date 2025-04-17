import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password, role, captchaToken }: any, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:5002/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          role,
          captchaToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Login failed');
      }

      // Store user data in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('userData', JSON.stringify(data.user));

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);

// Async thunk for fetching reCAPTCHA site key
export const fetchSiteKey = createAsyncThunk(
  'auth/fetchSiteKey',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:5002/api/auth/recaptcha-key');
      const data = await response.json();
      
      if (!response.ok) {
        return rejectWithValue('Failed to fetch reCAPTCHA site key');
      }
      
      return data.siteKey;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to load CAPTCHA');
    }
  }
);

const getUserData = () => {
    try {
      const userData = localStorage.getItem('userData');
      if (!userData) return null;
      
      // Make sure we're not trying to parse "undefined" or "null" strings
      if (userData === "undefined" || userData === "null") return null;
      
      return JSON.parse(userData);
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
      // If parsing fails, clear the invalid data
      localStorage.removeItem('userData');
      return null;
    }
  };

const initialState = {
  user: getUserData(),
  token: localStorage.getItem('token') || null,
  siteKey: '',
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: '',
  success: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      state.user = null;
      state.token = null;
      state.status = 'idle';
      state.error = '';
      state.success = false;
    },
    clearError: (state) => {
      state.error = '';
    },
    clearSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      // .addCase(loginUser.pending, (state) => {
      //   state.status = 'loading';
      //   state.error = '';
      //   state.success = false;
      // })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.success = true;
        state.error = '';
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = 'Invalid email, password or role!';
        state.success = false;
      })
      // Site key cases
      .addCase(fetchSiteKey.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSiteKey.fulfilled, (state, action) => {
        state.siteKey = action.payload;
      })
      .addCase(fetchSiteKey.rejected, (state) => {
        state.error = 'Invalid captcha!';
      });
  },
});

export const { logout, clearError, clearSuccess } = authSlice.actions;
export default authSlice.reducer;