import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loading from "../../../components/shared/Loading";

const AllDonationRequests = () => {
  const axiosSecure = useAxiosSecure();

  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 5;

  // Fetch all donation requests
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["allDonationRequests", statusFilter, currentPage],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/donation-requests?status=${statusFilter}&page=${currentPage}&limit=${limit}`
      );
      return res.data;
    },
  });

  const requests = data?.donationRequests || [];
  const totalPages = data?.totalPages || 1;

  // Handle status change
  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await axiosSecure.patch(`/donation-requests/status/${id}`, {
        status: newStatus,
      });

      if (res.data.modifiedCount > 0) {
        toast.success(`Status changed to ${newStatus}`);
        refetch();
      }
    } catch (error) {
      toast.error("Failed to update status", error);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Delete this request?",
      text: "This cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.delete(`/donation-requests/${id}`);
          if (res.data.deletedCount > 0) {
            toast.success("Deleted!");
            refetch();
          }
        } catch (error) {
          toast.error("Failed to delete", error);
        }
      }
    });
  };

  if (isLoading) return <Loading />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">All Blood Donation Requests</h1>

      {/* Filter */}
      <div className="mb-4">
        <label className="mr-2">Filter:</label>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="border p-2 rounded"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="inprogress">In Progress</option>
          <option value="done">Done</option>
          <option value="canceled">Canceled</option>
        </select>
        <span className="ml-4 text-gray-500">
          Total: {data?.total || 0} requests
        </span>
      </div>

      {/* Table */}
      {requests.length === 0 ? (
        <p className="text-gray-500">No requests found.</p>
      ) : (
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Recipient</th>
                <th className="p-3 text-left">Requester</th>
                <th className="p-3 text-left">Location</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Blood</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Donor</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req._id} className="border-t">
                  <td className="p-3">{req.recipientName}</td>
                  <td className="p-3">
                    <div>
                      <p>{req.requesterName}</p>
                      <p className="text-xs text-gray-500">
                        {req.requesterEmail}
                      </p>
                    </div>
                  </td>
                  <td className="p-3">
                    {req.recipientUpazila}, {req.recipientDistrict}
                  </td>
                  <td className="p-3">
                    <div>
                      <p>{req.donationDate}</p>
                      <p className="text-xs text-gray-500">
                        {req.donationTime}
                      </p>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded font-bold">
                      {req.bloodGroup}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        req.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : req.status === "inprogress"
                          ? "bg-blue-100 text-blue-700"
                          : req.status === "done"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="p-3">
                    {req.donorName ? (
                      <div className="text-xs">
                        <p>{req.donorName}</p>
                        <p className="text-gray-500">{req.donorEmail}</p>
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {/* Status Buttons */}
                      {req.status === "inprogress" && (
                        <>
                          <button
                            onClick={() => handleStatusChange(req._id, "done")}
                            className="bg-green-500 text-white px-2 py-1 rounded text-xs"
                          >
                            Done
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(req._id, "canceled")
                            }
                            className="bg-orange-500 text-white px-2 py-1 rounded text-xs"
                          >
                            Cancel
                          </button>
                        </>
                      )}

                      <Link
                        to={`/dashboard/edit-donation-request/${req._id}`}
                        className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => handleDelete(req._id)}
                        className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                      >
                        Delete
                      </button>

                      <Link
                        to={`/donation-requests/${req._id}`}
                        className="bg-gray-500 text-white px-2 py-1 rounded text-xs"
                      >
                        View
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1 ? "bg-red-500 text-white" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AllDonationRequests;
