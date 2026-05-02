import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { getJobs } from "../../features/jobs/jobSlice";
import useDebounce from "../../hooks/useDebounce";

import SearchBar from "../../components/jobs/SearchBar";
import JobList from "../../components/jobs/JobList";
import Pagination from "../../components/jobs/Pagination";

import Loader from "../../components/common/Loader";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";
import ApplyButton from "../../components/jobs/ApplyButton";

const Jobs = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { jobs, loading, total, page, pages, error } = useSelector(
    (state) => state.jobs,
  );

  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const debouncedKeyword = useDebounce(keyword, 500);
  const debouncedLocation = useDebounce(location, 500);

  useEffect(() => {
    dispatch(
      getJobs({ keyword: debouncedKeyword, location: debouncedLocation, page }),
    );
  }, [dispatch, debouncedKeyword, debouncedLocation, page]);

  if (error) return <ErrorState message={error} />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Find Jobs</h1>
      <p className="text-sm text-gray-500 mb-4">{total} jobs found</p>

      <SearchBar
        keyword={keyword}
        setKeyword={setKeyword}
        location={location}
        setLocation={setLocation}
      />

      {loading ? (
        <Loader />
      ) : (
        <>
          {jobs && jobs.length > 0 ? (
            <>
              <JobList
                jobs={jobs}
                 onJobClick={(job) => navigate(`/jobs/${job._id}`)}
                renderActions={(job) => <ApplyButton jobId={job._id} />}
              />
              <Pagination
                page={page}
                pages={pages}
                onPageChange={(newPage) =>
                  dispatch(getJobs({ keyword, location, page: newPage }))
                }
              />
            </>
          ) : (
            <EmptyState message="No jobs found" />
          )}
        </>
      )}
    </div>
  );
};

export default Jobs;
