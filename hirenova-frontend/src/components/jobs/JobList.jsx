import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getJobs } from "../../features/jobs/jobSlice";
import JobCard from "./JobCard";

const JobList = ({ jobs, limit }) => {
  const dispatch = useDispatch();
  const jobState = useSelector((state) => state.jobs);

  // 👇 Home page ke liye auto fetch
  useEffect(() => {
    if (!jobs) {
      dispatch(getJobs({ page: 1 }));
    }
  }, [dispatch]);

  const displayJobs = jobs || jobState.jobs;

  const finalJobs = limit ? displayJobs.slice(0, limit) : displayJobs;

  return (
    <div className="grid gap-4">
      {finalJobs.map((job) => (
        <JobCard key={job._id} job={job} />
      ))}
    </div>
  );
};

export default JobList;
