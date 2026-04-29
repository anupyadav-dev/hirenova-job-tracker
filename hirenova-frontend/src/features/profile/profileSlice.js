import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";

export const getMyProfile = createAsyncThunk(
  "profile/getMyProfile",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get("/profile/me");
      return res.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile",
      );
    }
  },
);

export const updateMyProfile = createAsyncThunk(
  "profile/updateMyProfile",
  async (profileData, thunkAPI) => {
    try {
      const res = await axios.put("/profile/me", profileData);

      return res.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Profile update failed",
      );
    }
  },
);

export const uploadAvatar = createAsyncThunk(
  "profile/uploadAvatar",
  async (file, thunkAPI) => {
    try {
      const formData = new FormData();

      formData.append("avatar", file);

      const res = await axios.patch("/profile/me/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Avatar upload failed",
      );
    }
  },
);

export const uploadResume = createAsyncThunk(
  "profile/uploadResume",
  async (file, thunkAPI) => {
    try {
      const formData = new FormData();

      formData.append("resume", file);

      const res = await axios.patch("/profile/me/resume", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Resume upload failed",
      );
    }
  },
);

const profileSlice = createSlice({
  name: "profile",

  initialState: {
    profile: null,
    completion: null,
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(getMyProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getMyProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.profile;
        state.completion = action.payload.completion;
      })

      .addCase(getMyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateMyProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateMyProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })

      .addCase(updateMyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(uploadAvatar.pending, (state) => {
        state.loading = true;
      })

      .addCase(uploadAvatar.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })

      .addCase(uploadAvatar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(uploadResume.pending, (state) => {
        state.loading = true;
      })

      .addCase(uploadResume.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })

      .addCase(uploadResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default profileSlice.reducer;
