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

        {/* ================= DASHBOARD (Recruiter + Admin) ================= */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Recruiter */}
          <Route
            path="recruiter/dashboard"
            element={
              <ProtectedRoute role="recruiter">
                <RecruiterDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="recruiter/create-job"
            element={
              <ProtectedRoute role="recruiter">
                <CreateJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="recruiter/jobs"
            element={
              <ProtectedRoute role="recruiter">
                <MyJobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="recruiter/applicants/:jobId"
            element={
              <ProtectedRoute role="recruiter">
                <Applicants />
              </ProtectedRoute>
            }
          />

          {/* Admin */}
          <Route
            path="admin/dashboard"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/users"
            element={
              <ProtectedRoute role="admin">
                <AllUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/jobs"
            element={
              <ProtectedRoute role="admin">
                <AllJobs />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
