import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";

export const getRecruiterDashboard = createAsyncThunk(
  "recruiter/dashboard",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get("/dashboard/recruiter");
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message);
    }
  }
);

const recruiterSlice = createSlice({
  name: "recruiter",
  initialState: {
    totalJobs: 0,
    totalApplications: 0,
    applicationsPerJob: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRecruiterDashboard.pending, (state) => {
        state.loading = true;
      })
      .addCase(getRecruiterDashboard.fulfilled, (state, action) => {
        state.loading = false;
        const dashboard = action.payload;
        state.totalJobs = dashboard.totalJobs;
        state.totalApplications = dashboard.totalApplications;
        state.applicationsPerJob = dashboard.applicationsPerJob;
      })
      .addCase(getRecruiterDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default recruiterSlice.reducer;
