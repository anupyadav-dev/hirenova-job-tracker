import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyJobs, deleteJob } from "../../features/jobs/jobSlice";
import { useNavigate } from "react-router-dom";
import useDebounce from "../../hooks/useDebounce";
import { toast } from "react-toastify";

import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import Pagination from "../../components/jobs/Pagination";
import JobList from "../../components/jobs/JobList";
import JobActions from "../../components/jobs/JobActions";

const MyJobs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { myJobs, loading, myJobsPage, myJobsPages } = useSelector(
    (state) => state.jobs,
  );

  const [filters, setFilters] = useState({
    keyword: "",
    location: "",
    status: "",
  });

  const debouncedKeyword = useDebounce(filters.keyword, 500);
  const debouncedLocation = useDebounce(filters.location, 500);

  // 🔥 Fetch jobs
  useEffect(() => {
    dispatch(
      getMyJobs({
        keyword: debouncedKeyword,
        location: debouncedLocation,
        status: filters.status,
        page: 1,
      }),
    );
  }, [dispatch, debouncedKeyword, debouncedLocation, filters.status]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await dispatch(deleteJob(id)).unwrap();
      toast.success("Job deleted");

      dispatch(
        getMyJobs({
          keyword: debouncedKeyword,
          location: debouncedLocation,
          status: filters.status,
          page: myJobsPage,
        }),
      );
    } catch (err) {
      toast.error(err || "Delete failed");
    }
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > myJobsPages) return;

    dispatch(
      getMyJobs({
        keyword: debouncedKeyword,
        location: debouncedLocation,
        status: filters.status,
        page,
      }),
    );

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Jobs</h1>

        <button
          onClick={() => navigate("/recruiter/create-job")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Create Job
        </button>
      </div>

      {/* FILTERS */}
      <div className="grid md:grid-cols-2 gap-3 mb-6">
        <input
          placeholder="Search title..."
          value={filters.keyword}
          onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
          className="border p-2 rounded"
        />

        <input
          placeholder="Location..."
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          className="border p-2 rounded"
        />
      </div>

      {/* TABS */}
      <div className="flex gap-3 mb-6">
        {["", "active", "closed"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilters({ ...filters, status: tab })}
            className={`px-3 py-1 rounded ${
              filters.status === tab ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {tab === "" ? "All" : tab}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      {loading ? (
        <Loader />
      ) : !myJobs || myJobs.length === 0 ? (
        <EmptyState message="No jobs found" />
      ) : (
        <>
          {/* 🔥 REUSABLE COMPONENT */}
          <JobList
            jobs={myJobs}
            onJobClick={(job) => navigate(`/recruiter/jobs/${job._id}`)}
            renderActions={(job) => (
              <JobActions
                role="recruiter"
                job={job}
                onDelete={handleDelete}
                navigate={navigate}
              />
            )}
          />

          {/* PAGINATION */}
          <Pagination
            page={myJobsPage}
            pages={myJobsPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default MyJobs;
