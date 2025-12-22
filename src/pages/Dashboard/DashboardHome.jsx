import { Link, useOutletContext } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loading from "../../components/shared/Loading";

const DashboardHome = () => {
  const { user } = useAuth();
  const { userRole } = useOutletContext();
  const axiosSecure = useAxiosSecure();

  // Donor
  const { data: recentRequests = [], isLoading: loadingRequests } = useQuery({
    queryKey: ["recentRequests", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/donation-requests/recent/${user?.email}`
      );
      return res.data;
    },
    enabled: userRole === "donor",
  });

  // Admin/Volunteer
  const { data: stats = {}, isLoading: loadingStats } = useQuery({
    queryKey: ["statistics"],
    queryFn: async () => {
      const res = await axiosSecure.get("/statistics");
      return res.data;
    },
    enabled: userRole === "admin" || userRole === "volunteer",
  });

  if (loadingRequests || loadingStats) return <Loading />;

  return (
    <div>
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h1 className="text-2xl font-bold">Welcome, {user?.displayName}!</h1>
        <p className="text-gray-500 mt-1">
          You are logged in as{" "}
          <span className="capitalize font-medium">{userRole}</span>
        </p>
      </div>

      {/* Donor Dashboard */}
      {userRole === "donor" && (
        <div>
          <h2 className="text-xl font-bold mb-4">
            Your Recent Donation Requests
          </h2>

          {recentRequests.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-gray-500 mb-4">
                You haven't created any donation requests yet.
              </p>
              <Link
                to="/dashboard/create-donation-request"
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Create Your First Request
              </Link>
            </div>
          ) : (
            <>
              {/* Requests Table */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-left p-3">Recipient</th>
                      <th className="text-left p-3">Location</th>
                      <th className="text-left p-3">Date</th>
                      <th className="text-left p-3">Blood</th>
                      <th className="text-left p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentRequests.map((req) => (
                      <tr key={req._id} className="border-t">
                        <td className="p-3">{req.recipientName}</td>
                        <td className="p-3">{req.recipientDistrict}</td>
                        <td className="p-3">{req.donationDate}</td>
                        <td className="p-3">
                          <span className="bg-red-100 text-red-600 px-2 py-1 rounded">
                            {req.bloodGroup}
                          </span>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-1 rounded text-sm ${
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* View All Link */}
              <div className="text-center mt-4">
                <Link
                  to="/dashboard/my-donation-requests"
                  className="text-blue-500 hover:underline"
                >
                  View All My Requests →
                </Link>
              </div>
            </>
          )}
        </div>
      )}

      {/* Admin & Volunteer Dashboard */}
      {(userRole === "admin" || userRole === "volunteer") && (
        <div>
          <h2 className="text-xl font-bold mb-4">Statistics</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Users */}
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-4xl font-bold text-blue-500">
                {stats.totalUsers || 0}
              </p>
              <p className="text-gray-500 mt-2">Total Donors</p>
            </div>

            {/* Total Requests */}
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-4xl font-bold text-red-500">
                {stats.totalDonationRequests || 0}
              </p>
              <p className="text-gray-500 mt-2">Total Donation Requests</p>
            </div>

            {/* Total Funding */}
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-4xl font-bold text-green-500">
                ${stats.totalFunds || 0}
              </p>
              <p className="text-gray-500 mt-2">Total Funding</p>
            </div>
          </div>

          {/* Quick Links for Admin */}
          {userRole === "admin" && (
            <div className="mt-6">
              <h3 className="text-lg font-bold mb-3">Quick Actions</h3>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/dashboard/all-users"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Manage Users
                </Link>
                <Link
                  to="/dashboard/all-blood-donation-request"
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Manage Requests
                </Link>
                <Link
                  to="/dashboard/content-management"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Manage Content
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
