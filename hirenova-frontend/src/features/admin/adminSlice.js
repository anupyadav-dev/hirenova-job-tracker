import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";

// ================= ADMIN DASHBOARD =================
export const getAdminDashboard = createAsyncThunk(
  "admin/getAdminDashboard",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get("/admin/dashboard");

      console.log("ADMIN DASHBOARD:", res.data);

      return res.data.data; // {totalUsers, totalJobs, totalRecruiters}
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to load dashboard"
      );
    }
  }
);

// ================= GET ALL USERS =================
export const getAllUsers = createAsyncThunk(
  "admin/getAllUsers",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get("/admin/users");
      return res.data.users;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

// ================= UPDATE USER STATUS =================
export const updateUserStatus = createAsyncThunk(
  "admin/updateUserStatus",
  async ({ userId, status }, thunkAPI) => {
    try {
      const res = await axios.patch(`/admin/users/${userId}/status`, {
        status,
      });

      return { userId, status };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to update user"
      );
    }
  }
);

// ================= DELETE USER (OPTIONAL) =================
export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (userId, thunkAPI) => {
    try {
      await axios.delete(`/admin/users/${userId}`);
      return userId;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to delete user"
      );
    }
  }
);

// ================= SLICE =================
const adminSlice = createSlice({
  name: "admin",
  initialState: {
    // dashboard stats
    dashboard: {
      totalUsers: 0,
      totalJobs: 0,
      totalRecruiters: 0,
      applicationsPerJob: [],
    },

    // users list
    users: [],

    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      // ================= DASHBOARD =================
      .addCase(getAdminDashboard.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAdminDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload;
      })
      .addCase(getAdminDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= USERS =================
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= UPDATE STATUS =================
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        const { userId, status } = action.payload;

        const user = state.users.find((u) => u._id === userId);
        if (user) {
          user.status = status;
        }
      })

      // ================= DELETE USER =================
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u._id !== action.payload);
      });
  },
});

export default adminSlice.reducer;
