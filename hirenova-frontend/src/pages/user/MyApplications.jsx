import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyApplications } from "../../features/applications/applicationSlice";
import { ApplicationCard } from "../../components/applications/ApplicationCard";

import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";

const FILTERS = ["all", "pending", "accepted", "rejected"];

const MyApplications = () => {
  const dispatch = useDispatch();

  const { applications, loading, error } = useSelector(
    (state) => state.applications,
  );

  const [filter, setFilter] = useState("all");

  useEffect(() => {
    dispatch(getMyApplications());
  }, [dispatch]);

  // filtered data
  const filteredApplications = useMemo(() => {
    if (!applications) return [];
    if (filter === "all") return applications;
    return applications.filter((app) => app.status === filter);
  }, [applications, filter]);

  // states
  if (loading) {
    return (
      <div className="p-6">
        <Loader />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error || "Something went wrong"} />;
  }

  if (!applications || applications.length === 0) {
    return <EmptyState message="You haven't applied to any jobs yet" />;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Applications</h1>
        <p className="text-sm text-gray-500 mt-1">
          Track your job applications and their status
        </p>
      </div>

      {/* FILTER BAR */}
      <div className="sticky top-0 z-10 bg-white py-3 mb-6 border-b">
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition
                ${
                  filter === status
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}

          <span className="ml-auto text-sm text-gray-500 self-center">
            {filteredApplications.length} applications
          </span>
        </div>
      </div>

      {/* LIST */}
      <div className="grid gap-4">
        {filteredApplications.map((app) => (
          <ApplicationCard key={app._id} app={app} />
        ))}
      </div>
    </div>
  );
};

export default MyApplications;
