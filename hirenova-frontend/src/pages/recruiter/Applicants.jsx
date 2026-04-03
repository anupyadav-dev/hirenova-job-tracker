import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../api/axios";

const Applicants = () => {
  const { jobId } = useParams();
  const [apps, setApps] = useState([]);
  console.log(apps);

  useEffect(() => {
    const fetchApplicants = async () => {
      const res = await axios.get(`/applications/job/${jobId}`);

      setApps(res.data.applicants);
    };

    fetchApplicants();
  }, []);

  const updateStatus = async (id, status) => {
    await axios.patch(`/applications/${id}/status`, { status });

    alert("Updated!");
  };

  return (
    <div className="p-6">
      <h1>Applicants</h1>

      {apps.map((app) => (
        <div key={app._id} className="border p-4 mb-3">
          <p>{app.applicant.name}</p>

          <button onClick={() => updateStatus(app._id, "accepted")}>
            Accept
          </button>

          <button onClick={() => updateStatus(app._id, "rejected")}>
            Reject
          </button>
        </div>
      ))}
    </div>
  );
};

export default Applicants;
