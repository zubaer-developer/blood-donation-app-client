import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash, FaCloudUploadAlt } from "react-icons/fa";
import { MdBloodtype } from "react-icons/md";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { districts, upazilas, bloodGroups } from "../../utils/districts";

// ImageBB API URL
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${
  import.meta.env.VITE_IMAGEBB_API_KEY
}`;
console.log("API URL:", image_hosting_api);

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const { createUser, updateUserProfile } = useAuth();
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  // Watch password for confirm password validation
  const password = watch("password");

  // Handle district change to update upazila options
  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
  };

  // Handle image preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Form submit handler
  const onSubmit = async (data) => {
    setUploading(true);

    try {
      // Upload image to ImageBB
      let avatarURL = "https://i.ibb.co/MgsTCcv/user.jpg"; // Default avatar

      if (data.avatar && data.avatar[0]) {
        console.log("Uploading image to ImageBB...");
        console.log("API Key exists:", !!import.meta.env.VITE_IMAGEBB_API_KEY);

        const imageFile = new FormData();
        imageFile.append("image", data.avatar[0]);

        const imageResponse = await fetch(image_hosting_api, {
          method: "POST",
          body: imageFile,
        });
        const imageResult = await imageResponse.json();
        console.log("ImageBB Response:", imageResult);

        if (imageResult.success) {
          avatarURL = imageResult.data.display_url;
          console.log("Image uploaded successfully:", avatarURL);
        } else {
          console.error("Image upload failed:", imageResult);
          toast.error("Image upload failed. Using default avatar.");
        }
      } else {
        console.log("No image selected, using default avatar");
      }

      // Create user in Firebase
      const result = await createUser(data.email, data.password);
      const user = result.user;

      // Update user profile in Firebase
      await updateUserProfile(data.name, avatarURL);

      // Prepare user data for MongoDB
      const userData = {
        email: data.email,
        name: data.name,
        avatar: avatarURL,
        bloodGroup: data.bloodGroup,
        district: data.district,
        upazila: data.upazila,
      };

      // Save user to MongoDB
      const dbResponse = await axiosPublic.post("/users", userData);

      if (
        dbResponse.data.insertedId ||
        dbResponse.data.message === "User already exists"
      ) {
        // Get JWT token
        const tokenResponse = await axiosPublic.post("/jwt", {
          email: data.email,
        });

        if (tokenResponse.data.token) {
          localStorage.setItem("access-token", tokenResponse.data.token);
        }

        toast.success("Registration successful! Welcome to BloodBank!");
        reset();
        navigate("/");
      }
    } catch (error) {
      console.error("Registration Error:", error);

      // Handle Firebase errors
      if (error.code === "auth/email-already-in-use") {
        toast.error("Email already in use. Please try another email.");
      } else if (error.code === "auth/weak-password") {
        toast.error("Password is too weak. Please use a stronger password.");
      } else {
        toast.error(error.message || "Registration failed. Please try again.");
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-red-50 to-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <MdBloodtype className="text-primary text-4xl" />
            <span className="text-2xl font-bold text-primary">
              Blood<span className="text-secondary">Bank</span>
            </span>
          </div>
          <h2 className="text-3xl font-bold text-neutral">
            Create Your Account
          </h2>
          <p className="text-gray-600 mt-2">
            Join us and save lives by donating blood
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary/20 bg-gray-100">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <FaCloudUploadAlt size={32} />
                    </div>
                  )}
                </div>
                <label
                  htmlFor="avatar"
                  className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-secondary transition-colors"
                >
                  <FaCloudUploadAlt size={14} />
                </label>
                <input
                  type="file"
                  id="avatar"
                  accept="image/*"
                  className="hidden"
                  {...register("avatar")}
                  onChange={(e) => {
                    register("avatar").onChange(e);
                    handleImageChange(e);
                  }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Upload your photo (optional)
              </p>
            </div>

            {/* Name & Email Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className={`input-blood ${
                    errors.name ? "border-red-500 focus:ring-red-500" : ""
                  }`}
                  {...register("name", {
                    required: "Name is required",
                    minLength: {
                      value: 3,
                      message: "Name must be at least 3 characters",
                    },
                  })}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={`input-blood ${
                    errors.email ? "border-red-500 focus:ring-red-500" : ""
                  }`}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            {/* Blood Group & District Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Blood Group */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blood Group <span className="text-red-500">*</span>
                </label>
                <select
                  className={`input-blood ${
                    errors.bloodGroup ? "border-red-500 focus:ring-red-500" : ""
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
                <select
                  className={`input-blood ${
                    errors.district ? "border-red-500 focus:ring-red-500" : ""
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
                {errors.district && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.district.message}
                  </p>
                )}
              </div>
            </div>

            {/* Upazila */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upazila <span className="text-red-500">*</span>
              </label>
              <select
                className={`input-blood ${
                  errors.upazila ? "border-red-500 focus:ring-red-500" : ""
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
              {errors.upazila && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.upazila.message}
                </p>
              )}
            </div>

            {/* Password & Confirm Password Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    className={`input-blood pr-12 ${
                      errors.password ? "border-red-500 focus:ring-red-500" : ""
                    }`}
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                        message: "Must contain uppercase, lowercase & number",
                      },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <FaEyeSlash size={20} />
                    ) : (
                      <FaEye size={20} />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    className={`input-blood pr-12 ${
                      errors.confirmPassword
                        ? "border-red-500 focus:ring-red-500"
                        : ""
                    }`}
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === password || "Passwords do not match",
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash size={20} />
                    ) : (
                      <FaEye size={20} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            {/* Password Requirements */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 font-medium mb-2">
                Password Requirements:
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li className="flex items-center space-x-2">
                  <span
                    className={
                      password?.length >= 6 ? "text-green-500" : "text-gray-400"
                    }
                  >
                    {password?.length >= 6 ? "✓" : "○"}
                  </span>
                  <span>At least 6 characters</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span
                    className={
                      /[A-Z]/.test(password)
                        ? "text-green-500"
                        : "text-gray-400"
                    }
                  >
                    {/[A-Z]/.test(password) ? "✓" : "○"}
                  </span>
                  <span>One uppercase letter</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span
                    className={
                      /[a-z]/.test(password)
                        ? "text-green-500"
                        : "text-gray-400"
                    }
                  >
                    {/[a-z]/.test(password) ? "✓" : "○"}
                  </span>
                  <span>One lowercase letter</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span
                    className={
                      /\d/.test(password) ? "text-green-500" : "text-gray-400"
                    }
                  >
                    {/\d/.test(password) ? "✓" : "○"}
                  </span>
                  <span>One number</span>
                </li>
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={uploading}
              className="w-full bg-primary hover:bg-secondary text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <MdBloodtype size={20} />
                  <span>Register as Donor</span>
                </>
              )}
            </button>

            {/* Login Link */}
            <p className="text-center text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary font-semibold hover:underline"
              >
                Login here
              </Link>
            </p>
          </form>
        </div>

        {/* Blood Donation Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            By registering, you agree to be part of our blood donation
            community.
          </p>
          <div className="flex justify-center space-x-4 mt-4">
            {bloodGroups.map((group) => (
              <span
                key={group}
                className="bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded"
              >
                {group}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
