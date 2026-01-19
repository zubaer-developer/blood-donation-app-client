import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loading from "../../../components/shared/Loading";
import {
  FaUserShield,
  FaUserEdit,
  FaBan,
  FaCheck,
  FaUsers,
  FaEnvelope,
  FaCircle,
} from "react-icons/fa";

const AllUsers = () => {
  const axiosSecure = useAxiosSecure();
  const [statusFilter, setStatusFilter] = useState("all");

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

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await axiosSecure.patch(`/users/status/${id}`, {
        status: newStatus,
      });
      if (res.data.modifiedCount > 0) {
        toast.success(
          `User ${newStatus === "active" ? "Activated" : "Blocked"}`,
          {
            style: {
              borderRadius: "15px",
              background: "#1a1c23",
              color: "#fff",
              border: "1px solid #ef4444",
            },
          },
        );
        refetch();
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      const res = await axiosSecure.patch(`/users/role/${id}`, {
        role: newRole,
      });
      if (res.data.modifiedCount > 0) {
        toast.success(`Role updated to ${newRole}`, {
          icon: "🚀",
          style: {
            borderRadius: "15px",
            background: "#1a1c23",
            color: "#fff",
            border: "1px solid #ef4444",
          },
        });
        refetch();
      }
    } catch (error) {
      toast.error("Failed to change role");
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-8 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-[#1a1c23] p-8 md:p-12 rounded-[3rem] border border-white/5 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 blur-[100px] rounded-full -mr-32 -mt-32"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-3 text-red-500 mb-2">
              <FaUsers
                size={28}
                className="drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]"
              />
              <span className="text-[10px] font-black uppercase tracking-[0.5em]">
                System Governance
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
              User <span className="text-red-500">Directory.</span>
            </h1>
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest">
              Authenticated Records:{" "}
              <span className="text-red-500">{users.length}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/5 p-2 rounded-[2rem] border border-white/10 backdrop-blur-md">
            <label className="pl-5 text-[10px] font-black uppercase text-white/30 tracking-[0.2em]">
              Filter
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="select select-ghost select-sm focus:bg-transparent text-white font-black uppercase text-[11px] border-none focus:outline-none"
            >
              <option value="all" className="bg-[#1a1c23]">
                All Access
              </option>
              <option value="active" className="bg-[#1a1c23]">
                Active Only
              </option>
              <option value="blocked" className="bg-[#1a1c23]">
                Restricted
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-[#1a1c23] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="table w-full border-separate border-spacing-y-0">
            <thead>
              <tr className="bg-white/[0.02] text-white/30 border-none uppercase text-[10px] tracking-[0.25em]">
                <th className="py-7 px-10">User Identity</th>
                <th>Role Designation</th>
                <th>Access Level</th>
                <th className="text-right px-10">Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-white/[0.01] transition-all duration-300 group"
                >
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-5">
                      <div className="relative">
                        <div className="w-14 h-14 rounded-[1.2rem] ring-2 ring-white/5 overflow-hidden group-hover:ring-red-500/50 transition-all shadow-2xl">
                          <img
                            src={
                              user.avatar || "https://i.ibb.co/MgsTCcv/user.jpg"
                            }
                            alt="avatar"
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <FaCircle
                          className={`absolute -bottom-1 -right-1 text-[12px] border-2 border-[#1a1c23] rounded-full ${user.status === "active" ? "text-emerald-500" : "text-red-500"}`}
                        />
                      </div>
                      <div>
                        <div className="font-black text-white text-sm group-hover:text-red-500 transition-colors uppercase tracking-tight">
                          {user.name}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-white/30 font-bold mt-0.5">
                          <FaEnvelope className="text-red-500/40" />{" "}
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all
                      ${
                        user.role === "admin"
                          ? "bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
                          : user.role === "volunteer"
                            ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                            : "bg-white/5 text-white/40 border-white/10"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <div
                      className={`text-[10px] font-black uppercase tracking-widest ${user.status === "active" ? "text-emerald-500" : "text-red-500/60"}`}
                    >
                      {user.status}
                    </div>
                  </td>
                  <td className="px-10">
                    <div className="flex justify-end gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                      {/* Toggle Status */}
                      <button
                        onClick={() =>
                          handleStatusChange(
                            user._id,
                            user.status === "active" ? "blocked" : "active",
                          )
                        }
                        className={`btn btn-square btn-sm rounded-xl border-none transition-all duration-300 ${
                          user.status === "active"
                            ? "bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white"
                            : "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white"
                        }`}
                        title={
                          user.status === "active"
                            ? "Restrict Access"
                            : "Grant Access"
                        }
                      >
                        {user.status === "active" ? (
                          <FaBan size={14} />
                        ) : (
                          <FaCheck size={14} />
                        )}
                      </button>

                      <div className="h-8 w-[1px] bg-white/5 mx-1"></div>

                      {/* Role Actions */}
                      {user.role === "donor" && (
                        <button
                          onClick={() =>
                            handleRoleChange(user._id, "volunteer")
                          }
                          className="btn btn-sm px-4 rounded-xl bg-blue-500/10 text-blue-400 border-none hover:bg-blue-500 hover:text-white font-black text-[9px] uppercase tracking-widest"
                        >
                          Volunteer
                        </button>
                      )}

                      {user.role !== "admin" && (
                        <button
                          onClick={() => handleRoleChange(user._id, "admin")}
                          className="btn btn-sm px-4 rounded-xl bg-red-500/10 text-red-500 border-none hover:bg-red-500 hover:text-white font-black text-[9px] uppercase tracking-widest shadow-lg shadow-red-500/5"
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
      </div>
    </div>
  );
};

export default AllUsers;
