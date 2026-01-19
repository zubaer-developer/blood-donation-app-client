import { Link } from "react-router-dom";
import { MdBloodtype } from "react-icons/md";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaPhone,
  FaEnvelope,
  FaHeart,
  FaChevronRight,
} from "react-icons/fa";

const Footer = () => {
  // nav links
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Donation Requests", path: "/donation-requests" },
    { name: "Search Donors", path: "/search" },
    { name: "Funding & Support", path: "/funding" },
    { name: "Become a Donor", path: "/register" },
  ];

  // blood group list
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  return (
    <footer className="relative bg-neutral text-neutral-content pt-20 transition-colors duration-300">
      {/* top accent line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* 1. Brand section (Your default logo) */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="bg-primary p-2 rounded-2xl group-hover:rotate-12 transition-transform duration-300">
                <MdBloodtype className="text-2xl text-red-500" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                Blood<span className="text-red-500">Bank</span>
              </span>
            </Link>

            <p className="text-neutral-content/60 text-sm leading-relaxed">
              Connecting life-savers with those in urgent need. Join our
              community to make a real difference in healthcare.
            </p>

            {/* socials */}
            <div className="flex space-x-3">
              {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map(
                (Icon, idx) => (
                  <a
                    key={idx}
                    href="#"
                    className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-300 border border-white/10"
                  >
                    <Icon size={16} />
                  </a>
                ),
              )}
            </div>
          </div>

          {/* 2. Navigation */}
          <div className="lg:pl-10">
            <h3 className="text-white text-sm font-bold uppercase tracking-widest mb-8 flex items-center">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
              Links
            </h3>
            <ul className="space-y-4">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-neutral-content/60 hover:text-red-500 transition-all duration-300 text-sm font-bold flex items-center group"
                  >
                    <FaChevronRight className="text-[10px] mr-2 opacity-0 group-hover:opacity-100 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Resources grid */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-widest mb-8 flex items-center">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
              Blood Groups
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {bloodGroups.map((group) => (
                <div
                  key={group}
                  className="aspect-square bg-white/5 border border-white/10 text-white text-[10px] font-black flex items-center justify-center rounded-xl hover:bg-red-500 hover:border-red-500 transition-all duration-300 cursor-default"
                >
                  {group}
                </div>
              ))}
            </div>
          </div>

          {/* 4. Contact */}
          <div className="lg:ml-auto">
            <h3 className="text-white text-sm font-bold uppercase tracking-widest mb-8 flex items-center">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
              Contact Us
            </h3>
            <ul className="space-y-6">
              <li className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-red-500 border border-white/10">
                  <FaPhone size={14} />
                </div>
                <div>
                  <p className="text-[10px] text-neutral-content/40 font-bold uppercase tracking-widest">
                    Helpline
                  </p>
                  <p className="text-white text-sm font-bold">
                    +880 1738305766
                  </p>
                </div>
              </li>
              <li className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-red-500 border border-white/10">
                  <FaEnvelope size={14} />
                </div>
                <div>
                  <p className="text-[10px] text-neutral-content/40 font-bold uppercase tracking-widest">
                    Email
                  </p>
                  <p className="text-white text-sm font-bold">
                    zubaer.developer@gmail.com
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* bottom bar */}
        <div className="border-t border-white/5 py-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-neutral-content/40 text-[11px] font-bold uppercase tracking-widest">
            © {new Date().getFullYear()} BloodBank. All Rights Reserved.
          </p>

          <div className="flex items-center space-x-2 text-[10px] text-neutral-content/40 font-bold uppercase">
            <span>Made with</span>
            <FaHeart className="text-red-500 animate-pulse" />
            <span>for humanity</span>
          </div>

          <div className="flex space-x-6 text-[11px] font-bold uppercase tracking-widest text-neutral-content/40">
            <a href="#" className="hover:text-red-500 transition-all">
              Privacy
            </a>
            <a href="#" className="hover:text-red-500 transition-all">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
