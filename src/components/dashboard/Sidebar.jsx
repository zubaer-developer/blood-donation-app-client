import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { MdBloodtype, MdDashboard, MdPeople, MdArticle } from "react-icons/md";
import {
  FaUser,
  FaHandHoldingHeart,
  FaList,
  FaPlus,
  FaBars,
  FaTimes,
  FaHome,
} from "react-icons/fa";
import { BiDonateBlood } from "react-icons/bi";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // userRole will get from database  ("admin", "volunteer", "donor")
  const userRole = "donor"; // This is temporary role

  const donorLinks = [
    { path: "/dashboard", icon: <MdDashboard />, label: "Dashboard Home" },
    { path: "/dashboard/profile", icon: <FaUser />, label: "Profile" },
    {
      path: "/dashboard/my-donation-requests",
      icon: <FaList />,
      label: "My Donation Requests",
    },
    {
      path: "/dashboard/create-donation-request",
      icon: <FaPlus />,
      label: "Create Request",
    },
  ];

  const adminLinks = [
    { path: "/dashboard", icon: <MdDashboard />, label: "Dashboard Home" },
    { path: "/dashboard/profile", icon: <FaUser />, label: "Profile" },
    { path: "/dashboard/all-users", icon: <MdPeople />, label: "All Users" },
    {
      path: "/dashboard/all-blood-donation-request",
      icon: <BiDonateBlood />,
      label: "All Donation Requests",
    },
    {
      path: "/dashboard/content-management",
      icon: <MdArticle />,
      label: "Content Management",
    },
  ];

  const volunteerLinks = [
    { path: "/dashboard", icon: <MdDashboard />, label: "Dashboard Home" },
    { path: "/dashboard/profile", icon: <FaUser />, label: "Profile" },
    {
      path: "/dashboard/all-blood-donation-request",
      icon: <BiDonateBlood />,
      label: "All Donation Requests",
    },
  ];

  // Select links based on role
  const getLinks = () => {
    switch (userRole) {
      case "admin":
        return adminLinks;
      case "volunteer":
        return volunteerLinks;
      default:
        return donorLinks;
    }
  };

  const links = getLinks();

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-primary text-white rounded-lg shadow-lg"
      >
        {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-neutral text-white transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-700">
            <Link to="/" className="flex items-center space-x-2">
              <MdBloodtype className="text-red-600 text-3xl" />
              <span className="text-xl font-bold">
                Blood<span className="text-red-600">Bank</span>
              </span>
            </Link>
            <p className="text-xs text-gray-400 mt-2 capitalize">
              {userRole} Dashboard
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === "/dashboard"}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-gray-400 hover:bg-gray-700 hover:text-white"
                  }`
                }
              >
                <span className="text-xl">{link.icon}</span>
                <span className="text-sm font-medium">{link.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Divider */}
          <div className="border-t border-gray-700 mx-4"></div>

          {/* Back to Home */}
          <div className="p-4">
            <Link
              to="/"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white transition-colors duration-200"
            >
              <FaHome className="text-xl" />
              <span className="text-sm font-medium">Back to Home</span>
            </Link>
          </div>

          {/* User Info */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <FaUser className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">User Name</p>
                <p className="text-xs text-gray-400">user@email.com</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
