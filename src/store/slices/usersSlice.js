import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (organizationId, { rejectWithValue }) => {
    try {
      const data = await api.getAllUsers(organizationId);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// We can add createUser, updateUser, deleteUser here

const initialState = {
  users: [],
  loading: false,
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default usersSlice.reducer;
