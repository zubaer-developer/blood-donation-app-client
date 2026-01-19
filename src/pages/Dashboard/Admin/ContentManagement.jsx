import React, { useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaRegFileAlt,
  FaTrash,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const ContentManagement = () => {
  const [activeTab, setActiveTab] = useState("all");

  // Placeholder data for UI demonstration
  const articles = [
    {
      id: 1,
      title: "The Importance of Regular Blood Donation",
      status: "published",
      date: "Jan 15, 2026",
      author: "Admin",
    },
    {
      id: 2,
      title: "Emergency Response: O Negative Required",
      status: "draft",
      date: "Jan 18, 2026",
      author: "Volunteer",
    },
    {
      id: 3,
      title: "Healthy Diet Before Donating Blood",
      status: "published",
      date: "Jan 19, 2026",
      author: "Dr. Smith",
    },
  ];

  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="bg-[#1a1c23] border border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-red-500/5 blur-[80px] rounded-full -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h4 className="text-red-500 font-black uppercase tracking-[0.4em] text-[10px] mb-2">
              Editorial Hub
            </h4>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase">
              Content <span className="text-red-500">Management</span>
            </h1>
          </div>

          <button className="btn bg-red-500 hover:bg-red-600 border-none text-white px-8 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-red-500/20 group">
            <FaPlus className="group-hover:rotate-90 transition-transform" />{" "}
            Add New Blog
          </button>
        </div>
      </div>

      {/* Stats & Search Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 flex flex-wrap items-center gap-3">
          {["all", "published", "draft"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                activeTab === tab
                  ? "bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/10"
                  : "bg-white/5 border-white/5 text-white/40 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative group">
          <input
            type="text"
            placeholder="Search content..."
            className="w-full bg-[#1a1c23] border border-white/5 rounded-2xl py-3 px-12 text-sm text-white focus:outline-none focus:border-red-500/50 transition-all font-medium"
          />
          <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-red-500 transition-colors" />
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {articles.map((blog) => (
          <div
            key={blog.id}
            className="bg-[#1a1c23] border border-white/5 rounded-[2.5rem] p-8 hover:border-red-500/30 transition-all duration-300 group shadow-xl"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all shadow-inner">
                <FaRegFileAlt size={20} />
              </div>
              <span
                className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                  blog.status === "published"
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                }`}
              >
                {blog.status}
              </span>
            </div>

            <h3 className="text-lg font-black text-white leading-tight mb-4 group-hover:text-red-500 transition-colors">
              {blog.title}
            </h3>

            <div className="space-y-2 mb-8">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/20">
                <span>By: {blog.author}</span>
                <span>{blog.date}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-6 border-t border-white/5">
              <button className="flex-1 py-3 bg-white/5 hover:bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                Edit Post
              </button>
              <button
                className="w-12 h-11 bg-white/5 hover:bg-emerald-500/10 hover:text-emerald-500 text-white/30 rounded-xl flex items-center justify-center transition-all"
                title="Toggle Publish"
              >
                {blog.status === "published" ? (
                  <FaTimesCircle />
                ) : (
                  <FaCheckCircle />
                )}
              </button>
              <button
                className="w-12 h-11 bg-white/5 hover:bg-red-500/10 hover:text-red-500 text-white/30 rounded-xl flex items-center justify-center transition-all"
                title="Delete"
              >
                <FaTrash size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State Illustration Placeholder */}
      {articles.length === 0 && (
        <div className="bg-[#1a1c23] border border-white/5 rounded-[3rem] p-20 text-center">
          <FaRegFileAlt className="mx-auto text-red-500/10 text-7xl mb-6" />
          <h2 className="text-white/40 font-black uppercase tracking-[0.3em]">
            No Articles Published Yet
          </h2>
        </div>
      )}
    </div>
  );
};

export default ContentManagement;
