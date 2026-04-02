import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import ProtectedRoute from "./routes/ProtectedRoute";
import MyApplications from "./pages/MyApplications";
import CreateJob from "./pages/CreateJob";
import MyJobs from "./pages/MyJobs";
import Applicants from "./pages/Applicants";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AllJobs from "./pages/AllJobs";
import AllUsers from "./pages/AllUsers";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Jobs />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/jobs/:id"
          element={
            <ProtectedRoute>
              <JobDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-applications"
          element={
            <ProtectedRoute role="user">
              <MyApplications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recruiter/create-job"
          element={
            <ProtectedRoute role="recruiter">
              <CreateJob />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recruiter/jobs"
          element={
            <ProtectedRoute role="recruiter">
              <MyJobs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recruiter/applicants/:jobId"
          element={
            <ProtectedRoute role="recruiter">
              <Applicants />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recruiter/dashboard"
          element={
            <ProtectedRoute role="recruiter">
              <RecruiterDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute role="admin">
              <AllUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/jobs"
          element={
            <ProtectedRoute role="admin">
              <AllJobs />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
