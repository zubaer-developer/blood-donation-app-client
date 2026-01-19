import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaLock,
  FaGoogle,
} from "react-icons/fa";
import { MdBloodtype } from "react-icons/md";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import useAxiosPublic from "../../hooks/useAxiosPublic";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signIn, googleSignIn, user, loading } = useAuth();
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // redirect logic
  useEffect(() => {
    if (!loading && user?.email) {
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, from]);

  // email login
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const result = await signIn(data.email, data.password);
      const userResponse = await axiosPublic.get(`/users/${data.email}`);
      const userData = userResponse.data;

      if (userData?.status === "blocked") {
        toast.error("Account blocked. Contact admin.");
        setIsSubmitting(false);
        return;
      }

      toast.success(`Welcome back, ${result.user.displayName || "User"}!`);
    } catch (error) {
      console.error(error);
      toast.error("Invalid credentials or connection error.");
      setIsSubmitting(false);
    }
  };

  // google login
  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    try {
      const result = await googleSignIn();
      const { email, displayName, photoURL } = result.user;

      const userData = {
        email,
        name: displayName || "Google User",
        avatar: photoURL || "https://i.ibb.co/MgsTCcv/user.jpg",
        bloodGroup: "",
        district: "",
        upazila: "",
      };

      await axiosPublic.post("/users", userData);
      const userResponse = await axiosPublic.get(`/users/${email}`);
      const dbUser = userResponse.data;

      if (dbUser?.status === "blocked") {
        toast.error("Account blocked. Contact admin.");
        setIsSubmitting(false);
        return;
      }

      toast.success(`Welcome, ${displayName || "User"}!`);
    } catch (error) {
      toast.error("Google sign-in failed.");
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-red-500"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center py-20 px-4">
      <title>Login | BloodBank</title>

      <div className="max-w-md w-full">
        {/* brand logo */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex flex-col items-center group">
            <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/20 group-hover:scale-110 transition-transform">
              <MdBloodtype className="text-white text-4xl" />
            </div>
            <h1 className="text-3xl font-black mt-4 tracking-tighter">
              Blood<span className="text-red-500">Bank</span>
            </h1>
          </Link>
          <p className="text-base-content/50 font-medium mt-2">
            Sign in to save lives
          </p>
        </div>

        {/* login card */}
        <div className="bg-base-100 rounded-[2.5rem] border border-base-200 shadow-2xl overflow-hidden">
          <div className="p-8 md:p-10">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* email field */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-1">
                  Email Address
                </label>
                <div className="relative mt-2">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/30" />
                  <input
                    type="email"
                    placeholder="name@example.com"
                    className={`w-full bg-base-200 border-none rounded-2xl py-4 pl-12 pr-4 font-bold focus:ring-4 ring-red-500/10 transition-all ${errors.email ? "ring-red-500/20 text-red-500" : ""}`}
                    {...register("email", { required: "Email is required" })}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-[10px] font-bold mt-2 ml-1 uppercase">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* password field */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-1">
                  Password
                </label>
                <div className="relative mt-2">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/30" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`w-full bg-base-200 border-none rounded-2xl py-4 pl-12 pr-12 font-bold focus:ring-4 ring-red-500/10 transition-all ${errors.password ? "ring-red-500/20 text-red-500" : ""}`}
                    {...register("password", {
                      required: "Password is required",
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
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    className="text-[10px] font-black uppercase text-red-500 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>

              {/* sign in button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-block h-14 bg-red-500 hover:bg-red-600 border-none text-white rounded-2xl font-black text-lg shadow-xl shadow-red-500/20 mt-4 transition-all active:scale-95"
              >
                {isSubmitting ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Sign In"
                )}
              </button>

              {/* social login */}
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-base-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-base-100 px-4 text-[10px] font-black uppercase opacity-30 tracking-widest">
                    Or login with
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isSubmitting}
                className="btn btn-block h-14 bg-base-100 border-2 border-base-200 hover:bg-base-200 text-base-content rounded-2xl font-black transition-all"
              >
                <FaGoogle className="text-red-500 text-lg mr-2" />
                Google
              </button>
            </form>
          </div>

          {/* footer link */}
          <div className="bg-base-200 py-6 text-center">
            <p className="text-sm font-bold opacity-50">
              New here?{" "}
              <Link to="/register" className="text-red-500 hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
