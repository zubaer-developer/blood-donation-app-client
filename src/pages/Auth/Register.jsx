import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  FaEye,
  FaEyeSlash,
  FaCloudUploadAlt,
  FaGoogle,
  FaUser,
  FaEnvelope,
  FaLock,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { MdBloodtype } from "react-icons/md";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { districts, upazilas, bloodGroups } from "../../utils/districts";

const image_hosting_api = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGEBB_API_KEY}`;

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createUser, updateUserProfile, googleSignIn, user, loading } =
    useAuth();
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  const password = watch("password");

  useEffect(() => {
    if (!loading && user) navigate("/");
  }, [user, loading, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      let avatarURL = "https://i.ibb.co/MgsTCcv/user.jpg";
      if (data.avatar?.[0]) {
        const formData = new FormData();
        formData.append("image", data.avatar[0]);
        const res = await fetch(image_hosting_api, {
          method: "POST",
          body: formData,
        });
        const imgRes = await res.json();
        if (imgRes.success) avatarURL = imgRes.data.display_url;
      }

      await createUser(data.email, data.password);
      await updateUserProfile(data.name, avatarURL);

      const userData = {
        email: data.email,
        name: data.name,
        avatar: avatarURL,
        bloodGroup: data.bloodGroup,
        district: data.district,
        upazila: data.upazila,
      };

      await axiosPublic.post("/users", userData);
      toast.success("Registration successful!");
      reset();
    } catch (error) {
      toast.error(error.message);
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-red-500"></span>
      </div>
    );

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center py-20 px-4">
      <title>Register | BloodBank</title>

      <div className="max-w-2xl w-full">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex flex-col items-center group">
            <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/20 group-hover:scale-110 transition-transform">
              <MdBloodtype className="text-white text-4xl" />
            </div>
            <h1 className="text-3xl font-black mt-4 tracking-tighter">
              Join <span className="text-red-500">BloodBank</span>
            </h1>
          </Link>
          <p className="text-base-content/50 font-medium mt-2">
            Become a hero, start saving lives today
          </p>
        </div>

        <div className="bg-base-100 rounded-[2.5rem] border border-base-200 shadow-2xl overflow-hidden">
          <div className="p-8 md:p-12">
            {/* Google Signup */}
            <button
              onClick={() => googleSignIn()}
              className="btn btn-block h-14 bg-base-100 border-2 border-base-200 hover:bg-base-200 text-base-content rounded-2xl font-black mb-8 transition-all"
            >
              <FaGoogle className="text-red-500 text-lg mr-2" />
              Sign up with Google
            </button>

            <div className="relative py-4 mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-base-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-base-100 px-4 text-[10px] font-black uppercase opacity-30 tracking-widest">
                  Or Register with Email
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Profile Image Upload */}
              <div className="flex flex-col items-center mb-8">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-base-200 bg-base-200 group-hover:border-red-500 transition-all">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        className="w-full h-full object-cover"
                        alt="Preview"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-base-content/20">
                        <FaCloudUploadAlt size={30} />
                      </div>
                    )}
                  </div>
                  <label
                    htmlFor="avatar"
                    className="absolute -bottom-2 -right-2 bg-red-500 text-white p-2 rounded-xl cursor-pointer hover:scale-110 transition-all shadow-lg"
                  >
                    <FaCloudUploadAlt size={16} />
                  </label>
                  <input
                    type="file"
                    id="avatar"
                    accept="image/*"
                    className="hidden"
                    {...register("avatar")}
                    onChange={handleImageChange}
                  />
                </div>
                <p className="text-[10px] font-black uppercase opacity-40 mt-3 tracking-widest">
                  Upload Avatar
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="text-[10px] font-black uppercase opacity-40 ml-1">
                    Full Name
                  </label>
                  <div className="relative mt-2">
                    <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/30" />
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full bg-base-200 border-none rounded-2xl py-4 pl-12 pr-4 font-bold focus:ring-4 ring-red-500/10 transition-all"
                      {...register("name", { required: "Name is required" })}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-[10px] font-bold mt-2 ml-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="text-[10px] font-black uppercase opacity-40 ml-1">
                    Email Address
                  </label>
                  <div className="relative mt-2">
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/30" />
                    <input
                      type="email"
                      placeholder="john@example.com"
                      className="w-full bg-base-200 border-none rounded-2xl py-4 pl-12 pr-4 font-bold focus:ring-4 ring-red-500/10 transition-all"
                      {...register("email", { required: "Email is required" })}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-[10px] font-bold mt-2 ml-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Blood Group */}
                <div>
                  <label className="text-[10px] font-black uppercase opacity-40 ml-1">
                    Blood Group
                  </label>
                  <select
                    className="select w-full mt-2 bg-base-200 border-none rounded-2xl h-[58px] font-bold focus:ring-4 ring-red-500/10"
                    {...register("bloodGroup", { required: true })}
                  >
                    <option value="">Select Group</option>
                    {bloodGroups.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>

                {/* District */}
                <div>
                  <label className="text-[10px] font-black uppercase opacity-40 ml-1">
                    District
                  </label>
                  <select
                    className="select w-full mt-2 bg-base-200 border-none rounded-2xl h-[58px] font-bold focus:ring-4 ring-red-500/10"
                    {...register("district", { required: true })}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                  >
                    <option value="">Select District</option>
                    {districts.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Upazila */}
                <div>
                  <label className="text-[10px] font-black uppercase opacity-40 ml-1">
                    Upazila
                  </label>
                  <select
                    disabled={!selectedDistrict}
                    className="select w-full mt-2 bg-base-200 border-none rounded-2xl h-[58px] font-bold focus:ring-4 ring-red-500/10"
                    {...register("upazila", { required: true })}
                  >
                    <option value="">Select Upazila</option>
                    {selectedDistrict &&
                      upazilas[selectedDistrict]?.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Password */}
                <div>
                  <label className="text-[10px] font-black uppercase opacity-40 ml-1">
                    Password
                  </label>
                  <div className="relative mt-2">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/30" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full bg-base-200 border-none rounded-2xl py-4 pl-12 pr-12 font-bold focus:ring-4 ring-red-500/10"
                      {...register("password", {
                        required: true,
                        minLength: 6,
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/30 hover:text-red-500 transition-colors"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-block h-14 bg-red-500 hover:bg-red-600 border-none text-white rounded-2xl font-black text-lg shadow-xl shadow-red-500/20 mt-6 transition-all active:scale-95"
              >
                {isSubmitting ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Register as Donor"
                )}
              </button>
            </form>
          </div>

          <div className="bg-base-200 py-6 text-center">
            <p className="text-sm font-bold opacity-50">
              Already a member?{" "}
              <Link to="/login" className="text-red-500 hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
