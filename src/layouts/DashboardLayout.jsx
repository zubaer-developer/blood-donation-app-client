import { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Loading from "../components/shared/Loading";
import {
  FaBars,
  FaFileAlt,
  FaHome,
  FaListUl,
  FaPlusCircle,
  FaSignOutAlt,
  FaTachometerAlt,
  FaTimes,
  FaUserCircle,
  FaUsers,
} from "react-icons/fa";
import { MdBloodtype } from "react-icons/md";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logOut, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const location = useLocation();

  // fetch role logic
  const { data: dbUser, isLoading } = useQuery({
    queryKey: ["userRole", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email && !authLoading,
  });

  const userRole = dbUser?.role || "donor";

  const handleLogout = async () => {
    await logOut();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  if (authLoading || isLoading) return <Loading />;

  return (
    <div className="flex min-h-screen bg-base-100 selection:bg-red-500/20">
      {/* mobile toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-5 right-5 z-[70] btn btn-ghost bg-base-200 btn-circle shadow-xl border border-base-300"
      >
        {sidebarOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
      </button>

      {/* sidebar container */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-72 bg-base-100 border-r border-base-200
          transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 transition-all duration-300 ease-in-out
          flex flex-col
        `}
      >
        {/* updated branding per instruction */}
        <div className="p-8">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-primary p-2 rounded-2xl group-hover:rotate-12 transition-transform duration-300">
              <MdBloodtype className="text-2xl text-red-500" />
            </div>
            <span className="text-xl font-black tracking-tight">
              Blood<span className="text-red-500">Bank</span>
            </span>
          </Link>

          <div className="mt-6 flex items-center gap-2 px-1">
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">
              {userRole} Portal
            </span>
          </div>
        </div>

        {/* nav links */}
        <nav className="flex-1 overflow-y-auto px-4 space-y-8 custom-scrollbar">
          {/* main section */}
          <div>
            <p className="text-[10px] font-black opacity-30 uppercase tracking-[0.2em] mb-4 ml-4">
              Overview
            </p>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/dashboard"
                  className={`flex gap-3 items-center py-3.5 px-5 rounded-2xl transition-all font-bold text-sm ${
                    isActive("/dashboard")
                      ? "bg-red-500 text-white shadow-lg shadow-red-500/20"
                      : "hover:bg-base-200 opacity-70 hover:opacity-100"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <FaTachometerAlt /> Statistics
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/profile"
                  className={`flex gap-3 items-center py-3.5 px-5 rounded-2xl transition-all font-bold text-sm ${
                    isActive("/dashboard/profile")
                      ? "bg-red-500 text-white shadow-lg shadow-red-500/20"
                      : "hover:bg-base-200 opacity-70 hover:opacity-100"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <FaUserCircle /> My Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* management section */}
          <div>
            <p className="text-[10px] font-black opacity-30 uppercase tracking-[0.2em] mb-4 ml-4">
              Management
            </p>
            <ul className="space-y-2">
              {userRole === "donor" && (
                <>
                  <li>
                    <Link
                      to="/dashboard/my-donation-requests"
                      className={`flex gap-3 items-center py-3.5 px-5 rounded-2xl transition-all font-bold text-sm ${isActive("/dashboard/my-donation-requests") ? "bg-red-500 text-white shadow-md shadow-red-500/20" : "hover:bg-base-200 opacity-70"}`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <FaListUl /> My Requests
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard/create-donation-request"
                      className={`flex gap-3 items-center py-3.5 px-5 rounded-2xl transition-all font-bold text-sm ${isActive("/dashboard/create-donation-request") ? "bg-red-500 text-white shadow-md shadow-red-500/20" : "hover:bg-base-200 opacity-70"}`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <FaPlusCircle /> Create Request
                    </Link>
                  </li>
                </>
              )}

              {userRole === "admin" && (
                <>
                  <li>
                    <Link
                      to="/dashboard/all-users"
                      className={`flex gap-3 items-center py-3.5 px-5 rounded-2xl transition-all font-bold text-sm ${isActive("/dashboard/all-users") ? "bg-red-500 text-white" : "hover:bg-base-200 opacity-70"}`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <FaUsers /> All Users
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard/all-blood-donation-request"
                      className={`flex gap-3 items-center py-3.5 px-5 rounded-2xl transition-all font-bold text-sm ${isActive("/dashboard/all-blood-donation-request") ? "bg-red-500 text-white" : "hover:bg-base-200 opacity-70"}`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <MdBloodtype className="text-xl" /> Donation Requests
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard/content-management"
                      className={`flex gap-3 items-center py-3.5 px-5 rounded-2xl transition-all font-bold text-sm ${isActive("/dashboard/content-management") ? "bg-red-500 text-white" : "hover:bg-base-200 opacity-70"}`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <FaFileAlt /> Content Manager
                    </Link>
                  </li>
                </>
              )}

              {userRole === "volunteer" && (
                <li>
                  <Link
                    to="/dashboard/volunteer/all-blood-donation-request"
                    className={`flex gap-3 items-center py-3.5 px-5 rounded-2xl transition-all font-bold text-sm ${isActive("/dashboard/volunteer/all-blood-donation-request") ? "bg-red-500 text-white" : "hover:bg-base-200 opacity-70"}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <MdBloodtype className="text-xl" /> Donation Requests
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* system section */}
          <div>
            <p className="text-[10px] font-black opacity-30 uppercase tracking-[0.2em] mb-4 ml-4">
              System
            </p>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="flex gap-3 items-center py-3.5 px-5 rounded-2xl hover:bg-base-200 opacity-70 transition-all font-bold text-sm"
                >
                  <FaHome /> Back to Home
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="flex gap-3 items-center w-full text-left py-3.5 px-5 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-black text-sm"
                >
                  <FaSignOutAlt /> Logout
                </button>
              </li>
            </ul>
          </div>
        </nav>

        {/* profile footer card */}
        <div className="p-4 mt-auto">
          <div className="bg-base-200 p-4 rounded-[2rem] border border-base-300">
            <div className="flex items-center gap-3">
              <div className="avatar">
                <div className="w-12 h-12 rounded-2xl ring-2 ring-red-500/20 ring-offset-2 ring-offset-base-100">
                  <img
                    src={user?.photoURL || "https://i.ibb.co/MgsTCcv/user.jpg"}
                    alt="avatar"
                  />
                </div>
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-black truncate">
                  {user?.displayName}
                </p>
                <p className="text-[9px] opacity-50 truncate font-bold uppercase tracking-wider">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-base-content/20 backdrop-blur-md z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-12 max-w-7xl mx-auto">
          <Outlet context={{ userRole, dbUser }} />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
