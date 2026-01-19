import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loading from "../../../components/shared/Loading";
import { FaFilter, FaListUl, FaArrowLeft, FaArrowRight } from "react-icons/fa";

const VolunteerDonationRequests = () => {
  const axiosSecure = useAxiosSecure();
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 5;

  // fetch data with filter and pagination
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["volunteerDonationRequests", statusFilter, currentPage],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/donation-requests?status=${statusFilter}&page=${currentPage}&limit=${limit}`,
      );
      return res.data;
    },
  });

  const requests = data?.donationRequests || [];
  const totalPages = data?.totalPages || 1;

  // update status handler
  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await axiosSecure.patch(`/donation-requests/status/${id}`, {
        status: newStatus,
      });

      if (res.data.modifiedCount > 0) {
        toast.success(`Status updated to ${newStatus}`);
        refetch();
      }
    } catch (error) {
      toast.error("Status update failed");
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-700">
      <title>All Donation Requests | Volunteer</title>

      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#1a1c23] p-8 rounded-[2rem] border border-white/5 shadow-xl">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase italic flex items-center gap-3">
            <span className="w-2 h-8 bg-red-500 rounded-full"></span>
            Donation Requests
          </h1>
          <p className="text-red-500/80 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">
            Volunteer Access: Status Management Only
          </p>
        </div>

        {/* filter UI */}
        <div className="flex items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/5">
          <div className="pl-3 text-white/40">
            <FaFilter size={14} />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-transparent text-white text-xs font-bold focus:outline-none pr-4 cursor-pointer"
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

      {/* Requests table container */}
      <div className="bg-[#1a1c23] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
        {requests.length === 0 ? (
          <div className="p-20 text-center">
            <FaListUl className="mx-auto text-white/10 mb-4" size={50} />
            <p className="text-white/30 uppercase font-black tracking-widest text-sm">
              No requests found
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full border-separate border-spacing-y-3 px-6">
              <thead>
                <tr className="text-white/20 border-none uppercase text-[10px] font-black tracking-[0.2em]">
                  <th className="bg-transparent">Recipient & Location</th>
                  <th className="bg-transparent">Requester</th>
                  <th className="bg-transparent">Date & Time</th>
                  <th className="bg-transparent text-center">Group</th>
                  <th className="bg-transparent">Status</th>
                  <th className="bg-transparent text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr
                    key={req._id}
                    className="bg-white/[0.02] hover:bg-white/[0.05] transition-all group"
                  >
                    {/* info col */}
                    <td className="rounded-l-[1.5rem] py-5 px-6">
                      <p className="font-black text-white text-sm uppercase tracking-tight group-hover:text-red-500 transition-colors">
                        {req.recipientName}
                      </p>
                      <p className="text-[10px] text-white/30 font-bold uppercase mt-1 italic">
                        {req.recipientUpazila}, {req.recipientDistrict}
                      </p>
                    </td>

                    {/* requester col */}
                    <td>
                      <p className="text-white/80 font-bold text-xs">
                        {req.requesterName}
                      </p>
                      <p className="text-[10px] text-white/30">
                        {req.requesterEmail}
                      </p>
                    </td>

                    {/* schedule col */}
                    <td>
                      <p className="text-white/80 text-xs font-bold">
                        {req.donationDate}
                      </p>
                      <p className="text-[10px] text-red-500/50 uppercase font-black">
                        {req.donationTime}
                      </p>
                    </td>

                    {/* blood group */}
                    <td className="text-center">
                      <span className="text-red-500 font-black text-lg italic tracking-tighter drop-shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                        {req.bloodGroup}
                      </span>
                    </td>

                    {/* status badge */}
                    <td>
                      <span
                        className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
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

                    {/* buttons */}
                    <td className="rounded-r-[1.5rem] text-right px-6">
                      {req.status === "inprogress" ? (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleStatusChange(req._id, "done")}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all"
                          >
                            Done
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(req._id, "canceled")
                            }
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <span className="text-white/10 text-[10px] font-black uppercase tracking-[0.2em]">
                          Locked
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination UI */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 pt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#1a1c23] border border-white/5 text-white disabled:opacity-20 hover:border-red-500 transition-all"
          >
            <FaArrowLeft size={12} />
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
            <FaArrowRight size={12} />
          </button>
        </div>
      )}
    </div>
  );
};

export default VolunteerDonationRequests;
