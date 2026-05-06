import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

import { getJobs } from "../../features/jobs/jobSlice";
import JobList from "../../components/jobs/JobList";
import Pagination from "../../components/jobs/Pagination";
import SearchBar from "../../components/jobs/SearchBar";
import FilterChips from "../../components/jobs/FilterChips";

import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";
import JobActions from "../../components/jobs/JobActions";

const Jobs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const { jobs, total, page, pages, loading, error } = useSelector(
    (state) => state.jobs,
  );

  const { user } = useSelector((state) => state.auth);
  const role = user?.role || "guest";

  // 🔥 Read from URL
  const filters = {
    keyword: searchParams.get("keyword") || "",
    location: searchParams.get("location") || "",
    jobType: searchParams.get("jobType") || "",
    category: searchParams.get("category") || "",
    minSalary: searchParams.get("minSalary") || "",
    maxSalary: searchParams.get("maxSalary") || "",
    experience: searchParams.get("experience") || "",
    sort: searchParams.get("sort") || "latest",
    page: Number(searchParams.get("page")) || 1,
  };

  // 🔥 API call
  useEffect(() => {
    dispatch(getJobs(filters));
  }, [dispatch, searchParams.toString()]);

  // 🔥 Update URL
  const updateFilters = (newFilters) => {
    setSearchParams({
      ...filters,
      ...newFilters,
      page: 1, // reset page
    });
  };

  if (error.jobs) return <ErrorState message={error.jobs} />;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Find Jobs</h1>

      <SearchBar filters={filters} setFilters={updateFilters} />

      <FilterChips filters={filters} setFilters={updateFilters} />

      {loading.jobs ? (
        <Loader />
      ) : jobs.length === 0 ? (
        <EmptyState message="No jobs found" />
      ) : (
        <>
          <JobList
            jobs={jobs}
            role={role}
            onJobClick={(job) => navigate(`/jobs/${job._id}`)}
            renderActions={(job) => (
              <JobActions role={role} job={job} navigate={navigate} />
            )}
          />

          <Pagination
            page={page}
            pages={pages}
            onPageChange={(newPage) =>
              setSearchParams({ ...filters, page: newPage })
            }
          />
        </>
      )}
    </div>
  );
};

export default Jobs;
