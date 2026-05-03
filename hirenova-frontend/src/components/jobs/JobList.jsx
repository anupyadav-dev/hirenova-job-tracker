import JobCard from "./JobCard";

const JobList = ({ jobs = [], renderActions, onJobClick, role }) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {jobs.map((job) => (
        <JobCard
          key={job._id}
          job={job}
          onClick={() => onJobClick(job)}
          actions={renderActions(job, role)}
        />
      ))}
    </div>
  );
};

export default JobList;
