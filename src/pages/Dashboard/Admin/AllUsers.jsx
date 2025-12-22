import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loading from "../../../components/shared/Loading";

const AllUsers = () => {
  const axiosSecure = useAxiosSecure();
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch all users
  const {
    data: users = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["allUsers", statusFilter],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users?status=${statusFilter}`);
      return res.data;
    },
  });

  // Handle block/unblock
  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await axiosSecure.patch(`/users/status/${id}`, {
        status: newStatus,
      });

      if (res.data.modifiedCount > 0) {
        toast.success(
          `User ${newStatus === "active" ? "unblocked" : "blocked"}!`
        );
        refetch();
      }
    } catch (error) {
      toast.error("Failed to update status", error);
    }
  };

  // Handle role change
  const handleRoleChange = async (id, newRole) => {
    try {
      const res = await axiosSecure.patch(`/users/role/${id}`, {
        role: newRole,
      });

      if (res.data.modifiedCount > 0) {
        toast.success(`Role changed to ${newRole}!`);
        refetch();
      }
    } catch (error) {
      toast.error("Failed to change role", error);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">All Users</h1>

      {/* Filter */}
      <div className="mb-4">
        <label className="mr-2">Filter:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
        <span className="ml-4 text-gray-500">Total: {users.length} users</span>
      </div>

      {/* Users Table */}
      {users.length === 0 ? (
        <p className="text-gray-500">No users found.</p>
      ) : (
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Avatar</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user._id} className="border-t">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">
                    <img
                      src={user.avatar || "https://i.ibb.co/MgsTCcv/user.jpg"}
                      alt="avatar"
                      className="w-10 h-10 rounded-full"
                    />
                  </td>
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : user.role === "volunteer"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        user.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {/* Block/Unblock Button */}
                      {user.status === "active" ? (
                        <button
                          onClick={() =>
                            handleStatusChange(user._id, "blocked")
                          }
                          className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                        >
                          Block
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStatusChange(user._id, "active")}
                          className="bg-green-500 text-white px-2 py-1 rounded text-xs"
                        >
                          Unblock
                        </button>
                      )}

                      {/* Make Volunteer Button */}
                      {user.role === "donor" && (
                        <button
                          onClick={() =>
                            handleRoleChange(user._id, "volunteer")
                          }
                          className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                        >
                          Make Volunteer
                        </button>
                      )}

                      {/* Make Admin Button */}
                      {user.role !== "admin" && (
                        <button
                          onClick={() => handleRoleChange(user._id, "admin")}
                          className="bg-purple-500 text-white px-2 py-1 rounded text-xs"
                        >
                          Make Admin
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllUsers;
