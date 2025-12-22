import { Link } from "react-router-dom";
import { MdBloodtype } from "react-icons/md";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-neutral text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Link
                to="/"
                className="flex items-center text-secondary space-x-2"
              >
                <MdBloodtype className="text-3xl" />
                <span className="text-xl font-bold">BloodBank</span>
              </Link>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Connecting blood donors with those in need. Every drop counts,
              every donation saves lives. Join us in making a difference.
            </p>
            {/* Social Icons */}
            <div className="flex space-x-4 mt-4">
              <a
                href="#"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-primary transition-colors text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/donation-requests"
                  className="text-gray-400 hover:text-primary transition-colors text-sm"
                >
                  Donation Requests
                </Link>
              </li>
              <li>
                <Link
                  to="/search"
                  className="text-gray-400 hover:text-primary transition-colors text-sm"
                >
                  Search Donors
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-gray-400 hover:text-primary transition-colors text-sm"
                >
                  Become a Donor
                </Link>
              </li>
            </ul>
          </div>

          {/* Blood Groups */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Blood Groups</h3>
            <div className="grid grid-cols-4 gap-2">
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                (group) => (
                  <span
                    key={group}
                    className="bg-primary/20 text-primary text-xs font-semibold px-2 py-1 rounded text-center"
                  >
                    {group}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <FaPhone className="text-primary" />
                <span className="text-gray-400 text-sm">+880 1234-567890</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaEnvelope className="text-primary" />
                <span className="text-gray-400 text-sm">
                  info@bloodbank.com
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-primary mt-1" />
                <span className="text-gray-400 text-sm">
                  123 Medical Center Road,
                  <br />
                  Dhaka, Bangladesh
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} BloodBank. All rights reserved. Made
            with Love for humanity.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
