import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyApplications } from "../../features/applications/applicationSlice";

const MyApplications = () => {
  const dispatch = useDispatch();
  const { applications, loading } = useSelector((state) => state.applications);

  useEffect(() => {
    dispatch(getMyApplications());
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Applications</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid gap-4">
          {applications.map((app) => (
            <div key={app._id} className="border p-4 shadow">
              <h2 className="text-lg font-semibold">{app.job.title}</h2>
              <p>{app.job.location}</p>

              <span
                className={`px-2 py-1 text-white ${
                  app.status === "accepted"
                    ? "bg-green-500"
                    : app.status === "rejected"
                    ? "bg-red-500"
                    : "bg-yellow-500"
                }`}
              >
                {app.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
