import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Safe localStorage parsers
const getInitialUser = () => {
  try {
    const saved = localStorage.getItem('meet_user');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const getInitialToken = () => {
  try {
    return localStorage.getItem('meet_token') || null;
  } catch {
    return null;
  }
};

const getInitialVerifyEmail = () => {
  try {
    return localStorage.getItem('meet_verify_email') || '';
  } catch {
    return '';
  }
};

// Async thunks
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/verify-otp', { email, otp });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const resendOtp = createAsyncThunk(
  'auth/resendOtp',
  async (email, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/resend-otp', { email });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: getInitialUser(),
    token: getInitialToken(),
    isAuthenticated: !!getInitialToken(),
    verificationEmail: getInitialVerifyEmail(),
    loading: false,
    resendLoading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    setVerificationEmail: (state, action) => {
      state.verificationEmail = action.payload;
      try {
        localStorage.setItem('meet_verify_email', action.payload);
      } catch {}
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      try {
        localStorage.removeItem('meet_token');
        localStorage.removeItem('meet_user');
      } catch {}
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.verificationEmail = action.payload.email || '';
        state.successMessage = action.payload.message;
        try {
          if (action.payload.email) {
            localStorage.setItem('meet_verify_email', action.payload.email);
          }
        } catch {}
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Verify OTP
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        state.verificationEmail = '';
        try {
          localStorage.removeItem('meet_verify_email');
        } catch {}
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Resend OTP
      .addCase(resendOtp.pending, (state) => {
        state.resendLoading = true;
        state.error = null;
      })
      .addCase(resendOtp.fulfilled, (state, action) => {
        state.resendLoading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.resendLoading = false;
        state.error = action.payload;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
        try {
          localStorage.setItem('meet_token', action.payload.token);
          localStorage.setItem('meet_user', JSON.stringify(action.payload.user));
        } catch {}
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Current User
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        try {
          localStorage.setItem('meet_user', JSON.stringify(action.payload.user));
        } catch {}
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        // If token expired, clear auth
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        try {
          localStorage.removeItem('meet_token');
          localStorage.removeItem('meet_user');
        } catch {}
      });
  },
});

export const {
  setVerificationEmail,
  clearError,
  clearSuccessMessage,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
