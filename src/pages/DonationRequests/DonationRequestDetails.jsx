import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loading from "../../components/shared/Loading";

const DonationRequestDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch request data
  const {
    data: request,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["donationRequest", id],
    queryFn: async () => {
      const res = await axiosPublic.get(`/donation-requests/${id}`);
      return res.data;
    },
  });

  // Handle donate
  const handleDonate = async () => {
    setLoading(true);
    try {
      const res = await axiosSecure.patch(`/donation-requests/status/${id}`, {
        status: "inprogress",
        donorName: user.displayName,
        donorEmail: user.email,
      });

      if (res.data.modifiedCount > 0) {
        toast.success("Donation confirmed!");
        setShowModal(false);
        refetch();
      }
    } catch (error) {
      toast.error("Something went wrong!", error);
    }
    setLoading(false);
  };

  if (isLoading) return <Loading />;

  if (!request) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-bold">Request Not Found</h2>
        <Link to="/donation-requests" className="text-blue-500 underline">
          Go Back
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <title>Donation Request Details</title>
      {/* Back Button */}
      <Link to="/donation-requests" className="text-blue-500 underline">
        ← Back
      </Link>

      <h1 className="text-2xl font-bold mt-4 mb-2">Donation Request Details</h1>

      {/* Blood Group & Status */}
      <div className="flex gap-4 mb-4">
        <span className="bg-red-500 text-white px-4 py-2 rounded font-bold text-xl">
          {request.bloodGroup}
        </span>
        <span className="bg-gray-200 px-4 py-2 rounded capitalize">
          {request.status}
        </span>
      </div>

      {/* Details Table */}
      <table className="w-full border mb-6">
        <tbody>
          <tr className="border-b">
            <td className="p-2 font-semibold bg-gray-100">Recipient Name</td>
            <td className="p-2">{request.recipientName}</td>
          </tr>
          <tr className="border-b">
            <td className="p-2 font-semibold bg-gray-100">District</td>
            <td className="p-2">{request.recipientDistrict}</td>
          </tr>
          <tr className="border-b">
            <td className="p-2 font-semibold bg-gray-100">Upazila</td>
            <td className="p-2">{request.recipientUpazila}</td>
          </tr>
          <tr className="border-b">
            <td className="p-2 font-semibold bg-gray-100">Hospital</td>
            <td className="p-2">{request.hospitalName}</td>
          </tr>
          <tr className="border-b">
            <td className="p-2 font-semibold bg-gray-100">Address</td>
            <td className="p-2">{request.fullAddress}</td>
          </tr>
          <tr className="border-b">
            <td className="p-2 font-semibold bg-gray-100">Date</td>
            <td className="p-2">{request.donationDate}</td>
          </tr>
          <tr className="border-b">
            <td className="p-2 font-semibold bg-gray-100">Time</td>
            <td className="p-2">{request.donationTime}</td>
          </tr>
          <tr className="border-b">
            <td className="p-2 font-semibold bg-gray-100">Requester</td>
            <td className="p-2">{request.requesterName}</td>
          </tr>
          <tr className="border-b">
            <td className="p-2 font-semibold bg-gray-100">Requester Email</td>
            <td className="p-2">{request.requesterEmail}</td>
          </tr>
        </tbody>
      </table>

      {/* Message */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Message:</h3>
        <p className="bg-gray-100 p-3 rounded">
          {request.requestMessage || "No message"}
        </p>
      </div>

      {/* Donor Info */}
      {request.donorName && (
        <div className="mb-6 bg-green-100 p-3 rounded">
          <h3 className="font-semibold mb-1">Donor Info:</h3>
          <p>Name: {request.donorName}</p>
          <p>Email: {request.donorEmail}</p>
        </div>
      )}

      {/* Donate Button */}
      {request.status === "pending" &&
        request.requesterEmail !== user?.email && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
          >
            Donate
          </button>
        )}

      {/* Simple Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded max-w-sm w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Confirm Donation</h2>

            <p className="mb-4">Donating to: {request.recipientName}</p>

            <div className="mb-4">
              <label className="block mb-1">Your Name:</label>
              <input
                type="text"
                value={user?.displayName || ""}
                readOnly
                className="w-full border p-2 rounded bg-gray-100"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1">Your Email:</label>
              <input
                type="email"
                value={user?.email || ""}
                readOnly
                className="w-full border p-2 rounded bg-gray-100"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDonate}
                disabled={loading}
                className="flex-1 bg-red-500 text-white px-4 py-2 rounded"
              >
                {loading ? "Loading..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationRequestDetails;
