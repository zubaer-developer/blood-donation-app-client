import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loading from "../../../components/shared/Loading";
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaCheck,
  FaTimes,
  FaFilter,
  FaTint,
  FaUser,
} from "react-icons/fa";

const MyDonationRequests = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 5;

  // fetch data
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["myDonationRequests", user?.email, statusFilter, currentPage],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/donation-requests/my-requests/${user?.email}?status=${statusFilter}&page=${currentPage}&limit=${limit}`,
      );
      return res.data;
    },
    enabled: !!user?.email,
  });

  const requests = data?.donationRequests || [];
  const totalPages = data?.totalPages || 1;

  // update status
  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await axiosSecure.patch(`/donation-requests/status/${id}`, {
        status: newStatus,
      });

      if (res.data.modifiedCount > 0) {
        toast.success(`Status set to ${newStatus}`);
        refetch();
      }
    } catch (error) {
      toast.error("Update failed");
    }
  };

  // delete handler
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Confirm Delete?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#1a1c23",
      confirmButtonText: "Delete Request",
      background: "#1a1c23",
      color: "#fff",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.delete(`/donation-requests/${id}`);
          if (res.data.deletedCount > 0) {
            toast.success("Request removed");
            refetch();
          }
        } catch (error) {
          toast.error("Delete failed");
        }
      }
    });
  };

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-700">
      <title>My Requests | Dashboard</title>

      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#1a1c23] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic flex items-center gap-3">
            <span className="w-2 h-8 bg-red-500 rounded-full"></span>
            My Requests
          </h1>
          <p className="text-red-500/60 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">
            Manage your blood donation posts
          </p>
        </div>

        {/* Filter UI */}
        <div className="flex items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/5">
          <div className="pl-3 text-white/30">
            <FaFilter size={12} />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-transparent text-white text-xs font-black uppercase tracking-wider focus:outline-none pr-4 cursor-pointer"
          >
            <option className="bg-[#1a1c23]" value="all">
              All Status
            </option>
            <option className="bg-[#1a1c23]" value="pending">
              Pending
            </option>
            <option className="bg-[#1a1c23]" value="inprogress">
              In Progress
            </option>
            <option className="bg-[#1a1c23]" value="done">
              Done
            </option>
            <option className="bg-[#1a1c23]" value="canceled">
              Canceled
            </option>
          </select>
        </div>
      </div>

      {/* Main content */}
      {requests.length === 0 ? (
        <div className="bg-[#1a1c23] border border-white/5 p-20 rounded-[3rem] text-center shadow-xl">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaTint className="text-red-500 text-3xl opacity-20" />
          </div>
          <p className="text-white/40 uppercase font-black tracking-widest text-sm mb-6">
            No requests found
          </p>
          <Link
            to="/dashboard/create-donation-request"
            className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
          >
            Post New Request
          </Link>
        </div>
      ) : (
        <div className="bg-[#1a1c23] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="table w-full border-separate border-spacing-y-3 px-6">
              <thead>
                <tr className="text-white/20 border-none uppercase text-[10px] font-black tracking-[0.2em]">
                  <th className="bg-transparent">Recipient Info</th>
                  <th className="bg-transparent text-center">Group</th>
                  <th className="bg-transparent">Schedule</th>
                  <th className="bg-transparent">Status</th>
                  <th className="bg-transparent">Donor Info</th>
                  <th className="bg-transparent text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr
                    key={req._id}
                    className="bg-white/[0.02] hover:bg-white/[0.04] transition-all group"
                  >
                    {/* info */}
                    <td className="rounded-l-[1.5rem] py-5 px-6">
                      <p className="font-black text-white text-sm uppercase tracking-tight group-hover:text-red-500 transition-colors">
                        {req.recipientName}
                      </p>
                      <p className="text-[10px] text-white/30 font-bold uppercase mt-1 italic">
                        {req.recipientUpazila}, {req.recipientDistrict}
                      </p>
                    </td>

                    {/* blood group */}
                    <td className="text-center">
                      <span className="text-red-500 font-black text-xl italic tracking-tighter drop-shadow-[0_0_10px_rgba(239,68,68,0.3)]">
                        {req.bloodGroup}
                      </span>
                    </td>

                    {/* schedule */}
                    <td>
                      <p className="text-white/80 text-[11px] font-bold">
                        {req.donationDate}
                      </p>
                      <p className="text-[9px] text-red-500/50 uppercase font-black">
                        {req.donationTime}
                      </p>
                    </td>

                    {/* status badge */}
                    <td>
                      <span
                        className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                          req.status === "pending"
                            ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                            : req.status === "inprogress"
                              ? "bg-blue-400/10 text-blue-400 border-blue-400/20"
                              : req.status === "done"
                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                : "bg-red-500/10 text-red-500 border-red-500/20"
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>

                    {/* donor info */}
                    <td>
                      {req.status === "inprogress" && req.donorName ? (
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                            <FaUser size={10} />
                          </div>
                          <div className="text-[10px] leading-tight">
                            <p className="font-black text-white/80 uppercase tracking-tighter">
                              {req.donorName}
                            </p>
                            <p className="text-white/30 lowercase">
                              {req.donorEmail}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-white/5 text-[10px] font-black uppercase tracking-widest">
                          No Donor
                        </span>
                      )}
                    </td>

                    {/* action buttons */}
                    <td className="rounded-r-[1.5rem] text-right px-6">
                      <div className="flex justify-end gap-2">
                        {req.status === "inprogress" && (
                          <div className="flex gap-1.5 mr-2 pr-2 border-r border-white/5">
                            <button
                              onClick={() =>
                                handleStatusChange(req._id, "done")
                              }
                              className="w-7 h-7 flex items-center justify-center rounded-lg bg-emerald-500 text-white hover:scale-110 transition-transform"
                              title="Done"
                            >
                              <FaCheck size={10} />
                            </button>
                            <button
                              onClick={() =>
                                handleStatusChange(req._id, "canceled")
                              }
                              className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-500 text-white hover:scale-110 transition-transform"
                              title="Cancel"
                            >
                              <FaTimes size={10} />
                            </button>
                          </div>
                        )}
                        <Link
                          to={`/dashboard/edit-donation-request/${req._id}`}
                          className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all"
                        >
                          <FaEdit size={10} />
                        </Link>
                        <button
                          onClick={() => handleDelete(req._id)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                        >
                          <FaTrash size={10} />
                        </button>
                        <Link
                          to={`/donation-requests/${req._id}`}
                          className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 text-white/40 hover:text-red-500 transition-all"
                        >
                          <FaEye size={10} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination UI */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#1a1c23] border border-white/5 text-white disabled:opacity-20 hover:border-red-500 transition-all"
          >
            ❮
          </button>

          <div className="flex gap-2 bg-[#1a1c23] p-1.5 rounded-2xl border border-white/5">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all ${
                  currentPage === i + 1
                    ? "bg-red-500 text-white shadow-lg shadow-red-500/20"
                    : "text-white/40 hover:text-white"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#1a1c23] border border-white/5 text-white disabled:opacity-20 hover:border-red-500 transition-all"
          >
            ❯
          </button>
        </div>
      )}
    </div>
  );
};

export default MyDonationRequests;
