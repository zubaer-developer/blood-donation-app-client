import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaTint,
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

  // Handle district change
  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
  };

  // Form submit handler
  const onSubmit = async (data) => {
    setLoading(true);
    setSearched(true);
    console.log("Searching with:", data);

    try {
      const params = new URLSearchParams();

      if (data.bloodGroup) {
        params.append("bloodGroup", data.bloodGroup);
      }
      if (data.district) {
        params.append("district", data.district);
      }
      if (data.upazila) {
        params.append("upazila", data.upazila);
      }

      const queryString = params.toString();
      console.log("API Query:", `/search-donors?${queryString}`);

      const response = await axiosPublic.get(`/search-donors?${queryString}`);
      console.log("Search Results:", response.data);

      setDonors(response.data);

      if (response.data.length === 0) {
        toast.info("No donors found matching your criteria.");
      } else {
        toast.success(`Found ${response.data.length} donor(s)!`);
      }
    } catch (error) {
      console.error("Search Error:", error);
      toast.error("Failed to search donors. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Reset search
  const handleReset = () => {
    reset();
    setSelectedDistrict("");
    setDonors([]);
    setSearched(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <title>Search for Donors</title>
      {/* Hero Section */}
      <section className="bg-linear-to-r from-primary to-secondary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find Blood Donors
          </h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Search for blood donors in your area. Every second counts when you
            need blood. Find a matching donor quickly and easily.
          </p>
        </div>
      </section>

      {/* Search Form Section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 -mt-20 relative z-10">
            <h2 className="text-2xl font-bold text-neutral mb-6 text-center">
              Search for Donors
            </h2>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Blood Group */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blood Group <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MdBloodtype className="text-primary" />
                    </div>
                    <select
                      className={`input-blood pl-10 ${
                        errors.bloodGroup ? "border-red-500" : ""
                      }`}
                      {...register("bloodGroup", {
                        required: "Blood group is required",
                      })}
                    >
                      <option value="">Select Blood Group</option>
                      {bloodGroups.map((group) => (
                        <option key={group} value={group}>
                          {group}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.bloodGroup && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.bloodGroup.message}
                    </p>
                  )}
                </div>

                {/* District */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    District <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaMapMarkerAlt className="text-primary" />
                    </div>
                    <select
                      className={`input-blood pl-10 ${
                        errors.district ? "border-red-500" : ""
                      }`}
                      {...register("district", {
                        required: "District is required",
                      })}
                      onChange={(e) => {
                        register("district").onChange(e);
                        handleDistrictChange(e);
                      }}
                    >
                      <option value="">Select District</option>
                      {districts.map((district) => (
                        <option key={district.id} value={district.name}>
                          {district.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.district && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.district.message}
                    </p>
                  )}
                </div>

                {/* Upazila */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upazila <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaMapMarkerAlt className="text-gray-400" />
                    </div>
                    <select
                      className={`input-blood pl-10 ${
                        errors.upazila ? "border-red-500" : ""
                      }`}
                      {...register("upazila", {
                        required: "Upazila is required",
                      })}
                      disabled={!selectedDistrict}
                    >
                      <option value="">
                        {selectedDistrict
                          ? "Select Upazila"
                          : "Select District First"}
                      </option>
                      {selectedDistrict &&
                        upazilas[selectedDistrict]?.map((upazila, index) => (
                          <option key={index} value={upazila}>
                            {upazila}
                          </option>
                        ))}
                    </select>
                  </div>
                  {errors.upazila && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.upazila.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-blood flex items-center justify-center space-x-2 px-8 py-3"
                >
                  {loading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <FaSearch />
                      <span>Search Donors</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="border-2 border-gray-300 text-gray-700 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Search Results Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          {searched && (
            <>
              {/* Results Header */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-neutral">
                  {donors.length > 0
                    ? `Found ${donors.length} Donor${
                        donors.length > 1 ? "s" : ""
                      }`
                    : "No Donors Found"}
                </h2>
                {donors.length === 0 && (
                  <p className="text-gray-600 mt-2">
                    Try adjusting your search criteria or check nearby areas.
                  </p>
                )}
              </div>

              {/* Donor Cards Grid */}
              {donors.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {donors.map((donor) => (
                    <DonorCard key={donor._id} donor={donor} />
                  ))}
                </div>
              )}

              {/* No Results */}
              {donors.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-8xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No matching donors found
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    We couldn't find any donors matching your criteria. Please
                    try searching with different options or in nearby areas.
                  </p>
                  <Link
                    to="/donation-requests"
                    className="inline-block mt-6 btn-blood"
                  >
                    View Donation Requests
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

// ============== DONOR CARD ==============
const DonorCard = ({ donor }) => {
  const defaultAvatar = "https://i.ibb.co/MgsTCcv/user.jpg";

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
      {/* Card Header */}
      <div className="bg-linear-to-r from-primary to-secondary p-4 text-white relative">
        <div className="absolute top-4 right-4 bg-white text-primary font-bold text-xl px-3 py-1 rounded-lg">
          {donor.bloodGroup}
        </div>
        <div className="flex items-center space-x-4">
          <img
            src={donor.avatar || defaultAvatar}
            alt={donor.name}
            onError={(e) => {
              e.target.src = defaultAvatar;
            }}
            className="w-16 h-16 rounded-full border-4 border-white/30 object-cover"
          />
          <div>
            <h3 className="text-xl font-bold">{donor.name}</h3>
            <p className="opacity-90 text-sm">Blood Donor</p>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 space-y-4">
        {/* Location */}
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
            <FaMapMarkerAlt className="text-primary" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="font-medium text-neutral">
              {donor.upazila}, {donor.district}
            </p>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
            <FaEnvelope className="text-primary" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium text-neutral break-all">{donor.email}</p>
          </div>
        </div>

        {/* Blood Type Info */}
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
            <FaTint className="text-primary" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Blood Group</p>
            <p className="font-medium text-neutral">{donor.bloodGroup}</p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="pt-2">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              donor.status === "active"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full mr-2 ${
                donor.status === "active" ? "bg-green-500" : "bg-red-500"
              }`}
            ></span>
            {donor.status === "active" ? "Available" : "Unavailable"}
          </span>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-5 pb-5">
        <a
          href="#"
          className="block w-full bg-primary hover:bg-secondary text-white text-center font-semibold py-3 rounded-lg transition-colors"
        >
          Contact Donor
        </a>
      </div>
    </div>
  );
};

export default SearchPage;
