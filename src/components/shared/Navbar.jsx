import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { MdBloodtype } from "react-icons/md";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logOut, loading } = useAuth();

  console.log("User:", user);
  console.log("PhotoURL:", user?.photoURL);
  console.log("DisplayName:", user?.displayName);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/donation-requests", label: "Donation Requests" },
    { path: "/search", label: "Search Donors" },
  ];

  const handleLogout = async () => {
    try {
      await logOut();
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Logout Error:", error);
      toast.error("Failed to logout!");
    }
  };

  // Default avatar URL
  const defaultAvatar = "https://i.ibb.co/MgsTCcv/user.jpg";

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center text-secondary space-x-2">
            <MdBloodtype className="text-3xl" />
            <span className="text-xl font-bold">BloodBank</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-primary"
                      : "text-gray-700 hover:text-primary"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            {loading ? (
              // Loading state
              <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
            ) : user ? (
              <>
                <NavLink
                  to="/funding"
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? "text-primary"
                        : "text-gray-700 hover:text-primary"
                    }`
                  }
                >
                  Funding
                </NavLink>

                {/* User Dropdown */}
                <div className="dropdown dropdown-end">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost btn-circle avatar"
                  >
                    <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                      <img
                        alt={user?.displayName || "User Avatar"}
                        src={user?.photoURL || defaultAvatar}
                        onError={(e) => {
                          e.target.src = defaultAvatar;
                        }}
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <ul
                    tabIndex={0}
                    className="mt-3 z-1 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 border"
                  >
                    <li className="px-4 py-2">
                      <span className="font-semibold text-neutral block">
                        {user?.displayName || "User"}
                      </span>
                      <span className="text-xs text-gray-500 block truncate">
                        {user?.email}
                      </span>
                    </li>
                    <hr className="my-1" />
                    <li>
                      <Link
                        to="/dashboard"
                        className="py-2 hover:bg-primary/10 hover:text-primary"
                      >
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/dashboard/profile"
                        className="py-2 hover:bg-primary/10 hover:text-primary"
                      >
                        My Profile
                      </Link>
                    </li>
                    <hr className="my-1" />
                    <li>
                      <button
                        onClick={handleLogout}
                        className="py-2 text-red-500 hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? "text-primary"
                        : "text-gray-700 hover:text-primary"
                    }`
                  }
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? "text-primary"
                        : "text-gray-700 hover:text-primary"
                    }`
                  }
                >
                  Register
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary focus:outline-none"
            >
              {isMenuOpen ? (
                <FaTimes className="text-2xl" />
              ) : (
                <FaBars className="text-2xl" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-3">
              {/* User Info (Mobile) */}
              {user && (
                <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-lg">
                  <img
                    src={user?.photoURL || defaultAvatar}
                    alt={user?.displayName || "User"}
                    onError={(e) => {
                      e.target.src = defaultAvatar;
                    }}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-neutral">
                      {user?.displayName || "User"}
                    </p>
                    <p className="text-xs text-gray-500 truncate max-w-37.5">
                      {user?.email}
                    </p>
                  </div>
                </div>
              )}

              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200 ${
                      isActive
                        ? "bg-primary text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}

              {user ? (
                <>
                  <NavLink
                    to="/funding"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-sm font-medium py-2 px-4 rounded-lg text-gray-700 hover:bg-gray-100"
                  >
                    Funding
                  </NavLink>
                  <NavLink
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-sm font-medium py-2 px-4 rounded-lg text-gray-700 hover:bg-gray-100"
                  >
                    Dashboard
                  </NavLink>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="text-sm font-medium py-2 px-4 rounded-lg text-red-500 hover:bg-red-50 text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      `text-sm font-medium transition-colors duration-200 ${
                        isActive
                          ? "text-primary"
                          : "text-gray-700 hover:text-primary"
                      }`
                    }
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      `text-sm font-medium transition-colors duration-200 ${
                        isActive
                          ? "text-primary"
                          : "text-gray-700 hover:text-primary"
                      }`
                    }
                  >
                    Register
                  </NavLink>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
