import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";

// ================= USER =================

// 🔥 Get My Applications
export const getMyApplications = createAsyncThunk(
  "applications/getMyApplications",
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get("/applications/my");
      return data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch applications",
      );
    }
  },
);

// 🔥 Apply Job (with resume + coverLetter)
export const applyJob = createAsyncThunk(
  "applications/applyJob",
  async ({ jobId, formData }, thunkAPI) => {
    try {
      const { data } = await axios.post(
        `/applications/${jobId}/apply`,
        formData,
      );
      return data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Apply failed",
      );
    }
  },
);

// 🔥 Withdraw Application
export const withdrawApplication = createAsyncThunk(
  "applications/withdrawApplication",
  async (applicationId, thunkAPI) => {
    try {
      await axios.delete(`/applications/${applicationId}`);
      return applicationId;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Withdraw failed",
      );
    }
  },
);

// ================= RECRUITER =================

// 🔥 Get Applicants
export const getApplicants = createAsyncThunk(
  "applications/getApplicants",
  async (jobId, thunkAPI) => {
    try {
      const { data } = await axios.get(`/applications/job/${jobId}`);
      return data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch applicants",
      );
    }
  },
);

// 🔥 Update Status
export const updateApplicationStatus = createAsyncThunk(
  "applications/updateApplicationStatus",
  async ({ id, status }, thunkAPI) => {
    try {
      const { data } = await axios.patch(`/applications/${id}/status`, {
        status,
      });
      return data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to update status",
      );
    }
  },
);

// ================= SLICE =================

const applicationSlice = createSlice({
  name: "applications",
  initialState: {
    // User
    applications: [],
    appliedJobIds: [],

    // Recruiter
    applicants: [],

    // Loading states
    loading: {
      applications: false,
      applicants: false,
      action: false,
    },

    // Errors
    error: {
      applications: null,
      applicants: null,
      action: null,
    },
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      // ================= GET MY APPLICATIONS =================
      .addCase(getMyApplications.pending, (state) => {
        state.loading.applications = true;
      })
      .addCase(getMyApplications.fulfilled, (state, action) => {
        state.loading.applications = false;
        state.applications = action.payload;

        // 🔥 derive appliedJobIds
        state.appliedJobIds = action.payload.map((app) => app.job._id);
      })
      .addCase(getMyApplications.rejected, (state, action) => {
        state.loading.applications = false;
        state.error.applications = action.payload;
      })

      // ================= APPLY JOB =================
      .addCase(applyJob.pending, (state) => {
        state.loading.action = true;
      })
      .addCase(applyJob.fulfilled, (state, action) => {
        state.loading.action = false;

        const newApp = action.payload;

        // prevent duplicate
        const exists = state.applications.some(
          (app) => app.job._id === newApp.job._id,
        );

        if (!exists) {
          state.applications.unshift(newApp);
          state.appliedJobIds.push(newApp.job._id);
        }
      })
      .addCase(applyJob.rejected, (state, action) => {
        state.loading.action = false;
        state.error.action = action.payload;
      })

      // ================= WITHDRAW =================
      .addCase(withdrawApplication.pending, (state) => {
        state.loading.action = true;
      })
      .addCase(withdrawApplication.fulfilled, (state, action) => {
        state.loading.action = false;

        state.applications = state.applications.filter(
          (app) => app._id !== action.payload,
        );

        state.appliedJobIds = state.applications.map((app) => app.job._id);
      })
      .addCase(withdrawApplication.rejected, (state, action) => {
        state.loading.action = false;
        state.error.action = action.payload;
      })

      // ================= GET APPLICANTS =================
      .addCase(getApplicants.pending, (state) => {
        state.loading.applicants = true;
      })
      .addCase(getApplicants.fulfilled, (state, action) => {
        state.loading.applicants = false;
        state.applicants = action.payload;
      })
      .addCase(getApplicants.rejected, (state, action) => {
        state.loading.applicants = false;
        state.error.applicants = action.payload;
      })

      // ================= UPDATE STATUS =================
      .addCase(updateApplicationStatus.pending, (state) => {
        state.loading.action = true;
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        state.loading.action = false;

        const updated = action.payload;

        const index = state.applicants.findIndex((a) => a._id === updated._id);

        if (index !== -1) {
          state.applicants[index] = updated;
        }
      })
      .addCase(updateApplicationStatus.rejected, (state, action) => {
        state.loading.action = false;
        state.error.action = action.payload;
      });
  },
});

export default applicationSlice.reducer;
