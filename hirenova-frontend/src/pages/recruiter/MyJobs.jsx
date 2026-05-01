import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyJobs, deleteJob } from "../../features/jobs/jobSlice";
import { useNavigate } from "react-router-dom";
import useDebounce from "../../hooks/useDebounce";
import { toast } from "react-toastify";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import Pagination from "../../components/jobs/Pagination";

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

  // 🔥 ONLY filters change → reset page to 1
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
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      await dispatch(deleteJob(id)).unwrap();
      toast.success("Job deleted successfully");

      // 🔥 refetch current page
      dispatch(
        getMyJobs({
          ...filters,
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
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-3">
        <h1 className="text-2xl font-bold">My Jobs</h1>

        <button
          onClick={() => navigate("/recruiter/create-job")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full md:w-auto"
        >
          + Create Job
        </button>
      </div>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded shadow mb-6 grid grid-cols-1 md:grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="Search title..."
          value={filters.keyword}
          onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
          className="border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Location..."
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          className="border p-2 rounded"
        />
      </div>

      {/* TABS */}
      <div className="flex gap-4 mb-6">
        {["", "active", "closed"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilters({ ...filters, status: tab })}
            className={`px-4 py-2 rounded ${
              filters.status === tab ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {tab === "" ? "All" : tab}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader />
      ) : !myJobs || myJobs.length === 0 ? (
        <EmptyState
          message={
            filters.keyword || filters.location || filters.status
              ? "No jobs match your search"
              : "No jobs posted yet"
          }
        />
      ) : (
        <>
          {/* JOB LIST */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {myJobs.map((job) => (
              <div
                key={job._id}
                className="border rounded-lg p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <h2 className="text-lg font-semibold">{job.title}</h2>

                    <span
                      className={`text-xs px-2 py-1 rounded-full capitalize ${
                        job.status === "active"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500">
                    {job.company} • {job.location}
                  </p>

                  <p className="text-sm mt-1 text-gray-600">
                    ₹{job.salary?.toLocaleString()} / year
                  </p>
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => navigate(`/recruiter/applicants/${job._id}`)}
                    className="bg-green-500 text-white px-3 py-1 rounded text-sm flex-1"
                  >
                    Applicants
                  </button>

                  <button
                    onClick={() => navigate(`/recruiter/edit-job/${job._id}`)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded text-sm flex-1"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(job._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm flex-1"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

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
