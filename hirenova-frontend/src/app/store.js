import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import jobReducer from "../features/jobs/jobSlice";
import applicationReducer from "../features/applications/applicationSlice";
import recruiterReducer from "../features/recruiter/recruiterSlice";
import adminReducer from "../features/admin/adminSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobReducer,
    applications: applicationReducer,
    recruiter: recruiterReducer,
    admin: adminReducer,
  },
});
