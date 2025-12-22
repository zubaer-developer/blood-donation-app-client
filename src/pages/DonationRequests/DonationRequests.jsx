import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import Loading from "../../components/shared/Loading";

const DonationRequests = () => {
  const axiosPublic = useAxiosPublic();

  // Fetch pending donation requests
  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["pendingDonationRequests"],
    queryFn: async () => {
      const response = await axiosPublic.get("/donation-requests/pending");
      return response.data;
    },
  });

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Blood Donation Requests
          </h1>
          <p className="text-gray-600 mt-2">People who need blood urgently</p>
        </div>

        {/* Requests Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Total Pending Requests:{" "}
            <span className="font-bold text-primary">{requests.length}</span>
          </p>
        </div>

        {/* No Requests */}
        {requests.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow">
            <p className="text-6xl mb-4">🩸</p>
            <h3 className="text-xl font-semibold text-gray-700">
              No Pending Requests
            </h3>
            <p className="text-gray-500 mt-2">Check back later</p>
          </div>
        ) : (
          /* Requests Table */
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="py-3 px-4 text-left">Recipient Name</th>
                    <th className="py-3 px-4 text-left">Location</th>
                    <th className="py-3 px-4 text-center">Blood Group</th>
                    <th className="py-3 px-4 text-left">Date</th>
                    <th className="py-3 px-4 text-left">Time</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {requests.map((request) => (
                    <tr key={request._id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">{request.recipientName}</td>
                      <td className="py-3 px-4">
                        {request.recipientUpazila}, {request.recipientDistrict}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="bg-red-100 text-red-600 font-bold px-3 py-1 rounded">
                          {request.bloodGroup}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {formatDate(request.donationDate)}
                      </td>
                      <td className="py-3 px-4">{request.donationTime}</td>
                      <td className="py-3 px-4 text-center">
                        <Link
                          to={`/donation-requests/${request._id}`}
                          className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition-colors"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Create Request Link */}
        <div className="text-center mt-8">
          <p className="text-gray-600 mb-4">
            Need blood? Create a donation request
          </p>
          <Link
            to="/dashboard/create-donation-request"
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition-colors"
          >
            Create Donation Request
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DonationRequests;
