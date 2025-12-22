import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import { districts, upazilas, bloodGroups } from "../../../utils/districts";
import Loading from "../../../components/shared/Loading";

const EditDonationRequest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();

  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch request data
  const { data: request, isLoading } = useQuery({
    queryKey: ["donationRequest", id],
    queryFn: async () => {
      const res = await axiosPublic.get(`/donation-requests/${id}`);
      setSelectedDistrict(res.data.recipientDistrict);
      return res.data;
    },
  });

  // Handle form submit
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
        updatedData
      );

      if (res.data.modifiedCount > 0) {
        toast.success("Request updated!");
        navigate("/dashboard/my-donation-requests");
      }
    } catch (error) {
      toast.error("Failed to update", error);
    }

    setLoading(false);
  };

  if (isLoading) return <Loading />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Donation Request</h1>

      <div className="bg-white p-6 rounded shadow max-w-2xl">
        <form onSubmit={handleSubmit}>
          {/* Requester Name (Read Only) */}
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">
              Requester Name
            </label>
            <input
              type="text"
              value={request?.requesterName || ""}
              disabled
              className="w-full border p-2 rounded bg-gray-100"
            />
          </div>

          {/* Requester Email (Read Only) */}
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">
              Requester Email
            </label>
            <input
              type="email"
              value={request?.requesterEmail || ""}
              disabled
              className="w-full border p-2 rounded bg-gray-100"
            />
          </div>

          {/* Recipient Name */}
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">
              Recipient Name *
            </label>
            <input
              type="text"
              name="recipientName"
              defaultValue={request?.recipientName}
              required
              className="w-full border p-2 rounded"
            />
          </div>

          {/* Blood Group */}
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">
              Blood Group *
            </label>
            <select
              name="bloodGroup"
              defaultValue={request?.bloodGroup}
              required
              className="w-full border p-2 rounded"
            >
              {bloodGroups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>

          {/* District */}
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">District *</label>
            <select
              name="recipientDistrict"
              defaultValue={request?.recipientDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              required
              className="w-full border p-2 rounded"
            >
              {districts.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Upazila */}
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Upazila *</label>
            <select
              name="recipientUpazila"
              defaultValue={request?.recipientUpazila}
              required
              className="w-full border p-2 rounded"
            >
              {upazilas[selectedDistrict]?.map((u, i) => (
                <option key={i} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>

          {/* Hospital Name */}
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">
              Hospital Name *
            </label>
            <input
              type="text"
              name="hospitalName"
              defaultValue={request?.hospitalName}
              required
              className="w-full border p-2 rounded"
            />
          </div>

          {/* Full Address */}
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">
              Full Address *
            </label>
            <input
              type="text"
              name="fullAddress"
              defaultValue={request?.fullAddress}
              required
              className="w-full border p-2 rounded"
            />
          </div>

          {/* Date */}
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">
              Donation Date *
            </label>
            <input
              type="date"
              name="donationDate"
              defaultValue={request?.donationDate}
              required
              className="w-full border p-2 rounded"
            />
          </div>

          {/* Time */}
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">
              Donation Time *
            </label>
            <input
              type="time"
              name="donationTime"
              defaultValue={request?.donationTime}
              required
              className="w-full border p-2 rounded"
            />
          </div>

          {/* Message */}
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">
              Request Message *
            </label>
            <textarea
              name="requestMessage"
              defaultValue={request?.requestMessage}
              required
              rows="3"
              className="w-full border p-2 rounded"
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 border p-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-500 text-white p-2 rounded"
            >
              {loading ? "Saving..." : "Update Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDonationRequest;
