const ApplicationCard = ({ app }) => {
  return (
    <div className="border p-4 rounded">
      <h3>{app.job.title}</h3>
      <p>Status: {app.status}</p>
    </div>
  );
};

export default ApplicationCard;
