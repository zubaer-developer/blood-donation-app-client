import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAxiosPublic from "../hooks/useAxiosPublic";
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
  const { user, logOut } = useAuth();
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  // Get user role from database
  const { data: dbUser, isLoading } = useQuery({
    queryKey: ["userRole", user?.email],
    queryFn: async () => {
      const res = await axiosPublic.get(`/users/${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const userRole = dbUser?.role || "donor";

  // Handle logout
  const handleLogout = async () => {
    await logOut();
    navigate("/");
  };

  if (isLoading) return <Loading />;

  return (
    <div className="flex min-h-screen">
      {/* Mobile Menu */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-red-500 text-white p-2 rounded"
      >
        {sidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <div
        className={`
                fixed lg:static inset-y-0 left-0 z-40
                w-64 bg-gray-800 text-white
                transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                lg:translate-x-0 transition-transform
            `}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-700">
          <Link
            to="/"
            className="flex gap-1 items-center text-xl font-bold text-red-500"
          >
            <MdBloodtype className="text-3xl" /> BloodBank
          </Link>
          <p className="text-sm text-gray-400 mt-1 capitalize">
            {userRole} Dashboard
          </p>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            {/* Common Links */}
            <li>
              <Link
                to="/dashboard"
                className="flex gap-3 items-center  py-2 px-4 rounded hover:bg-gray-700"
                onClick={() => setSidebarOpen(false)}
              >
                <FaTachometerAlt />
                Dashboard Home
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/profile"
                className="flex gap-3 items-center py-2 px-4 rounded hover:bg-gray-700"
                onClick={() => setSidebarOpen(false)}
              >
                <FaUserCircle></FaUserCircle> Profile
              </Link>
            </li>

            {/* Donor Links */}
            {userRole === "donor" && (
              <>
                <li>
                  <Link
                    to="/dashboard/my-donation-requests"
                    className="flex gap-3 items-center py-2 px-4 rounded hover:bg-gray-700"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <FaListUl></FaListUl> My Donation Requests
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/create-donation-request"
                    className="flex gap-3 items-center py-2 px-4 rounded hover:bg-gray-700"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <FaPlusCircle></FaPlusCircle> Create Request
                  </Link>
                </li>
              </>
            )}

            {/* Admin Links */}
            {userRole === "admin" && (
              <>
                <li>
                  <Link
                    to="/dashboard/all-users"
                    className="flex gap-3 items-center py-2 px-4 rounded hover:bg-gray-700"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <FaUsers></FaUsers> All Users
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/all-blood-donation-request"
                    className="flex gap-3 items-center py-2 px-4 rounded hover:bg-gray-700"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <MdBloodtype className="text-red-500 text-xl" /> All
                    Donation Requests
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/content-management"
                    className="flex gap-3 items-center py-2 px-4 rounded hover:bg-gray-700"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <FaFileAlt></FaFileAlt> Content Management
                  </Link>
                </li>
              </>
            )}

            {/* Volunteer Links */}
            {userRole === "volunteer" && (
              <li>
                <Link
                  to="/dashboard/all-blood-donation-request"
                  className="flex gap-3 items-center py-2 px-4 rounded hover:bg-gray-700"
                  onClick={() => setSidebarOpen(false)}
                >
                  <MdBloodtype className="text-red-500 text-xl" /> All Donation
                  Requests
                </Link>
              </li>
            )}

            {/* Divider */}
            <li className="border-t border-gray-700 my-4"></li>

            {/* Back to Home */}
            <li>
              <Link
                to="/"
                className="flex gap-3 items-center py-2 px-4 rounded hover:bg-gray-700"
              >
                <FaHome></FaHome> Back to Home
              </Link>
            </li>

            {/* Logout */}
            <li>
              <button
                onClick={handleLogout}
                className="flex gap-3 items-center w-full text-left py-2 px-4 rounded hover:bg-red-600"
              >
                <FaSignOutAlt></FaSignOutAlt> Logout
              </button>
            </li>
          </ul>
        </nav>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
          <div className="flex items-center gap-3">
            <img
              src={user?.photoURL || "https://i.ibb.co/MgsTCcv/user.jpg"}
              alt="avatar"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="text-sm font-medium">{user?.displayName}</p>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-6 lg:p-8">
        <Outlet context={{ userRole, dbUser }} />
      </div>
    </div>
  );
};

export default DashboardLayout;
