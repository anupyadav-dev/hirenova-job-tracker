import { useEffect, useState } from "react";
import axios from "../api/axios";

const AllUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.get("/admin/users");
      setUsers(res.data.users);
    };

    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <h1>All Users</h1>

      {users.map((user) => (
        <div key={user._id} className="border p-3 mb-2">
          <p>{user.name}</p>
          <p>{user.email}</p>
          <p>{user.role}</p>
        </div>
      ))}
    </div>
  );
};

export default AllUsers;
