import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loading from "../../components/shared/Loading";
import {
  FaArrowLeft,
  FaHospital,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaCommentDots,
  FaCheckCircle,
} from "react-icons/fa";
import { MdBloodtype } from "react-icons/md";

const DonationRequestDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // fetch data
  const {
    data: request,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["donationRequest", id],
    queryFn: async () => {
      const res = await axiosPublic.get(`/donation-requests/${id}`);
      return res.data;
    },
  });

  // handle donate logic
  const handleDonate = async () => {
    setLoading(true);
    try {
      const res = await axiosSecure.patch(`/donation-requests/status/${id}`, {
        status: "inprogress",
        donorName: user.displayName,
        donorEmail: user.email,
      });

      if (res.data.modifiedCount > 0) {
        toast.success("Donation confirmed! You are a hero.");
        setShowModal(false);
        refetch();
      }
    } catch (error) {
      toast.error("Failed to confirm donation");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <Loading />;

  if (!request) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <MdBloodtype className="text-7xl text-red-500 opacity-20" />
        <h2 className="text-2xl font-black opacity-50 tracking-tighter">
          Request Not Found
        </h2>
        <Link
          to="/donation-requests"
          className="btn btn-primary btn-sm rounded-xl"
        >
          Go Back
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 py-12 px-4 transition-colors">
      <title>Details | {request.recipientName}</title>

      <div className="max-w-4xl mx-auto">
        {/* navigation back */}
        <Link
          to="/donation-requests"
          className="btn btn-ghost btn-sm mb-8 gap-2 font-bold hover:bg-base-200 rounded-xl"
        >
          <FaArrowLeft /> Back to List
        </Link>

        <div className="card bg-base-100 shadow-2xl rounded-[2.5rem] overflow-hidden border border-base-200">
          {/* top banner section */}
          <div className="bg-neutral p-10 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12">
              <MdBloodtype className="text-9xl text-red-500" />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="text-center md:text-left">
                <div className="badge badge-error mb-4 font-black px-4 py-3 rounded-lg uppercase tracking-widest text-[10px]">
                  Urgent Request
                </div>
                <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tighter">
                  {request.recipientName}
                </h1>
                <p className="text-neutral-content/60 flex items-center justify-center md:justify-start gap-2 font-bold">
                  <FaHospital className="text-red-500" /> {request.hospitalName}
                </p>
              </div>

              <div className="flex flex-col items-center">
                <div className="text-5xl font-black bg-white text-red-500 w-28 h-28 flex items-center justify-center rounded-[2rem] shadow-2xl border-4 border-red-500/20">
                  {request.bloodGroup}
                </div>
                <div
                  className={`mt-4 px-6 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    request.status === "pending"
                      ? "bg-yellow-500 text-black"
                      : "bg-green-500 text-white"
                  }`}
                >
                  Status: {request.status}
                </div>
              </div>
            </div>
          </div>

          <div className="p-10">
            {/* info grid - themed as home page */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
              <DetailItem
                icon={<FaMapMarkerAlt className="text-red-500" />}
                label="Location"
                value={`${request.recipientUpazila}, ${request.recipientDistrict}`}
              />
              <DetailItem
                icon={<FaCalendarAlt className="text-red-500" />}
                label="Donation Date"
                value={request.donationDate}
              />
              <DetailItem
                icon={<FaClock className="text-red-500" />}
                label="Preferred Time"
                value={request.donationTime}
              />
              <DetailItem
                icon={<FaUser className="text-red-500" />}
                label="Requested By"
                value={request.requesterName}
              />
              <div className="md:col-span-2">
                <DetailItem
                  icon={<FaCommentDots className="text-red-500" />}
                  label="Emergency Note"
                  value={
                    request.requestMessage ||
                    "No specific instructions provided."
                  }
                />
              </div>
            </div>

            {/* donor assignment status */}
            {request.donorName && (
              <div className="flex items-center gap-4 p-6 bg-green-500/10 border border-green-500/20 rounded-3xl mb-10">
                <div className="bg-green-500 p-3 rounded-2xl text-white">
                  <FaCheckCircle className="text-2xl" />
                </div>
                <div>
                  <h3 className="font-black text-green-600 uppercase text-xs tracking-widest mb-1">
                    Life Saver Found
                  </h3>
                  <div className="font-bold opacity-80">
                    {request.donorName}{" "}
                    <span className="mx-2 opacity-20">|</span>{" "}
                    {request.donorEmail}
                  </div>
                </div>
              </div>
            )}

            {/* action buttons */}
            <div className="flex justify-center border-t border-base-200 pt-10">
              {request.status === "pending" &&
              request.requesterEmail !== user?.email ? (
                <button
                  onClick={() => setShowModal(true)}
                  className="btn btn-primary btn-lg rounded-2xl px-16 shadow-xl shadow-primary/20 hover:scale-105 transition-all font-black text-white"
                >
                  Confirm Donation
                </button>
              ) : (
                <div className="bg-base-200 px-8 py-4 rounded-2xl text-sm font-bold opacity-50 italic border border-base-300">
                  {request.requesterEmail === user?.email
                    ? "Notice: You cannot donate to your own request."
                    : "Note: This request is already being handled or completed."}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* donation confirmation modal */}
      {showModal && (
        <div className="modal modal-open backdrop-blur-sm">
          <div className="modal-box bg-base-100 p-0 rounded-[2.5rem] overflow-hidden border border-base-200 shadow-2xl">
            <div className="bg-red-500 p-8 text-white text-center">
              <MdBloodtype className="text-5xl mx-auto mb-4" />
              <h3 className="font-black text-2xl uppercase tracking-tighter">
                Become a Hero
              </h3>
              <p className="text-sm opacity-80 font-medium">
                Are you sure you want to help {request.recipientName}?
              </p>
            </div>

            <div className="p-10">
              <div className="bg-base-200 p-6 rounded-2xl space-y-4 mb-6">
                <div className="flex justify-between items-center border-b border-base-300 pb-3">
                  <span className="text-[10px] font-black uppercase opacity-40">
                    Your Name
                  </span>
                  <span className="font-bold">{user?.displayName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase opacity-40">
                    Your Email
                  </span>
                  <span className="font-bold">{user?.email}</span>
                </div>
              </div>

              <div className="bg-yellow-500/10 p-4 rounded-xl border border-yellow-500/20 mb-8">
                <p className="text-[11px] text-center font-bold text-yellow-700 leading-relaxed uppercase">
                  Important: By confirming, you commit to arriving at the
                  hospital on the scheduled time.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="btn btn-outline border-base-300 rounded-xl font-bold"
                >
                  Go Back
                </button>
                <button
                  onClick={handleDonate}
                  disabled={loading}
                  className="btn btn-primary rounded-xl font-bold shadow-lg shadow-primary/20"
                >
                  {loading ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    "Confirm Now"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// custom detail item component
const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-5 p-5 rounded-3xl bg-base-200/40 border border-base-200 hover:border-red-500/20 transition-all group">
    <div className="p-4 bg-base-100 rounded-2xl shadow-sm group-hover:bg-red-500 group-hover:text-white transition-all text-xl">
      {icon}
    </div>
    <div>
      <p className="text-[10px] uppercase tracking-widest font-black opacity-30 mb-1">
        {label}
      </p>
      <p className="font-bold text-base-content/80 text-lg leading-tight tracking-tight">
        {value}
      </p>
    </div>
  </div>
);

export default DonationRequestDetails;
