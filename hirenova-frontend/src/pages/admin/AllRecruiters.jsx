import { useEffect, useState } from "react";
import axios from "../../api/axios";

const AllRecruiters = () => {
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRecruiters();
  }, []);

  const fetchRecruiters = async () => {
    try {
      setLoading(true);

      const res = await axios.get("/admin/recruiters");

      setRecruiters(res.data.recruiters || []);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to load recruiters");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="p-6">Loading recruiters...</p>;

  if (!recruiters.length) {
    return <p className="p-6">No recruiters found</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">All Recruiters</h1>

      <div className="grid gap-4">
        {recruiters.map((r) => (
          <div
            key={r._id}
            className="border rounded-lg p-4 flex justify-between items-center"
          >
            {/* LEFT SIDE */}
            <div>
              <h2 className="font-semibold text-lg">{r.name}</h2>
              <p className="text-sm text-gray-500">{r.email}</p>
            </div>

            {/* RIGHT SIDE */}
            <div className="text-right">
              <p className="text-sm font-medium">
                Jobs Posted: <span className="text-blue-600">{r.jobCount}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllRecruiters;
