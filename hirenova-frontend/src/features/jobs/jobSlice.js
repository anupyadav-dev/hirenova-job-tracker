import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";

const API = "/jobs";
//  GET ALL JOBS
export const getJobs = createAsyncThunk(
  "jobs/getJobs",
  async (params, thunkAPI) => {
    try {
      const { keyword = "", location = "", page = 1 } = params;

      const res = await axios.get(
        `${API}?keyword=${keyword}&location=${location}&page=${page}`
      );

      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response.data.message || "Failed to fetch jobs"
      );
    }
  }
);

//  GET RECOMMENDED JOBS
export const getRecommendedJobs = createAsyncThunk(
  "jobs/getRecommendedJobs",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${API}/recommended`);
      return res.data.jobs;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch recommendations"
      );
    }
  }
);

const jobSlice = createSlice({
  name: "jobs",
  initialState: {
    jobs: [],
    recommendedJobs: [],
    total: 0,
    page: 1,
    pages: 1,
    loading: false,
    error: null,
  },
  reducers: {
    clearJobError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      //  GET JOBS
      .addCase(getJobs.pending, (state) => {
        state.loading = true;
      })
      .addCase(getJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.jobs;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(getJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //  GET RECOMMENDED JOBS
      .addCase(getRecommendedJobs.pending, (state) => {
        state.loading = true;
      })
      .addCase(getRecommendedJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.recommendedJobs = action.payload;
      })
      .addCase(getRecommendedJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearJobError } = jobSlice.actions;
export default jobSlice.reducer;
