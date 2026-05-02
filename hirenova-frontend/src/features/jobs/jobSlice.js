import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";

const API = "/jobs";

// ================= PUBLIC =================

// 🔥 Get All Jobs
export const getJobs = createAsyncThunk(
  "jobs/getJobs",
  async (params = {}, thunkAPI) => {
    try {
      const { keyword = "", location = "", page = 1 } = params;

      const res = await axios.get(
        `${API}?keyword=${keyword}&location=${location}&page=${page}`,
      );

      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch jobs",
      );
    }
  },
);

export const getJobById = createAsyncThunk(
  "jobs/getJobById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/jobs/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch job",
      );
    }
  },
);

// ================= RECOMMENDED =================

// 🔥 Get Recommended Jobs
export const getRecommendedJobs = createAsyncThunk(
  "jobs/getRecommendedJobs",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${API}/recommended`);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch recommended jobs",
      );
    }
  },
);

// ================= RECRUITER =================

// 🔥 Get My Jobs
export const getMyJobs = createAsyncThunk(
  "jobs/getMyJobs",
  async (params = {}, thunkAPI) => {
    try {
      const { page = 1, keyword = "", location = "", status = "" } = params;

      const res = await axios.get(
        `/jobs/my/jobs?page=${page}&keyword=${keyword}&location=${location}&status=${status}`,
      );

      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed");
    }
  },
);

// 🔥 Create Job
export const createJob = createAsyncThunk(
  "jobs/createJob",
  async (data, thunkAPI) => {
    try {
      const res = await axios.post(`${API}`, data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to create job",
      );
    }
  },
);

// 🔥 Delete Job
export const deleteJob = createAsyncThunk(
  "jobs/deleteJob",
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${API}/${id}`);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to delete job",
      );
    }
  },
);

// ================= SLICE =================

const jobSlice = createSlice({
  name: "jobs",
  initialState: {
    //Public Jobs

    jobs: [],
    total: 0,
    page: 1,
    pages: 1,
    job: null,

    //Recommended Jobs
    recommendedJobs: [],

    // Recruiter Jobs

    myJobs: [],
    myJobsPage: 1,
    myJobsPages: 1,
    myJobsHasMore: true,

    //Common State

    loading: false,
    error: null,
    success: false,
  },

  reducers: {
    // 🔄 Reset state (use after create job)
    resetJobState: (state) => {
      state.success = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ================= PUBLIC =================
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

      .addCase(getJobById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getJobById.fulfilled, (state, action) => {
        state.loading = false;
        state.job = action.payload.data;
      })
      .addCase(getJobById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= RECOMMENDED =================
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
      })

      // ================= MY JOBS =================
      .addCase(getMyJobs.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMyJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.myJobs = action.payload.jobs;
        state.myJobsPage = action.payload.page;
        state.myJobsPages = action.payload.pages;
      })
      .addCase(getMyJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= CREATE JOB =================
      .addCase(createJob.pending, (state) => {
        state.loading = true;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        state.myJobs.unshift(action.payload);
      })
      .addCase(createJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= DELETE JOB =================
      .addCase(deleteJob.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.loading = false;
        state.myJobs = state.myJobs.filter((job) => job._id !== action.payload);
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetJobState } = jobSlice.actions;
export default jobSlice.reducer;
