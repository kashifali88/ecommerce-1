import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // ======================
  // FETCH USERS
  // ======================
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/user");
      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Failed to fetch users");
      }

      setUsers(data.users);
    } catch (error) {
      toast.error(error.message, { toastId: "users-error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen pt-16 bg-gray-50">

      {/* HEADER */}
      <div className="max-w-6xl mx-auto px-6 py-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold">
          All Users
        </h1>
        <p className="text-gray-500 mt-2">
          Manage registered users
        </p>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="flex justify-center">
          <Spinner />
        </div>
      )}

      {/* USERS TABLE */}
      {!loading && (
        <div className="max-w-6xl mx-auto px-6 pb-10 overflow-x-auto">

          <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-200 text-left">
              <tr>
                <th className="p-3">Avatar</th>
                <th className="p-3">Username</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Created</th>
              </tr>
            </thead>

            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id} className="border-b">

                    <td className="p-3">
                      <img
                        src={user.avatar || "https://via.placeholder.com/40"}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </td>

                    <td className="p-3 font-medium">
                      {user.username}
                    </td>

                    <td className="p-3 text-gray-600">
                      {user.email}
                    </td>

                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-sm ${
                        user.role === "admin"
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-600"
                      }`}>
                        {user.role}
                      </span>
                    </td>

                    <td className="p-3 text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center p-5 text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

        </div>
      )}
    </div>
  );
}