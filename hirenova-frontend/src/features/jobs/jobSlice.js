import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";

const API = "/jobs";

// ================= PUBLIC =================

// 🔥 Get All Jobs
export const getJobs = createAsyncThunk(
  "jobs/getJobs",
  async (params = {}, thunkAPI) => {
    try {
      const { data } = await axios.get(API, { params });
      return data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch jobs",
      );
    }
  },
);

// 🔥 Get Job By ID
export const getJobById = createAsyncThunk(
  "jobs/getJobById",
  async (id, thunkAPI) => {
    try {
      const { data } = await axios.get(`${API}/${id}`);
      return data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch job",
      );
    }
  },
);

// 🔥 Latest Jobs
export const getLatestJobs = createAsyncThunk(
  "jobs/getLatestJobs",
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get(`${API}/latest`);
      return data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch latest jobs",
      );
    }
  },
);

// ================= RECOMMENDED =================

export const getRecommendedJobs = createAsyncThunk(
  "jobs/getRecommendedJobs",
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get(`${API}/recommended`);
      return data.data;
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
      const { data } = await axios.get("/jobs/my/jobs", { params });
      return data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch my jobs",
      );
    }
  },
);

// 🔥 Create Job
export const createJob = createAsyncThunk(
  "jobs/createJob",
  async (jobData, thunkAPI) => {
    try {
      const { data } = await axios.post(API, jobData);
      return data.data; // 🔥 FIXED
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
    // Public
    jobs: [],
    job: null,
    latestJobs: [],
    recommendedJobs: [],

    total: 0,
    page: 1,
    pages: 1,

    // Recruiter
    myJobs: [],
    myJobsPage: 1,
    myJobsPages: 1,

    // Loading states
    loading: {
      jobs: false,
      latest: false,
      recommended: false,
      myJobs: false,
      action: false,
    },

    // Errors
    error: {
      jobs: null,
      latest: null,
      recommended: null,
      myJobs: null,
      action: null,
    },

    success: false,
  },

  reducers: {
    resetJobState: (state) => {
      state.success = false;
      state.error.action = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ================= GET JOBS =================
      .addCase(getJobs.pending, (state) => {
        state.loading.jobs = true;
      })
      .addCase(getJobs.fulfilled, (state, action) => {
        state.loading.jobs = false;
        state.jobs = action.payload.jobs;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(getJobs.rejected, (state, action) => {
        state.loading.jobs = false;
        state.error.jobs = action.payload;
      })

      // ================= GET JOB BY ID =================
      .addCase(getJobById.pending, (state) => {
        state.loading.jobs = true;
      })
      .addCase(getJobById.fulfilled, (state, action) => {
        state.loading.jobs = false;
        state.job = action.payload;
      })
      .addCase(getJobById.rejected, (state, action) => {
        state.loading.jobs = false;
        state.error.jobs = action.payload;
      })

      // ================= LATEST JOBS =================
      .addCase(getLatestJobs.pending, (state) => {
        state.loading.latest = true;
      })
      .addCase(getLatestJobs.fulfilled, (state, action) => {
        state.loading.latest = false;
        state.latestJobs = action.payload;
      })
      .addCase(getLatestJobs.rejected, (state, action) => {
        state.loading.latest = false;
        state.error.latest = action.payload;
      })

      // ================= RECOMMENDED =================
      .addCase(getRecommendedJobs.pending, (state) => {
        state.loading.recommended = true;
      })
      .addCase(getRecommendedJobs.fulfilled, (state, action) => {
        state.loading.recommended = false;
        state.recommendedJobs = action.payload;
      })
      .addCase(getRecommendedJobs.rejected, (state, action) => {
        state.loading.recommended = false;
        state.error.recommended = action.payload;
      })

      // ================= MY JOBS =================
      .addCase(getMyJobs.pending, (state) => {
        state.loading.myJobs = true;
      })
      .addCase(getMyJobs.fulfilled, (state, action) => {
        state.loading.myJobs = false;
        state.myJobs = action.payload.jobs;
        state.myJobsPage = action.payload.page;
        state.myJobsPages = action.payload.pages;
      })
      .addCase(getMyJobs.rejected, (state, action) => {
        state.loading.myJobs = false;
        state.error.myJobs = action.payload;
      })

      // ================= CREATE JOB =================
      .addCase(createJob.pending, (state) => {
        state.loading.action = true;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.loading.action = false;
        state.success = true;
        state.myJobs.unshift(action.payload);
      })
      .addCase(createJob.rejected, (state, action) => {
        state.loading.action = false;
        state.error.action = action.payload;
      })

      // ================= DELETE JOB =================
      .addCase(deleteJob.pending, (state) => {
        state.loading.action = true;
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.loading.action = false;
        state.myJobs = state.myJobs.filter((job) => job._id !== action.payload);
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.loading.action = false;
        state.error.action = action.payload;
      });
  },
});

export const { resetJobState } = jobSlice.actions;
export default jobSlice.reducer;
