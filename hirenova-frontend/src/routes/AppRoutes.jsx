import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";

// Public Pages
import Home from "../pages/public/Home";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";
import Jobs from "../pages/user/Jobs";
import JobDetails from "../pages/user/JobDetails";

// User
import MyApplications from "../pages/user/MyApplications";

// Recruiter
import CreateJob from "../pages/recruiter/CreateJob";
import MyJobs from "../pages/recruiter/MyJobs";
import Applicants from "../pages/recruiter/Applicants";
import RecruiterDashboard from "../pages/recruiter/RecruiterDashboard";

// Admin
import AdminDashboard from "../pages/admin/AdminDashboard";
import AllJobs from "../pages/admin/AllJobs";
import AllUsers from "../pages/admin/AllUsers";

// Toast
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        {/* PUBLIC LAYOUT */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
        </Route>

        {/* AUTH ROUTES (NO NAVBAR) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* USER */}
        <Route element={<MainLayout />}>
          <Route
            path="/my-applications"
            element={
              <ProtectedRoute role="user">
                <MyApplications />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* DASHBOARD LAYOUT (Recruiter + Admin) */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Recruiter */}
          <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
          <Route path="/recruiter/create-job" element={<CreateJob />} />
          <Route path="/recruiter/jobs" element={<MyJobs />} />
          <Route path="/recruiter/applicants/:jobId" element={<Applicants />} />

          {/* Admin */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AllUsers />} />
          <Route path="/admin/jobs" element={<AllJobs />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
