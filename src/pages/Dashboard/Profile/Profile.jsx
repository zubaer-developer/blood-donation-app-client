import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAuth from "../../../hooks/useAuth";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { districts, upazilas, bloodGroups } from "../../../utils/districts";
import Loading from "../../../components/shared/Loading";

const Profile = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState("");

  // Fetch user data
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

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const form = e.target;
    const updatedData = {
      name: form.name.value,
      bloodGroup: form.bloodGroup.value,
      district: form.district.value,
      upazila: form.upazila.value,
    };

    try {
      const res = await axiosSecure.patch(`/users/${user?.email}`, updatedData);

      if (res.data.modifiedCount > 0) {
        toast.success("Profile updated successfully!");
        setIsEditing(false);
        refetch();
      }
    } catch (error) {
      toast.error("Failed to update profile", error);
    }
    setSaving(false);
  };

  if (isLoading) return <Loading />;

  return (
    <div className="max-w-2xl mx-auto">
      <title>My Profile</title>
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      <div className="bg-white rounded-lg shadow p-6">
        {/* Avatar */}
        <div className="text-center mb-6">
          <img
            src={
              userData?.avatar ||
              user?.photoURL ||
              "https://i.ibb.co/MgsTCcv/user.jpg"
            }
            alt="avatar"
            className="w-24 h-24 rounded-full mx-auto border-4 border-red-500"
          />
          <h2 className="text-xl font-bold mt-2">{userData?.name}</h2>
          <p className="text-gray-500">{userData?.email}</p>
          <span className="inline-block mt-2 bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm capitalize">
            {userData?.role}
          </span>
        </div>

        {/* Edit Button */}
        {!isEditing && (
          <div className="text-right mb-4">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              ✏️ Edit Profile
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <table className="w-full">
            <tbody>
              {/* Email  */}
              <tr className="border-b">
                <td className="py-3 font-semibold">Email</td>
                <td className="py-3">
                  <input
                    type="email"
                    value={userData?.email || ""}
                    readOnly
                    className="w-full border p-2 rounded bg-gray-100"
                  />
                </td>
              </tr>

              {/* Name */}
              <tr className="border-b">
                <td className="py-3 font-semibold">Name</td>
                <td className="py-3">
                  <input
                    type="text"
                    name="name"
                    defaultValue={userData?.name || ""}
                    readOnly={!isEditing}
                    className={`w-full border p-2 rounded ${
                      !isEditing ? "bg-gray-100" : "bg-white"
                    }`}
                  />
                </td>
              </tr>

              {/* Blood Group */}
              <tr className="border-b">
                <td className="py-3 font-semibold">Blood Group</td>
                <td className="py-3">
                  {isEditing ? (
                    <select
                      name="bloodGroup"
                      defaultValue={userData?.bloodGroup || ""}
                      className="w-full border p-2 rounded"
                    >
                      {bloodGroups.map((group) => (
                        <option key={group} value={group}>
                          {group}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={userData?.bloodGroup || ""}
                      readOnly
                      className="w-full border p-2 rounded bg-gray-100"
                    />
                  )}
                </td>
              </tr>

              {/* District */}
              <tr className="border-b">
                <td className="py-3 font-semibold">District</td>
                <td className="py-3">
                  {isEditing ? (
                    <select
                      name="district"
                      defaultValue={userData?.district || ""}
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
                  ) : (
                    <input
                      type="text"
                      value={userData?.district || ""}
                      readOnly
                      className="w-full border p-2 rounded bg-gray-100"
                    />
                  )}
                </td>
              </tr>

              {/* Upazila */}
              <tr className="border-b">
                <td className="py-3 font-semibold">Upazila</td>
                <td className="py-3">
                  {isEditing ? (
                    <select
                      name="upazila"
                      defaultValue={userData?.upazila || ""}
                      className="w-full border p-2 rounded"
                    >
                      <option value="">Select Upazila</option>
                      {selectedDistrict &&
                        upazilas[selectedDistrict]?.map((u, i) => (
                          <option key={i} value={u}>
                            {u}
                          </option>
                        ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={userData?.upazila || ""}
                      readOnly
                      className="w-full border p-2 rounded bg-gray-100"
                    />
                  )}
                </td>
              </tr>

              {/* Status */}
              <tr>
                <td className="py-3 font-semibold">Status</td>
                <td className="py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      userData?.status === "active"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {userData?.status}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 border py-2 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;
