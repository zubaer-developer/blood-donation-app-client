import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaEnvelope,
  FaUndo,
  FaArrowRight,
} from "react-icons/fa";
import { MdBloodtype } from "react-icons/md";
import toast from "react-hot-toast";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { districts, upazilas, bloodGroups } from "../../utils/districts";

const SearchPage = () => {
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const axiosPublic = useAxiosPublic();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setSearched(true);

    try {
      const params = new URLSearchParams();
      if (data.bloodGroup) params.append("bloodGroup", data.bloodGroup);
      if (data.district) params.append("district", data.district);
      if (data.upazila) params.append("upazila", data.upazila);

      const response = await axiosPublic.get(
        `/search-donors?${params.toString()}`,
      );
      setDonors(response.data);

      if (response.data.length === 0) {
        toast.error("No donors found in this area.");
      } else {
        toast.success(`Found ${response.data.length} donors!`);
      }
    } catch (error) {
      toast.error("Search failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    reset();
    setSelectedDistrict("");
    setDonors([]);
    setSearched(false);
  };

  return (
    <div className="min-h-screen bg-base-100">
      <title>Search Donors | BloodBank</title>

      {/* Hero Section */}
      <section className="bg-neutral pt-24 pb-40 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-20 opacity-5 rotate-12">
          <MdBloodtype className="text-[20rem] text-red-500" />
        </div>

        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter text-white">
            Find a <span className="text-red-500">Donor</span>
          </h1>
          <p className="text-neutral-content/60 text-lg max-w-2xl mx-auto font-medium">
            Browse our community of heroes. Filter by location and blood group
            to find a match in seconds.
          </p>
        </div>
      </section>

      {/* Search Filter Container */}
      <section className="px-4 -mt-24 relative z-20">
        <div className="max-w-5xl mx-auto">
          <div className="card bg-base-100 shadow-[0_32px_64px_-15px_rgba(0,0,0,0.2)] rounded-[2.5rem] border border-base-200">
            <div className="card-body p-8 md:p-12">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                  {/* group selection */}
                  <div className="form-control">
                    <label className="label text-[10px] font-black uppercase tracking-widest opacity-40">
                      Blood Group
                    </label>
                    <div className="relative">
                      <MdBloodtype className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500 text-2xl" />
                      <select
                        className="select select-bordered w-full pl-12 rounded-2xl bg-base-200 border-none focus:ring-2 ring-red-500/20"
                        {...register("bloodGroup", { required: true })}
                      >
                        <option value="">Choose Type</option>
                        {bloodGroups.map((group) => (
                          <option key={group} value={group}>
                            {group}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* district selection */}
                  <div className="form-control">
                    <label className="label text-[10px] font-black uppercase tracking-widest opacity-40">
                      District
                    </label>
                    <div className="relative">
                      <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500" />
                      <select
                        className="select select-bordered w-full pl-12 rounded-2xl bg-base-200 border-none focus:ring-2 ring-red-500/20"
                        {...register("district", { required: true })}
                        onChange={(e) => {
                          register("district").onChange(e);
                          handleDistrictChange(e);
                        }}
                      >
                        <option value="">Select District</option>
                        {districts.map((d) => (
                          <option key={d.id} value={d.name}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* upazila selection */}
                  <div className="form-control">
                    <label className="label text-[10px] font-black uppercase tracking-widest opacity-40">
                      Upazila
                    </label>
                    <div className="relative">
                      <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/20" />
                      <select
                        className="select select-bordered w-full pl-12 rounded-2xl bg-base-200 border-none focus:ring-2 ring-red-500/20 disabled:opacity-50"
                        {...register("upazila", { required: true })}
                        disabled={!selectedDistrict}
                      >
                        <option value="">
                          {selectedDistrict
                            ? "Choose Area"
                            : "Select District First"}
                        </option>
                        {selectedDistrict &&
                          upazilas[selectedDistrict]?.map((u, i) => (
                            <option key={i} value={u}>
                              {u}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary btn-lg px-12 rounded-2xl shadow-xl shadow-primary/20 text-white font-black"
                  >
                    {loading ? (
                      <span className="loading loading-spinner"></span>
                    ) : (
                      <>
                        <FaSearch /> Find Donors
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="btn btn-ghost btn-lg rounded-2xl font-bold opacity-60"
                  >
                    <FaUndo /> Reset
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Results view */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        {searched && (
          <>
            <div className="flex flex-col items-center mb-16">
              <div className="h-1 w-20 bg-red-500 rounded-full mb-4"></div>
              <h2 className="text-3xl font-black uppercase tracking-tighter">
                {donors.length} Potential Match{donors.length !== 1 && "es"}
              </h2>
            </div>

            {donors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {donors.map((donor) => (
                  <DonorCard key={donor._id} donor={donor} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-base-200/50 rounded-[3.5rem] border-2 border-dashed border-base-300">
                <div className="text-8xl mb-6 opacity-20 italic font-black">
                  Empty
                </div>
                <h3 className="text-2xl font-bold opacity-60 mb-8">
                  No donors found in this area
                </h3>
                <Link
                  to="/donation-requests"
                  className="btn btn-primary rounded-xl px-10"
                >
                  View Requests
                </Link>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

const DonorCard = ({ donor }) => {
  const defaultAvatar = "https://i.ibb.co/MgsTCcv/user.jpg";

  return (
    <div className="card bg-base-100 shadow-sm hover:shadow-2xl transition-all duration-500 rounded-[2rem] border border-base-200 group overflow-hidden">
      {/* card head */}
      <div className="bg-neutral p-8 text-white relative">
        <div className="absolute -bottom-6 right-8">
          <div className="w-20 h-20 bg-white text-red-500 rounded-3xl shadow-2xl flex flex-col items-center justify-center border-4 border-base-100">
            <span className="text-[10px] font-black opacity-40 leading-none mb-1">
              TYPE
            </span>
            <span className="text-3xl font-black leading-none">
              {donor.bloodGroup}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="avatar">
            <div className="w-20 rounded-2xl ring-4 ring-white/10">
              <img src={donor.avatar || defaultAvatar} alt={donor.name} />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-black tracking-tight">{donor.name}</h3>
            <div
              className={`mt-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${donor.status === "active" ? "text-green-400" : "text-red-400"}`}
            >
              <span
                className={`w-2 h-2 rounded-full bg-current ${donor.status === "active" ? "animate-pulse" : ""}`}
              ></span>
              {donor.status === "active" ? "Available" : "Unavailable"}
            </div>
          </div>
        </div>
      </div>

      <div className="card-body p-8 pt-12">
        <div className="space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-base-200 flex items-center justify-center text-red-500">
              <FaMapMarkerAlt />
            </div>
            <div className="text-sm">
              <p className="text-[10px] font-black uppercase opacity-30">
                Location
              </p>
              <p className="font-bold">
                {donor.upazila}, {donor.district}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-base-200 flex items-center justify-center text-red-500">
              <FaEnvelope />
            </div>
            <div className="text-sm truncate">
              <p className="text-[10px] font-black uppercase opacity-30">
                Contact
              </p>
              <p className="font-bold truncate max-w-[180px]">{donor.email}</p>
            </div>
          </div>
        </div>

        <div className="card-actions mt-10">
          <button className="btn btn-primary btn-block rounded-2xl group-hover:bg-red-600 border-none text-white font-black h-14">
            Request Contact{" "}
            <FaArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
