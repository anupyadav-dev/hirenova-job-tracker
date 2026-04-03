const JobCard = ({ job }) => {
  return (
    <div className="border p-4 rounded">
      <h3 className="font-bold">{job.title}</h3>
      <p>{job.location}</p>
    </div>
  );
};

export default JobCard;
