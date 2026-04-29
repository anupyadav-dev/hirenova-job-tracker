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

export const createMyProfile = createAsyncThunk(
  "profile/createMyProfile",
  async (profileData, thunkAPI) => {
    try {
      await axios.post("/profile", profileData);

      await thunkAPI.dispatch(getMyProfile());

      return true;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Create profile failed",
      );
    }
  },
);

export const updateMyProfile = createAsyncThunk(
  "profile/updateMyProfile",
  async (profileData, thunkAPI) => {
    try {
      await axios.put("/profile/me", profileData);

      await thunkAPI.dispatch(getMyProfile());

      return true;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Update failed",
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

      await axios.patch("/profile/me/avatar", formData);

      await thunkAPI.dispatch(getMyProfile());

      return true;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Avatar upload failed",
      );
    }
  },
);

export const deleteAvatar = createAsyncThunk(
  "profile/deleteAvatar",
  async (_, thunkAPI) => {
    try {
      await axios.delete("/profile/me/avatar");

      await thunkAPI.dispatch(getMyProfile());

      return true;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Delete avatar failed",
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

      await axios.patch("/profile/me/resume", formData);

      await thunkAPI.dispatch(getMyProfile());

      return true;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Resume upload failed",
      );
    }
  },
);

export const deleteResume = createAsyncThunk(
  "profile/deleteResume",
  async (_, thunkAPI) => {
    try {
      await axios.delete("/profile/me/resume");

      await thunkAPI.dispatch(getMyProfile());

      return true;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Delete resume failed",
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

      .addMatcher(
        (action) =>
          action.type.endsWith("/pending") &&
          action.type !== getMyProfile.pending.type,

        (state) => {
          state.loading = true;
          state.error = null;
        },
      )

      .addMatcher(
        (action) =>
          action.type.endsWith("/fulfilled") &&
          action.type !== getMyProfile.fulfilled.type,

        (state) => {
          state.loading = false;
        },
      )

      .addMatcher(
        (action) =>
          action.type.endsWith("/rejected") &&
          action.type !== getMyProfile.rejected.type,

        (state, action) => {
          state.loading = false;

          state.error = action.payload;
        },
      );
  },
});

export default profileSlice.reducer;
