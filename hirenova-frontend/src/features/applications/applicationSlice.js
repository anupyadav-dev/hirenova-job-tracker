import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";

// ================= USER =================

export const getMyApplications = createAsyncThunk(
  "applications/getMyApplications",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get("/applications/my-applications");
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data.message);
    }
  }
);

// ================= RECRUITER =================

// 🔥 Get Applicants for a Job
export const getApplicants = createAsyncThunk(
  "applications/getApplicants",
  async (jobId, thunkAPI) => {
    try {
      const res = await axios.get(`/applications/${jobId}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch applicants"
      );
    }
  }
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
        err.response?.data?.message || "Failed to update status"
      );
    }
  }
);

// ================= SLICE =================

const applicationSlice = createSlice({
  name: "applications",
  initialState: {
    applications: [],

    // 🔥 NEW (for recruiter)
    applicants: [],

    loading: false,
    error: null,
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
        state.applications = action.payload.applications;
      })
      .addCase(getMyApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= GET APPLICANTS =================
      .addCase(getApplicants.pending, (state) => {
        state.loading = true;
      })
      .addCase(getApplicants.fulfilled, (state, action) => {
        state.loading = false;
        state.applicants = action.payload.applicants || [];
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
