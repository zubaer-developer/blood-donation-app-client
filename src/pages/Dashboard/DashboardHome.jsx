import { Link, useOutletContext } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loading from "../../components/shared/Loading";
import { FaUsers, FaTint, FaDollarSign, FaArrowRight } from "react-icons/fa";
import { MdBloodtype } from "react-icons/md";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const DashboardHome = () => {
  const { user } = useAuth();
  const { userRole } = useOutletContext();
  const axiosSecure = useAxiosSecure();

  // donor recent requests
  const { data: recentRequests = [], isLoading: loadingRequests } = useQuery({
    queryKey: ["recentRequests", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/donation-requests/recent/${user?.email}`,
      );
      return res.data;
    },
    enabled: userRole === "donor",
  });

  // admin stats
  const { data: stats = {}, isLoading: loadingStats } = useQuery({
    queryKey: ["statistics"],
    queryFn: async () => {
      const res = await axiosSecure.get("/statistics");
      return res.data;
    },
    enabled: userRole === "admin" || userRole === "volunteer",
  });

  if (loadingRequests || loadingStats) return <Loading />;

  // chart values
  const chartData = [
    { name: "Donors", value: stats.totalUsers || 0, color: "#EF4444" },
    {
      name: "Requests",
      value: stats.totalDonationRequests || 0,
      color: "#DC2626",
    },
    { name: "Funds", value: stats.totalFunds || 0, color: "#B91C1C" },
  ];

  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-700">
      {/* welcome */}
      <div className="relative overflow-hidden bg-neutral rounded-3xl p-8 md:p-12 border border-white/5 shadow-2xl">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-red-500">
              Live Dashboard
            </span>
          </div>

          <h1 className="text-4xl font-black text-white tracking-tight">
            Welcome, <span className="text-red-500">{user?.displayName}</span>
          </h1>
          <p className="text-white/60 mt-4 text-lg max-w-xl font-medium">
            You are logged in as{" "}
            <span className="text-red-400 capitalize">{userRole}</span>. Monitor
            your activities and statistics below.
          </p>
        </div>

        <MdBloodtype className="absolute -bottom-10 -right-10 text-[250px] text-white/5 -rotate-12" />
      </div>

      {/* stats */}
      {(userRole === "admin" || userRole === "volunteer") && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              label: "Total Donors",
              value: stats.totalUsers,
              icon: FaUsers,
              color: "text-red-400",
              bg: "bg-red-500/10",
            },
            {
              label: "Requests",
              value: stats.totalDonationRequests,
              icon: FaTint,
              color: "text-red-500",
              bg: "bg-red-500/10",
            },
            {
              label: "Total Funds",
              value: `$${stats.totalFunds}`,
              icon: FaDollarSign,
              color: "text-red-600",
              bg: "bg-red-600/10",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-neutral border border-white/10 p-8 rounded-3xl hover:border-red-500/50 transition-all group"
            >
              <div className="flex justify-between items-start">
                <div className={`${item.bg} ${item.color} p-4 rounded-2xl`}>
                  <item.icon size={24} />
                </div>
                <div className="text-right">
                  <p className="text-4xl font-black text-white">
                    {item.value || 0}
                  </p>
                  <p className="text-white/40 text-xs font-bold uppercase tracking-widest mt-1">
                    {item.label}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* content */}
      <div className="bg-neutral border border-white/10 rounded-[2.5rem] p-6 md:p-10">
        <div className="flex justify-between items-center mb-10">
          <h3 className="text-white font-bold text-xl flex items-center gap-3">
            <span className="w-2 h-8 bg-red-500 rounded-full"></span>
            {userRole === "donor" ? "My Recent Requests" : "System Analytics"}
          </h3>

          {userRole === "donor" && (
            <Link
              to="/dashboard/my-donation-requests"
              className="btn btn-sm btn-outline border-white/10 text-white hover:bg-red-500 hover:border-red-500"
            >
              View All <FaArrowRight />
            </Link>
          )}
        </div>

        {userRole === "donor" ? (
          // donor table
          <div className="overflow-x-auto">
            <table className="table w-full border-separate border-spacing-y-3">
              <thead>
                <tr className="text-white/30 uppercase text-[11px] tracking-widest">
                  <th className="bg-transparent px-6">Recipient</th>
                  <th className="bg-transparent">Blood Group</th>
                  <th className="bg-transparent">Status</th>
                  <th className="bg-transparent text-right px-6">Action</th>
                </tr>
              </thead>

              <tbody>
                {recentRequests.slice(0, 3).map((req) => (
                  <tr
                    key={req._id}
                    className="bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
                  >
                    <td className="rounded-l-2xl px-6 py-5">
                      <p className="font-bold text-white">
                        {req.recipientName}
                      </p>
                      <p className="text-xs text-white/40">
                        {req.recipientDistrict}, {req.recipientUpazila}
                      </p>
                    </td>

                    <td className="font-bold text-red-500">{req.bloodGroup}</td>

                    <td>
                      <span
                        className={`badge badge-sm font-bold ${
                          req.status === "inprogress"
                            ? "badge-error"
                            : "badge-ghost text-white/50"
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>

                    <td className="rounded-r-2xl text-right px-6">
                      <Link
                        to={`/donation-details/${req._id}`}
                        className="text-white/20 hover:text-red-500 font-bold text-xs uppercase"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          // analytics chart
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="rgba(255,255,255,0.05)"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "rgba(255,255,255,0.4)",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.05)" }}
                  contentStyle={{
                    backgroundColor: "#171717",
                    borderRadius: "16px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="value" radius={[10, 10, 10, 10]} barSize={60}>
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;
