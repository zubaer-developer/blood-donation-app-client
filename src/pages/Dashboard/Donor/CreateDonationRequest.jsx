import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import { districts, upazilas, bloodGroups } from "../../../utils/districts";
import Loading from "../../../components/shared/Loading";

const CreateDonationRequest = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [loading, setLoading] = useState(false);

  // Check if user is blocked
  const { data: userData, isLoading } = useQuery({
    queryKey: ["userData", user?.email],
    queryFn: async () => {
      const res = await axiosPublic.get(`/users/${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  // Handle form submit
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
    };

    try {
      const res = await axiosSecure.post("/donation-requests", requestData);

      if (res.data.insertedId) {
        toast.success("Donation request created!");
        form.reset();
        navigate("/dashboard/my-donation-requests");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create request");
    }

    setLoading(false);
  };

  if (isLoading) return <Loading />;

  // If user is blocked
  if (userData?.status === "blocked") {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
        <p className="text-gray-600 mt-2">
          Your account is blocked. You cannot create donation requests.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Create Donation Request</h1>

      <div className="bg-white p-6 rounded shadow max-w-2xl">
        <form onSubmit={handleSubmit}>
          {/* Requester Name (Read Only) */}
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">
              Requester Name
            </label>
            <input
              type="text"
              value={user?.displayName || ""}
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
              value={user?.email || ""}
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
              required
              placeholder="Enter recipient name"
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
              required
              className="w-full border p-2 rounded"
            >
              <option value="">Select Blood Group</option>
              {bloodGroups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>

          {/* District */}
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">
              Recipient District *
            </label>
            <select
              name="recipientDistrict"
              required
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full border p-2 rounded"
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
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">
              Recipient Upazila *
            </label>
            <select
              name="recipientUpazila"
              required
              className="w-full border p-2 rounded"
            >
              <option value="">Select Upazila</option>
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
              required
              placeholder="Enter hospital name"
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
              required
              placeholder="Enter full address"
              className="w-full border p-2 rounded"
            />
          </div>

          {/* Donation Date */}
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">
              Donation Date *
            </label>
            <input
              type="date"
              name="donationDate"
              required
              className="w-full border p-2 rounded"
            />
          </div>

          {/* Donation Time */}
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">
              Donation Time *
            </label>
            <input
              type="time"
              name="donationTime"
              required
              className="w-full border p-2 rounded"
            />
          </div>

          {/* Request Message */}
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">
              Request Message *
            </label>
            <textarea
              name="requestMessage"
              required
              rows="3"
              placeholder="Why do you need blood?"
              className="w-full border p-2 rounded"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-500 text-white p-3 rounded hover:bg-red-600 mt-4"
          >
            {loading ? "Creating..." : "Create Request"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateDonationRequest;
