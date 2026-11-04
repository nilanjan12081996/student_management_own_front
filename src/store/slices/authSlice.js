import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api, getDeviceId } from '../../services/api';
import { getDecryptedToken, setEncryptedToken, removeEncryptedToken } from '../../utils/tokenSecurity';

// Async thunk for logging in
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const deviceId = getDeviceId();
      const res = await api.loginUser({ ...credentials, deviceId });
      
      const user = res.user || res;
      const token = res.token || `auth_token_${user.id}_${user.role || 'user'}_${Date.now()}`;
      
      // Store token securely encrypted in localStorage
      setEncryptedToken(token);
      localStorage.setItem('eduadmin_user', JSON.stringify(user));

      return { user, token };
    } catch (err) {
      return rejectWithValue(err.message || 'Login failed');
    }
  }
);

// Async thunk for session verification
export const verifySession = createAsyncThunk(
  'auth/verifySession',
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      const state = getState();
      const user = state.auth.user;
      if (!user) return rejectWithValue('No user');

      const deviceId = getDeviceId();
      const res = await api.verifySession(user.id, deviceId);
      
      if (!res.valid) {
        dispatch(logout());
        return rejectWithValue(res.message);
      }
      return res;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  user: JSON.parse(localStorage.getItem('eduadmin_user')) || null,
  isAuthenticated: !!getDecryptedToken() && !!localStorage.getItem('eduadmin_user'),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      removeEncryptedToken();
      localStorage.removeItem('eduadmin_user');
    },
    // Allows setting auth from components
    setAuth: (state, action) => {
      const user = action.payload?.user || action.payload;
      const token = action.payload?.token;
      state.user = user;
      state.isAuthenticated = true;
      localStorage.setItem('eduadmin_user', JSON.stringify(user));
      if (token) {
        setEncryptedToken(token);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifySession.rejected, (state) => {
        // If session is invalid, force logout
        state.user = null;
        state.isAuthenticated = false;
        removeEncryptedToken();
        localStorage.removeItem('eduadmin_user');
      });
  }
});

export const { logout, setAuth } = authSlice.actions;
export default authSlice.reducer;
