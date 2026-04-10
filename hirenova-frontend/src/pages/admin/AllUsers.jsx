import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllUsers,
  updateUserStatus,
  deleteUser,
} from "../../features/admin/adminSlice";
import Loader from "../../components/common/Loader";
import { toast } from "react-toastify";

const AllUsers = () => {
  const dispatch = useDispatch();

  const { users, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  // 🔥 status toggle
  const handleStatus = (userId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "blocked" : "active";

    dispatch(updateUserStatus({ userId, status: newStatus }));
    toast.success(`User ${newStatus}`);
  };

  // 🔥 delete user
  const handleDelete = (userId) => {
    if (window.confirm("Are you sure?")) {
      dispatch(deleteUser(userId));
      toast.success("User deleted");
    }
  };

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">All Users</h1>

      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Role</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users?.length > 0 ? (
              users.map((user) => (
                <tr key={user._id} className="text-center">
                  {/* Name */}
                  <td className="p-3 border">{user.name}</td>

                  {/* Email */}
                  <td className="p-3 border">{user.email}</td>

                  {/* Role */}
                  <td className="p-3 border capitalize">{user.role}</td>

                  {/* Status */}
                  <td className="p-3 border">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        user.status === "active"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {user.status || "active"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-3 border space-x-2">
                    <button
                      onClick={() => handleStatus(user._id, user.status)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Toggle Status
                    </button>

                    <button
                      onClick={() => handleDelete(user._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUsers;
