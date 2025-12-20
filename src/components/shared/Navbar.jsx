import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { FaBars, FaTimes, FaUser } from "react-icons/fa";
import { MdBloodtype } from "react-icons/md";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = null;

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/donation-requests", label: "Donation Requests" },
    { path: "/search", label: "Search Donors" },
  ];

  const handleLogout = () => {
    console.log("Logout clicked");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <MdBloodtype className="text-red-600 text-3xl" />
            <span className="text-xl font-bold text-primary">
              Blood<span className="text-secondary">Bank</span>
            </span>
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

            {user ? (
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
                        alt="User Avatar"
                        src={
                          user?.photoURL || "https://i.ibb.co/MgsTCcv/user.jpg"
                        }
                      />
                    </div>
                  </div>
                  <ul
                    tabIndex={0}
                    className="mt-3 z-1 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
                  >
                    <li className="font-semibold text-center py-2">
                      {user?.displayName || "User"}
                    </li>
                    <hr />
                    <li>
                      <Link to="/dashboard" className="py-2">
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="py-2 text-red-500"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <Link to="/login" className="btn-blood">
                Login
              </Link>
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
                    onClick={handleLogout}
                    className="text-sm font-medium py-2 px-4 rounded-lg text-red-500 hover:bg-red-50 text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="btn-blood text-center"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
