import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { signIn } from '../api/auth/auth.js';

export const loginAccount = createAsyncThunk(
  'account/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await signIn(credentials.email, credentials.password, credentials.remember);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  });

const accountSlice = createSlice({
  name: 'account',
  initialState: {
    isLogged: false,
    loading: true,
    user: null,
    error: null,
    email: '',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginAccount.pending, (state) => {
        state.loading = true;
        state.user = null;
        state.isLogged = false;
        state.error = null;
      })
      .addCase(loginAccount.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.isLogged = payload;
        state.error = null;
      })
      .addCase(loginAccount.rejected, (state, { payload }) => {
        state.loading = false;
        state.user = null;
        state.isLogged = false;
        state.error = payload;
        
      });
  }
});

// eslint-disable-next-line no-empty-pattern
export const {} = accountSlice.actions;

export default accountSlice.reducer;
