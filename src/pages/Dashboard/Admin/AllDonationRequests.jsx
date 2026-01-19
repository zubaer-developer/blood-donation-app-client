import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loading from "../../../components/shared/Loading";
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaTint,
} from "react-icons/fa";

const AllDonationRequests = () => {
  const axiosSecure = useAxiosSecure();
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 5;

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["allDonationRequests", statusFilter, currentPage],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/donation-requests?status=${statusFilter}&page=${currentPage}&limit=${limit}`,
      );
      return res.data;
    },
  });

  const requests = data?.donationRequests || [];
  const totalPages = data?.totalPages || 1;

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await axiosSecure.patch(`/donation-requests/status/${id}`, {
        status: newStatus,
      });
      if (res.data.modifiedCount > 0) {
        toast.success(`Request marked as ${newStatus}`, {
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
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action will permanently delete the request.",
      icon: "warning",
      showCancelButton: true,
      background: "#1a1c23",
      color: "#fff",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#3f3f46",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.delete(`/donation-requests/${id}`);
          if (res.data.deletedCount > 0) {
            toast.success("Request Deleted Successfully");
            refetch();
          }
        } catch (error) {
          toast.error("Failed to delete request");
        }
      }
    });
  };

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-500">
      {/* Header Card */}
      <div className="bg-[#1a1c23] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-3xl rounded-full -mr-16 -mt-16"></div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-black text-white tracking-tight uppercase">
              Donation <span className="text-red-500">Requests</span>
            </h1>
            <p className="text-white/40 text-[10px] font-black tracking-[0.2em] mt-1 uppercase">
              Database Records:{" "}
              <span className="text-red-500">{data?.total || 0}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/10">
            <span className="pl-4 text-[10px] font-black uppercase text-white/30 tracking-widest">
              Filter By
            </span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="select select-ghost select-sm text-white font-bold focus:bg-transparent border-none focus:outline-none"
            >
              <option value="all" className="bg-[#1a1c23]">
                All Requests
              </option>
              <option value="pending" className="bg-[#1a1c23]">
                Pending
              </option>
              <option value="inprogress" className="bg-[#1a1c23]">
                In Progress
              </option>
              <option value="done" className="bg-[#1a1c23]">
                Done
              </option>
              <option value="canceled" className="bg-[#1a1c23]">
                Canceled
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-[#1a1c23] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
        {requests.length === 0 ? (
          <div className="py-24 text-center">
            <FaTint className="mx-auto text-red-500/20 text-6xl mb-4 animate-pulse" />
            <p className="text-white/20 font-black uppercase tracking-widest text-sm">
              Empty Records Found
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full border-separate border-spacing-y-0">
              <thead className="bg-white/[0.02]">
                <tr className="text-white/30 border-none uppercase text-[10px] tracking-[0.2em]">
                  <th className="py-6 pl-8">Recipient</th>
                  <th>Location</th>
                  <th>Schedule</th>
                  <th>Status</th>
                  <th className="text-right pr-8">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {requests.map((req) => (
                  <tr
                    key={req._id}
                    className="hover:bg-white/[0.01] transition-colors group"
                  >
                    <td className="pl-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 font-black text-sm shadow-lg shadow-red-500/5">
                          {req.bloodGroup}
                        </div>
                        <div>
                          <div className="font-bold text-white group-hover:text-red-500 transition-colors uppercase text-sm tracking-tight">
                            {req.recipientName}
                          </div>
                          <div className="text-[10px] text-white/30 font-medium uppercase tracking-tighter">
                            By: {req.requesterName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="text-white/50 text-xs font-medium">
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-red-500/40" />
                        <span>{req.recipientUpazila}</span>
                      </div>
                    </td>
                    <td className="text-white/50 text-xs font-bold">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-red-500/40" />
                        <span>{req.donationDate}</span>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border
                        ${
                          req.status === "pending"
                            ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                            : req.status === "inprogress"
                              ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                              : req.status === "done"
                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                : "bg-red-500/10 text-red-500 border-red-500/20"
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="pr-8">
                      <div className="flex justify-end gap-2">
                        {req.status === "inprogress" && (
                          <>
                            <button
                              onClick={() =>
                                handleStatusChange(req._id, "done")
                              }
                              className="btn btn-square btn-xs rounded-lg bg-emerald-500/10 text-emerald-500 border-none hover:bg-emerald-500 hover:text-white transition-all"
                            >
                              <FaCheckCircle size={12} />
                            </button>
                            <button
                              onClick={() =>
                                handleStatusChange(req._id, "canceled")
                              }
                              className="btn btn-square btn-xs rounded-lg bg-orange-500/10 text-orange-500 border-none hover:bg-orange-500 hover:text-white transition-all"
                            >
                              <FaTimesCircle size={12} />
                            </button>
                          </>
                        )}
                        <Link
                          to={`/dashboard/edit-donation-request/${req._id}`}
                          className="btn btn-square btn-xs rounded-lg bg-blue-500/10 text-blue-500 border-none hover:bg-blue-500 hover:text-white transition-all"
                        >
                          <FaEdit size={12} />
                        </Link>
                        <button
                          onClick={() => handleDelete(req._id)}
                          className="btn btn-square btn-xs rounded-lg bg-red-500/10 text-red-500 border-none hover:bg-red-500 hover:text-white transition-all"
                        >
                          <FaTrash size={12} />
                        </button>
                        <Link
                          to={`/donation-requests/${req._id}`}
                          className="btn btn-square btn-xs rounded-lg bg-white/5 text-white/40 border-none hover:bg-white/10 transition-all"
                        >
                          <FaEye size={12} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-12">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="btn btn-sm px-6 rounded-xl bg-[#1a1c23] border-white/5 text-white/50 hover:text-red-500 disabled:opacity-20 font-black uppercase text-[10px] tracking-widest"
          >
            Prev
          </button>

          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-9 h-9 rounded-xl text-xs font-black transition-all border ${
                  currentPage === i + 1
                    ? "bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/20 scale-110"
                    : "bg-[#1a1c23] border-white/5 text-white/30 hover:border-red-500/50 hover:text-white"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="btn btn-sm px-6 rounded-xl bg-[#1a1c23] border-white/5 text-white/50 hover:text-red-500 disabled:opacity-20 font-black uppercase text-[10px] tracking-widest"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AllDonationRequests;
