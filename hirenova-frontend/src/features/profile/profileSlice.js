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
      });
  },
});

export default profileSlice.reducer;
