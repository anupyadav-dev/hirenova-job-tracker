import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

import { getJobs } from "../../features/jobs/jobSlice";
import useDebounce from "../../hooks/useDebounce";

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

  const { jobs, total, pages, loading, error } = useSelector(
    (state) => state.jobs,
  );

  const { user } = useSelector((state) => state.auth);
  const role = user?.role || "guest";

  // ================= READ FROM URL =================
  const keyword = searchParams.get("keyword") || "";
  const location = searchParams.get("location") || "";
  const jobType = searchParams.get("jobType") || "";
  const category = searchParams.get("category") || "";
  const minSalary = searchParams.get("minSalary") || "";
  const maxSalary = searchParams.get("maxSalary") || "";
  const experience = searchParams.get("experience") || "";
  const sort = searchParams.get("sort") || "latest";
  const currentPage = Number(searchParams.get("page")) || 1;

  // ================= DEBOUNCE =================
  const debouncedKeyword = useDebounce(keyword, 500);
  const debouncedLocation = useDebounce(location, 500);

  // ================= MEMO FILTERS =================
  const finalFilters = useMemo(() => {
    return {
      keyword: debouncedKeyword,
      location: debouncedLocation,
      jobType,
      category,
      minSalary,
      maxSalary,
      experience,
      sort,
      page: currentPage,
    };
  }, [
    debouncedKeyword,
    debouncedLocation,
    jobType,
    category,
    minSalary,
    maxSalary,
    experience,
    sort,
    currentPage,
  ]);

  // ================= API CALL =================
  useEffect(() => {
    dispatch(getJobs(finalFilters));
  }, [dispatch, finalFilters]);

  // ================= UPDATE URL =================
  const updateFilters = (newFilters) => {
    const updated = {
      keyword,
      location,
      jobType,
      category,
      minSalary,
      maxSalary,
      experience,
      sort,
      page: 1,
      ...newFilters,
    };

    const clean = Object.fromEntries(
      Object.entries(updated).filter(
        ([, value]) => value !== "" && value !== null,
      ),
    );

    setSearchParams(clean);
  };

  // ================= ERROR =================
  if (error?.jobs) {
    return <ErrorState message={error.jobs} />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Find Jobs</h1>
        <p className="text-sm text-gray-500 mt-1">{total} jobs found</p>
      </div>

      {/* SEARCH */}
      <SearchBar
        filters={{
          keyword,
          location,
          jobType,
          category,
          minSalary,
          maxSalary,
          experience,
          sort,
        }}
        setFilters={updateFilters}
      />

      {/* FILTER CHIPS */}
      <FilterChips
        filters={{
          keyword,
          location,
          jobType,
          category,
          minSalary,
          maxSalary,
          experience,
          sort,
        }}
        setFilters={updateFilters}
      />

      {/* JOB LIST */}
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

          {/* PAGINATION */}
          <Pagination
            page={currentPage}
            pages={pages}
            onPageChange={(newPage) => {
              setSearchParams({
                keyword,
                location,
                jobType,
                category,
                minSalary,
                maxSalary,
                experience,
                sort,
                page: newPage,
              });

              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </>
      )}
    </div>
  );
};

export default Jobs;
