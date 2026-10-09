import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api, getDeviceId } from '../../services/api';

// Async thunk for logging in
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      // credentials should have email, password, and optionally deviceId
      const deviceId = getDeviceId();
      const res = await api.loginUser({ ...credentials, deviceId });
      
      // Since it's a mock or real backend through api.js, it returns the user object directly.
      // And in api.js, it might mock a token or actually return one. We ensure a dummy token if not returned.
      const token = res.token || 'dummy_auth_token_for_session';
      
      localStorage.setItem('token', token);
      localStorage.setItem('eduadmin_user', JSON.stringify(res));

      return { user: res, token };
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
  isAuthenticated: !!localStorage.getItem('token') && !!localStorage.getItem('eduadmin_user'),
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
      localStorage.removeItem('token');
      localStorage.removeItem('eduadmin_user');
    },
    // Allows migrating existing local state logic
    setAuth: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('eduadmin_user', JSON.stringify(action.payload));
      localStorage.setItem('token', 'dummy_auth_token_for_session');
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
        localStorage.removeItem('token');
        localStorage.removeItem('eduadmin_user');
      });
  }
});

export const { logout, setAuth } = authSlice.actions;
export default authSlice.reducer;
