import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";

// ================= USER =================

export const getMyApplications = createAsyncThunk(
  "applications/getMyApplications",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get("/applications/my-applications");
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  },
);

export const applyJob = createAsyncThunk(
  "applications/applyJob",
  async (jobId, thunkAPI) => {
    try {
      const res = await axios.post(`/applications/apply/${jobId}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Apply failed",
      );
    }
  },
);

// ================= RECRUITER =================

// 🔥 Get Applicants for a Job
export const getApplicants = createAsyncThunk(
  "applications/getApplicants",
  async (jobId, thunkAPI) => {
    try {
      const res = await axios.get(`/applications/job/${jobId}`);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch applicants",
      );
    }
  },
);

// 🔥 Update Application Status (accept / reject)
export const updateApplicationStatus = createAsyncThunk(
  "applications/updateApplicationStatus",
  async ({ id, status }, thunkAPI) => {
    try {
      const res = await axios.patch(`/applications/${id}/status`, { status });
      return { id, status, data: res.data };
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
    applications: [],

    // for recruiter)
    applicants: [],

    loading: false,
    error: null,
    applying: false,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      // ================= USER =================
      .addCase(getMyApplications.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMyApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload;
      })
      .addCase(getMyApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(applyJob.pending, (state) => {
        state.applying = true;
      })
      .addCase(applyJob.fulfilled, (state, action) => {
        state.applying = false;

        // optional: push locally (instant UI)
        if (action.payload?.application) {
          state.applications.unshift(action.payload.application);
        }
      })
      .addCase(applyJob.rejected, (state, action) => {
        state.applying = false;
        state.error = action.payload;
      })

      // ================= GET APPLICANTS =================
      .addCase(getApplicants.pending, (state) => {
        state.loading = true;
      })
      .addCase(getApplicants.fulfilled, (state, action) => {
        state.loading = false;
        state.applicants = action.payload;
      })
      .addCase(getApplicants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= UPDATE STATUS =================
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        const { id, status } = action.payload;

        // 🔥 Update locally (instant UI)
        const applicant = state.applicants.find((a) => a._id === id);
        if (applicant) {
          applicant.status = status;
        }
      });
  },
});

export default applicationSlice.reducer;
