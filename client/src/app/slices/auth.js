import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AuthService from "../services/auth-service/auth.service";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  isLoggedIn: !!localStorage.getItem("user"),
};

export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await AuthService.register(userData);
      return response.message;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const login = createAsyncThunk(
  "auth/signin",
  async (userData, { rejectWithValue }) => {
    try {
      // Logging in here
      const signinData = await AuthService.login(userData);
      const data = { ...signinData };
      localStorage.setItem("user", JSON.stringify(data));
      return data;
    } catch (error) {
      // Handling errors from the entire process
      return rejectWithValue(error.response?.data || error);
    }
  }
);

export const logout = createAsyncThunk(
  "auth/signout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await AuthService.logout();
      localStorage.removeItem("user");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updatePassword = createAsyncThunk(
  "auth/updatePassword",
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await AuthService.updatePassword(passwordData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateAuthField: (state, action) => {
      const { field, value } = action.payload;
      console.log(field, value);
      state[field] = value;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoggedIn = true;
        state.status = "succeeded";
        state.otpVerified = action.payload.otp_verified;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.user = null;
        state.isLoggedIn = false;
        state.status = "succeeded";
        state.otpVerified = false;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "failed";
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(register.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "failed";
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "failed";
      })
      .addCase(logout.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "failed";
      });
  },
});

export const { updateAuthField } = authSlice.actions;

export default authSlice.reducer;
