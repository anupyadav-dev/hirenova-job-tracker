import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAdminDashboard } from "../../features/admin/adminSlice";

import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";

const AdminDashboard = () => {
  const dispatch = useDispatch();

  const { dashboard, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(getAdminDashboard());
  }, [dispatch]);

  if (loading) return <Loader />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center">Admin Dashboard</h1>

      {/* 🔥 Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard title="Total Users" value={dashboard.totalUsers} />
        <StatCard title="Total Jobs" value={dashboard.totalJobs} />
        <StatCard title="Total Recruiters" value={dashboard.totalRecruiters} />
      </div>
    </div>
  );
};

export default AdminDashboard;

// 🔥 Reusable Card
const StatCard = ({ title, value }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow text-center">
      <p className="text-gray-500">{title}</p>
      <h2 className="text-2xl font-bold mt-2">{value}</h2>
    </div>
  );
};
