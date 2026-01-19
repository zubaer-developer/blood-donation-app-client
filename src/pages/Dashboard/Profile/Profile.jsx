import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAuth from "../../../hooks/useAuth";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { districts, upazilas, bloodGroups } from "../../../utils/districts";
import Loading from "../../../components/shared/Loading";
import {
  FaEdit,
  FaSave,
  FaTimes,
  FaUserAlt,
  FaCheckCircle,
  FaEnvelope,
  FaShieldAlt,
} from "react-icons/fa";

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const {
    data: userData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["userProfile", user?.email],
    queryFn: async () => {
      const res = await axiosPublic.get(`/users/${user?.email}`);
      setSelectedDistrict(res.data.district);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const form = e.target;
    const name = form.name.value;
    const bloodGroup = form.bloodGroup.value;
    const district = form.district.value;
    const upazila = form.upazila.value;

    if (!name || !bloodGroup || !district || !upazila) {
      toast.error("Required fields are missing");
      setSaving(false);
      return;
    }

    const updatedData = { name, bloodGroup, district, upazila };

    try {
      const res = await axiosSecure.patch(`/users/${user?.email}`, updatedData);
      if (res.data.modifiedCount > 0 || res.data.matchedCount > 0) {
        await updateUserProfile(name, user?.photoURL);
        toast.success("Identity Updated Successfully!", {
          icon: <FaCheckCircle className="text-emerald-500" />,
          style: {
            borderRadius: "15px",
            background: "#1a1c23",
            color: "#fff",
            border: "1px solid #ef4444",
          },
        });
        setIsEditing(false);
        refetch();
      }
    } catch (error) {
      toast.error("Update failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="max-w-6xl mx-auto pb-16 px-4 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 bg-[#1a1c23] p-8 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-red-500/10 blur-[80px] rounded-full"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase">
            My <span className="text-red-500">Profile.</span>
          </h1>
          <p className="text-white/30 text-[10px] font-black mt-1 tracking-[0.4em] uppercase">
            Personal Credentials & Identity
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="btn bg-red-500 hover:bg-red-600 border-none text-white rounded-2xl px-10 font-black uppercase text-xs tracking-widest shadow-lg shadow-red-500/20 transition-all hover:scale-105 active:scale-95"
          >
            <FaEdit className="mr-2" /> Edit Profile
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Identity Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#1a1c23] border border-white/5 rounded-[3.5rem] p-12 text-center shadow-2xl relative">
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-red-500/20 rounded-[3rem] blur-3xl animate-pulse"></div>
              <img
                src={
                  userData?.avatar ||
                  user?.photoURL ||
                  "https://i.ibb.co/MgsTCcv/user.jpg"
                }
                alt="avatar"
                className="relative w-44 h-44 rounded-[3rem] mx-auto border-4 border-white/10 shadow-2xl object-cover ring-4 ring-red-500/10"
              />
              <div className="absolute -bottom-3 -right-3 bg-red-500 p-4 rounded-2xl text-white shadow-2xl border-4 border-[#1a1c23]">
                <FaShieldAlt size={20} />
              </div>
            </div>

            <h2 className="text-3xl font-black text-white tracking-tight uppercase leading-none">
              {userData?.name}
            </h2>
            <div className="flex items-center justify-center gap-2 text-white/30 text-xs font-bold mt-3 lowercase tracking-wider">
              <FaEnvelope className="text-red-500/40" /> {userData?.email}
            </div>

            <div className="mt-10 grid grid-cols-2 gap-3">
              <div className="bg-white/5 p-4 rounded-3xl border border-white/5">
                <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">
                  Rank
                </p>
                <p className="text-xs font-black text-red-500 uppercase">
                  {userData?.role}
                </p>
              </div>
              <div className="bg-white/5 p-4 rounded-3xl border border-white/5">
                <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">
                  Access
                </p>
                <p
                  className={`text-xs font-black uppercase ${userData?.status === "active" ? "text-emerald-500" : "text-red-500"}`}
                >
                  {userData?.status}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-red-500/5 border border-red-500/10 rounded-[2.5rem] p-8">
            <p className="text-white/40 text-[10px] font-bold leading-relaxed text-center uppercase tracking-tighter">
              Ensure your blood group and location are accurate to receive
              relevant emergency alerts.
            </p>
          </div>
        </div>

        {/* Configuration Panel */}
        <div className="lg:col-span-8">
          <div className="bg-[#1a1c23] border border-white/5 rounded-[3.5rem] p-8 md:p-14 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                {/* Input Fields */}
                {[
                  {
                    label: "Account Name",
                    name: "name",
                    type: "text",
                    val: userData?.name,
                  },
                ].map((input) => (
                  <div key={input.name} className="form-control group">
                    <label className="label text-white/30 text-[10px] font-black uppercase tracking-[0.3em] px-4">
                      {input.label}
                    </label>
                    <input
                      type={input.type}
                      name={input.name}
                      defaultValue={input.val || ""}
                      disabled={!isEditing}
                      className="input w-full bg-white/[0.03] border-white/10 rounded-2xl h-16 px-6 text-white font-bold focus:border-red-500/50 transition-all disabled:opacity-40"
                    />
                  </div>
                ))}

                <div className="form-control">
                  <label className="label text-white/30 text-[10px] font-black uppercase tracking-[0.3em] px-4">
                    Blood Group
                  </label>
                  <select
                    name="bloodGroup"
                    disabled={!isEditing}
                    defaultValue={userData?.bloodGroup || ""}
                    className="select w-full bg-white/[0.03] border-white/10 rounded-2xl h-16 px-6 text-white font-bold focus:border-red-500/50 disabled:opacity-40"
                  >
                    <option disabled value="">
                      Selection
                    </option>
                    {bloodGroups.map((group) => (
                      <option
                        key={group}
                        value={group}
                        className="bg-[#1a1c23]"
                      >
                        {group}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label text-white/30 text-[10px] font-black uppercase tracking-[0.3em] px-4">
                    District
                  </label>
                  <select
                    name="district"
                    disabled={!isEditing}
                    defaultValue={userData?.district || ""}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="select w-full bg-white/[0.03] border-white/10 rounded-2xl h-16 px-6 text-white font-bold focus:border-red-500/50 disabled:opacity-40"
                  >
                    <option value="">Choose District</option>
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
                  <label className="label text-white/30 text-[10px] font-black uppercase tracking-[0.3em] px-4">
                    Upazila
                  </label>
                  <select
                    name="upazila"
                    disabled={!isEditing}
                    defaultValue={userData?.upazila || ""}
                    className="select w-full bg-white/[0.03] border-white/10 rounded-2xl h-16 px-6 text-white font-bold focus:border-red-500/50 disabled:opacity-40"
                  >
                    <option value="">Choose Upazila</option>
                    {selectedDistrict &&
                      upazilas[selectedDistrict]?.map((u, i) => (
                        <option key={i} value={u} className="bg-[#1a1c23]">
                          {u}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {isEditing && (
                <div className="flex flex-col sm:flex-row gap-5 pt-6 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="btn btn-ghost flex-1 h-16 rounded-2xl text-white/40 font-black uppercase text-xs tracking-widest hover:bg-white/5"
                  >
                    <FaTimes className="mr-2" /> Discard
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn bg-red-500 hover:bg-red-600 border-none text-white flex-1 h-16 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-red-500/20"
                  >
                    {saving ? (
                      <span className="loading loading-spinner"></span>
                    ) : (
                      <>
                        <FaSave className="mr-2" /> Save Changes
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
