import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import { districts, upazilas, bloodGroups } from "../../../utils/districts";
import Loading from "../../../components/shared/Loading";
import {
  FaPlusCircle,
  FaExclamationTriangle,
  FaHospital,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
} from "react-icons/fa";

const CreateDonationRequest = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [loading, setLoading] = useState(false);

  // fetch user data
  const { data: userData, isLoading } = useQuery({
    queryKey: ["userData", user?.email],
    queryFn: async () => {
      const res = await axiosPublic.get(`/users/${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  // submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target;
    const requestData = {
      requesterName: user?.displayName,
      requesterEmail: user?.email,
      recipientName: form.recipientName.value,
      recipientDistrict: form.recipientDistrict.value,
      recipientUpazila: form.recipientUpazila.value,
      hospitalName: form.hospitalName.value,
      fullAddress: form.fullAddress.value,
      bloodGroup: form.bloodGroup.value,
      donationDate: form.donationDate.value,
      donationTime: form.donationTime.value,
      requestMessage: form.requestMessage.value,
      status: "pending",
    };

    try {
      const res = await axiosSecure.post("/donation-requests", requestData);
      if (res.data.insertedId) {
        toast.success("Request Created Successfully!");
        form.reset();
        navigate("/dashboard/my-donation-requests");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <Loading />;

  // blocked state design
  if (userData?.status === "blocked") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-10 bg-[#1a1c23] rounded-[3rem] border border-white/5 animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-red-500/10 flex items-center justify-center rounded-full mb-6">
          <FaExclamationTriangle className="text-red-500 text-4xl" />
        </div>
        <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
          Access Denied
        </h1>
        <p className="text-white/40 mt-4 max-w-sm font-bold uppercase text-[11px] tracking-widest leading-relaxed">
          Your account has been restricted from creating new requests. Please
          contact support.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* title area */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic flex items-center gap-4">
            <span className="w-3 h-10 bg-red-500 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.4)]"></span>
            Create Donation Request
          </h1>
          <p className="text-red-500/60 font-black uppercase text-[10px] tracking-[0.3em] mt-3 ml-7">
            Emergency Blood Support Network
          </p>
        </div>
      </div>

      <div className="bg-[#1a1c23] border border-white/5 shadow-2xl rounded-[3rem] overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 md:p-14">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {/* Requester Info (Locked) */}
            <div className="space-y-8 md:border-r border-white/5 md:pr-12">
              <h3 className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                Requester Information
              </h3>

              <div className="form-control group">
                <label className="label text-[10px] font-black text-white/40 uppercase mb-2">
                  My Profile Name
                </label>
                <input
                  type="text"
                  value={user?.displayName || ""}
                  disabled
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-white/50 font-bold text-sm cursor-not-allowed"
                />
              </div>

              <div className="form-control group">
                <label className="label text-[10px] font-black text-white/40 uppercase mb-2">
                  My Email Address
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-white/50 font-bold text-sm cursor-not-allowed"
                />
              </div>

              <div className="form-control group">
                <label className="label text-[10px] font-black text-red-500/60 uppercase mb-2 italic flex items-center gap-2">
                  <FaPlusCircle size={10} /> Recipient Name *
                </label>
                <input
                  type="text"
                  name="recipientName"
                  required
                  placeholder="John Doe"
                  className="w-full bg-white/[0.05] border border-white/10 rounded-2xl p-4 text-white font-bold text-sm focus:border-red-500 outline-none transition-all placeholder:text-white/10"
                />
              </div>

              <div className="form-control group">
                <label className="label text-[10px] font-black text-red-500/60 uppercase mb-2 italic flex items-center gap-2">
                  <FaPlusCircle size={10} /> Required Blood Group *
                </label>
                <select
                  name="bloodGroup"
                  required
                  className="w-full bg-white/[0.05] border border-white/10 rounded-2xl p-4 text-white font-bold text-sm focus:border-red-500 outline-none transition-all cursor-pointer"
                >
                  <option value="" className="bg-[#1a1c23]">
                    Choose One
                  </option>
                  {bloodGroups.map((group) => (
                    <option key={group} value={group} className="bg-[#1a1c23]">
                      {group}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location & Time */}
            <div className="space-y-8">
              <h3 className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                Logistics & Location
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label text-[10px] font-black text-white/40 uppercase mb-2">
                    District *
                  </label>
                  <select
                    name="recipientDistrict"
                    required
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="w-full bg-white/[0.05] border border-white/10 rounded-2xl p-4 text-white font-bold text-xs focus:border-red-500 outline-none"
                  >
                    <option value="" className="bg-[#1a1c23]">
                      Select
                    </option>
                    {districts.map((d) => (
                      <option
                        key={d.id}
                        value={d.name}
                        className="bg-[#1a1c23]"
                      >
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-control">
                  <label className="label text-[10px] font-black text-white/40 uppercase mb-2">
                    Upazila *
                  </label>
                  <select
                    name="recipientUpazila"
                    required
                    className="w-full bg-white/[0.05] border border-white/10 rounded-2xl p-4 text-white font-bold text-xs focus:border-red-500 outline-none"
                  >
                    <option value="" className="bg-[#1a1c23]">
                      Select
                    </option>
                    {upazilas[selectedDistrict]?.map((u, i) => (
                      <option key={i} value={u} className="bg-[#1a1c23]">
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-control">
                <label className="label text-[10px] font-black text-white/40 uppercase mb-2 flex items-center gap-2">
                  <FaHospital size={10} /> Medical Facility *
                </label>
                <input
                  type="text"
                  name="hospitalName"
                  required
                  placeholder="e.g. Dhaka Medical College"
                  className="w-full bg-white/[0.05] border border-white/10 rounded-2xl p-4 text-white font-bold text-sm focus:border-red-500 outline-none placeholder:text-white/10"
                />
              </div>

              <div className="form-control">
                <label className="label text-[10px] font-black text-white/40 uppercase mb-2 flex items-center gap-2">
                  <FaMapMarkerAlt size={10} /> Street Address *
                </label>
                <input
                  type="text"
                  name="fullAddress"
                  required
                  placeholder="House 12, Road 5..."
                  className="w-full bg-white/[0.05] border border-white/10 rounded-2xl p-4 text-white font-bold text-sm focus:border-red-500 outline-none placeholder:text-white/10"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label text-[10px] font-black text-white/40 uppercase mb-2 flex items-center gap-2">
                    <FaCalendarAlt size={10} /> Date *
                  </label>
                  <input
                    type="date"
                    name="donationDate"
                    required
                    className="w-full bg-white/[0.05] border border-white/10 rounded-2xl p-4 text-white font-bold text-xs focus:border-red-500 outline-none invert-[0.9] md:invert-0"
                  />
                </div>
                <div className="form-control">
                  <label className="label text-[10px] font-black text-white/40 uppercase mb-2 flex items-center gap-2">
                    <FaClock size={10} /> Time *
                  </label>
                  <input
                    type="time"
                    name="donationTime"
                    required
                    className="w-full bg-white/[0.05] border border-white/10 rounded-2xl p-4 text-white font-bold text-xs focus:border-red-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Message Area */}
            <div className="form-control md:col-span-2 mt-4">
              <label className="label text-[10px] font-black text-white/40 uppercase mb-2 italic">
                Special Instructions / Message *
              </label>
              <textarea
                name="requestMessage"
                required
                rows="4"
                placeholder="Briefly describe the emergency status..."
                className="w-full bg-white/[0.05] border border-white/10 rounded-[2rem] p-6 text-white font-bold text-sm focus:border-red-500 outline-none transition-all placeholder:text-white/10 resize-none"
              ></textarea>
            </div>
          </div>

          {/* submit btn */}
          <div className="mt-16 flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full md:w-auto md:px-20 h-16 overflow-hidden rounded-2xl bg-red-500 font-black uppercase tracking-[0.2em] text-white shadow-[0_0_30px_rgba(239,68,68,0.3)] transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="relative z-10 flex items-center justify-center gap-3 italic">
                {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Confirm & Post Request"
                )}
              </span>
              <div className="absolute inset-0 -translate-x-full bg-white/20 transition-transform group-hover:translate-x-0"></div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDonationRequest;
