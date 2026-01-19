import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import {
  FaBars,
  FaTimes,
  FaSun,
  FaMoon,
  FaUserCircle,
  FaThLarge,
} from "react-icons/fa";
import { MdBloodtype, MdDashboard } from "react-icons/md";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logOut, loading, theme, toggleTheme } = useAuth();

  // Basic routes
  const publicLinks = [
    { path: "/", label: "Home" },
    { path: "/donation-requests", label: "Donation Requests" },
    { path: "/search", label: "Search Donors" },
  ];

  // Auth routes
  const authLinks = [...publicLinks, { path: "/funding", label: "Funding" }];

  const handleLogout = async () => {
    try {
      await logOut();
      toast.success("Logged out!");
    } catch (error) {
      toast.error("Logout failed!");
    }
  };

  const defaultAvatar = "https://i.ibb.co/MgsTCcv/user.jpg";

  // loader during auth check
  if (loading) {
    return (
      <nav className="bg-base-100 h-20 shadow-sm sticky top-0 z-50 flex items-center justify-center">
        <span className="loading loading-ring loading-lg text-primary"></span>
      </nav>
    );
  }

  const currentLinks = user ? authLinks : publicLinks;

  return (
    <nav className="bg-base-100/80 backdrop-blur-md text-base-content shadow-sm sticky top-0 z-50 transition-all border-b border-base-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* logo section */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-primary p-2 rounded-2xl group-hover:rotate-12 transition-transform duration-300">
              <MdBloodtype className="text-2xl text-red-500" />
            </div>
            <span className="text-xl font-black tracking-tight">
              Blood<span className="text-red-500">Bank</span>
            </span>
          </Link>

          {/* desktop menu */}
          <div className="hidden md:flex items-center space-x-1">
            {currentLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-4 py-2 text-sm font-bold rounded-xl transition-all ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-base-200 opacity-70 hover:opacity-100"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            <div className="h-6 w-[1px] bg-base-300 mx-2"></div>

            {/* theme toggle */}
            <button
              onClick={toggleTheme}
              className="btn btn-ghost btn-circle btn-sm"
            >
              {theme === "light" ? (
                <FaMoon className="text-indigo-600" />
              ) : (
                <FaSun className="text-yellow-400" />
              )}
            </button>

            {user ? (
              <div className="flex items-center gap-3 ml-2">
                {/* Advanced menu (Requirement 2) */}
                <div className="dropdown dropdown-end">
                  <div
                    tabIndex={0}
                    role="button"
                    className="avatar online cursor-pointer"
                  >
                    <div className="w-10 rounded-2xl border-2 border-primary ring ring-primary ring-offset-base-100 ring-offset-2">
                      <img
                        src={user?.photoURL || defaultAvatar}
                        alt="Profile"
                      />
                    </div>
                  </div>
                  <ul
                    tabIndex={0}
                    className="mt-4 z-[1] p-3 shadow-2xl menu dropdown-content bg-base-100 rounded-2xl w-64 border border-base-200"
                  >
                    <li className="p-4 bg-base-200 rounded-xl mb-2">
                      <p className="font-black text-primary truncate">
                        {user?.displayName}
                      </p>
                      <p className="text-[10px] opacity-60 truncate">
                        {user?.email}
                      </p>
                    </li>
                    <li>
                      <Link to="/dashboard" className="font-bold">
                        <MdDashboard /> Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link to="/dashboard/profile" className="font-bold">
                        <FaUserCircle /> My Profile
                      </Link>
                    </li>
                    <div className="divider my-1"></div>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="btn btn-error btn-sm text-white font-bold"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <Link
                  to="/login"
                  className="btn btn-ghost btn-sm font-bold rounded-xl"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary btn-sm px-6 rounded-xl font-bold shadow-lg shadow-primary/20"
                >
                  Join Now
                </Link>
              </div>
            )}
          </div>

          {/* mobile trigger buttons */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="btn btn-ghost btn-sm btn-circle"
            >
              {theme === "light" ? (
                <FaMoon />
              ) : (
                <FaSun className="text-yellow-400" />
              )}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="btn btn-primary btn-sm btn-square rounded-xl"
            >
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>

      {/* mobile menu drawer */}
      {isMenuOpen && (
        <div className="md:hidden bg-base-100 border-t border-base-200 p-4 space-y-2 animate-in fade-in slide-in-from-top-4">
          {currentLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-3 rounded-xl font-bold hover:bg-base-200"
            >
              {link.label}
            </Link>
          ))}

          <div className="divider"></div>

          {user ? (
            <div className="space-y-2">
              <Link
                to="/dashboard"
                onClick={() => setIsMenuOpen(false)}
                className="btn btn-outline btn-primary w-full rounded-xl"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="btn btn-error w-full text-white rounded-xl"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="btn btn-outline rounded-xl"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsMenuOpen(false)}
                className="btn btn-primary rounded-xl"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
