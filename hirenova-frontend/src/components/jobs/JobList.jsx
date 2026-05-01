import JobCard from "./JobCard";

const JobList = ({ jobs = [] }) => {
  if (!jobs.length) {
    return <p className="text-center text-gray-500">No jobs found</p>;
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {jobs.map((job) => (
        <JobCard key={job._id} job={job} />
      ))}
    </div>
  );
};

export default JobList;
