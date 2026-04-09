import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyApplications } from "../../features/applications/applicationSlice";
import { ApplicationCard } from "../../components/applications/ApplicationCard";

// ✅ Your reusable components
import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";

const MyApplications = () => {
  const dispatch = useDispatch();

  const { applications, loading, error } = useSelector(
    (state) => state.applications
  );

  const [filter, setFilter] = useState("all");

  useEffect(() => {
    dispatch(getMyApplications());
  }, [dispatch]);

  // 🔥 Filtered data (optimized)
  const filteredApplications = useMemo(() => {
    if (filter === "all") return applications;
    return applications.filter((app) => app.status === filter);
  }, [applications, filter]);

  // 🔹 Loading
  if (loading) return <Loader />;

  // 🔹 Error
  if (error) return <ErrorState message="Failed to load applications" />;

  // 🔹 Empty
  if (!applications || applications.length === 0) {
    return <EmptyState message="You haven't applied to any jobs yet" />;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-4">My Applications</h1>

      {/* 🔥 Filter Tabs */}
      <div className="flex gap-3 mb-5">
        {["all", "pending", "accepted", "rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-1 rounded-full text-sm capitalize transition
              ${
                filter === status
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Applications List */}
      <div className="grid gap-4">
        {filteredApplications.map((app) => (
          <ApplicationCard key={app._id} app={app} />
        ))}
      </div>
    </div>
  );
};

export default MyApplications;
