import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import { districts, upazilas, bloodGroups } from "../../../utils/districts";
import Loading from "../../../components/shared/Loading";
import { FaEdit, FaArrowLeft } from "react-icons/fa";

const EditDonationRequest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();

  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [loading, setLoading] = useState(false);

  // fetch existing request data
  const { data: request, isLoading } = useQuery({
    queryKey: ["donationRequest", id],
    queryFn: async () => {
      const res = await axiosPublic.get(`/donation-requests/${id}`);
      setSelectedDistrict(res.data.recipientDistrict);
      return res.data;
    },
  });

  // handle update submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target;
    const updatedData = {
      recipientName: form.recipientName.value,
      recipientDistrict: form.recipientDistrict.value,
      recipientUpazila: form.recipientUpazila.value,
      hospitalName: form.hospitalName.value,
      fullAddress: form.fullAddress.value,
      bloodGroup: form.bloodGroup.value,
      donationDate: form.donationDate.value,
      donationTime: form.donationTime.value,
      requestMessage: form.requestMessage.value,
    };

    try {
      const res = await axiosSecure.patch(
        `/donation-requests/${id}`,
        updatedData,
      );

      if (res.data.modifiedCount > 0) {
        toast.success("Request updated!");
        navigate("/dashboard/my-donation-requests");
      } else {
        toast.error("No changes made");
      }
    } catch (error) {
      toast.error("Failed to update");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 animate-fadeIn text-base-content">
      {/* header */}
      <div className="mb-10 text-center md:text-left border-b border-base-300 pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase flex items-center gap-3">
            <FaEdit className="text-primary" /> Edit Request
          </h1>
          <p className="text-sm opacity-50 font-medium mt-1">
            Update recipient or schedule information
          </p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="btn btn-ghost btn-sm gap-2"
        >
          <FaArrowLeft /> Back
        </button>
      </div>

      <div className="bg-base-100 border border-base-200 shadow-xl rounded-[2rem] overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
            {/* requester info (readonly) */}
            <div className="form-control">
              <label className="label uppercase text-[11px] font-black opacity-50">
                Requester Name
              </label>
              <input
                type="text"
                value={request?.requesterName || ""}
                disabled
                className="input input-bordered bg-base-200 rounded-xl font-bold w-full"
              />
            </div>

            <div className="form-control">
              <label className="label uppercase text-[11px] font-black opacity-50">
                Requester Email
              </label>
              <input
                type="email"
                value={request?.requesterEmail || ""}
                disabled
                className="input input-bordered bg-base-200 rounded-xl font-bold w-full"
              />
            </div>

            {/* recipient inputs */}
            <div className="form-control">
              <label className="label uppercase text-[11px] font-black opacity-50">
                Recipient Name *
              </label>
              <input
                type="text"
                name="recipientName"
                defaultValue={request?.recipientName}
                required
                className="input input-bordered rounded-xl font-bold w-full focus:border-primary"
              />
            </div>

            <div className="form-control">
              <label className="label uppercase text-[11px] font-black opacity-50">
                Blood Group *
              </label>
              <select
                name="bloodGroup"
                defaultValue={request?.bloodGroup}
                required
                className="select select-bordered rounded-xl font-bold w-full"
              >
                {bloodGroups.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </div>

            {/* location selects */}
            <div className="form-control">
              <label className="label uppercase text-[11px] font-black opacity-50">
                District *
              </label>
              <select
                name="recipientDistrict"
                defaultValue={request?.recipientDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                required
                className="select select-bordered rounded-xl font-bold w-full"
              >
                {districts.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label uppercase text-[11px] font-black opacity-50">
                Upazila *
              </label>
              <select
                name="recipientUpazila"
                defaultValue={request?.recipientUpazila}
                required
                className="select select-bordered rounded-xl font-bold w-full"
              >
                {upazilas[selectedDistrict]?.map((u, i) => (
                  <option key={i} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label uppercase text-[11px] font-black opacity-50">
                Hospital Name *
              </label>
              <input
                type="text"
                name="hospitalName"
                defaultValue={request?.hospitalName}
                required
                className="input input-bordered rounded-xl font-bold w-full"
              />
            </div>

            <div className="form-control">
              <label className="label uppercase text-[11px] font-black opacity-50">
                Full Address *
              </label>
              <input
                type="text"
                name="fullAddress"
                defaultValue={request?.fullAddress}
                required
                className="input input-bordered rounded-xl font-bold w-full"
              />
            </div>

            {/* schedule */}
            <div className="form-control">
              <label className="label uppercase text-[11px] font-black opacity-50">
                Donation Date *
              </label>
              <input
                type="date"
                name="donationDate"
                defaultValue={request?.donationDate}
                required
                className="input input-bordered rounded-xl font-bold w-full"
              />
            </div>

            <div className="form-control">
              <label className="label uppercase text-[11px] font-black opacity-50">
                Donation Time *
              </label>
              <input
                type="time"
                name="donationTime"
                defaultValue={request?.donationTime}
                required
                className="input input-bordered rounded-xl font-bold w-full"
              />
            </div>

            {/* message box */}
            <div className="form-control md:col-span-2">
              <label className="label uppercase text-[11px] font-black opacity-50">
                Request Message *
              </label>
              <textarea
                name="requestMessage"
                defaultValue={request?.requestMessage}
                required
                rows="3"
                className="textarea textarea-bordered rounded-xl font-bold w-full h-32"
              ></textarea>
            </div>
          </div>

          {/* action buttons */}
          <div className="flex flex-col md:flex-row gap-4 mt-10">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn btn-outline border-base-300 rounded-xl flex-1 uppercase font-black"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary rounded-xl flex-1 text-lg font-black uppercase tracking-widest shadow-lg shadow-primary/20"
            >
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDonationRequest;
