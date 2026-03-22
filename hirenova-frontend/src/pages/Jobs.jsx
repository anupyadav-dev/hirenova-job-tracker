import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getJobs } from "../features/jobs/jobSlice";

const Jobs = () => {
  const dispatch = useDispatch();
  const { jobs, loading, page, pages } = useSelector((state) => state.jobs);

  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    dispatch(getJobs({ keyword, location, page: 1 }));
  }, []);

  const handleSearch = () => {
    dispatch(getJobs({ keyword, location, page: 1 }));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Jobs</h1>

      {/* Search */}
      <div className="flex gap-2 mb-4">
        <input
          placeholder="Search job"
          className="border p-2"
          onChange={(e) => setKeyword(e.target.value)}
        />
        <input
          placeholder="Location"
          className="border p-2"
          onChange={(e) => setLocation(e.target.value)}
        />
        <button onClick={handleSearch} className="bg-blue-500 text-white px-4">
          Search
        </button>
      </div>

      {/* Jobs */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <div key={job._id} className="border p-4 shadow">
              <h2 className="text-lg font-semibold">{job.title}</h2>
              <p>{job.description}</p>
              <p className="text-sm text-gray-500">{job.location}</p>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex gap-2 mt-4">
        {[...Array(pages).keys()].map((x) => (
          <button
            key={x + 1}
            onClick={() =>
              dispatch(getJobs({ keyword, location, page: x + 1 }))
            }
            className="border px-3 py-1"
          >
            {x + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Jobs;
