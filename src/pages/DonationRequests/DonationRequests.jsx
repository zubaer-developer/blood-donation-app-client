import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import Loading from "../../components/shared/Loading";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaEye,
  FaPlusCircle,
} from "react-icons/fa";
import { MdBloodtype } from "react-icons/md";

const DonationRequests = () => {
  const axiosPublic = useAxiosPublic();

  // fetch data
  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["pendingDonationRequests"],
    queryFn: async () => {
      const response = await axiosPublic.get("/donation-requests/pending");
      return response.data;
    },
  });

  // simple date format
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-base-100 py-16 transition-colors duration-300">
      <title>Blood Donation Requests | BloodBank</title>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* header section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
          <div className="text-left">
            <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter">
              Urgent <span className="text-red-500">Needs</span>
            </h1>
            <p className="text-base-content/60 font-medium">
              Every drop counts. Check the requests below to save a life today.
            </p>
          </div>

          <Link
            to="/dashboard/create-donation-request"
            className="btn btn-primary btn-lg rounded-2xl px-8 shadow-xl shadow-primary/20 hover:scale-105 transition-all"
          >
            <FaPlusCircle /> Post Request
          </Link>
        </div>

        {/* summary badge */}
        <div className="mb-8">
          <div className="badge badge-lg bg-base-200 border-none p-6 font-bold gap-2 rounded-xl">
            <span className="w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
            Total Pending: {requests.length}
          </div>
        </div>

        {/* check empty state */}
        {requests.length === 0 ? (
          <div className="text-center py-32 bg-base-200 rounded-[3rem] border-4 border-dashed border-base-300">
            <div className="bg-white dark:bg-base-300 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <MdBloodtype className="text-5xl text-red-500 opacity-20" />
            </div>
            <h3 className="text-2xl font-bold opacity-40">
              No Pending Requests
            </h3>
          </div>
        ) : (
          /* modern table container */
          <div className="bg-base-100 shadow-sm rounded-[2rem] overflow-hidden border border-base-200">
            <div className="overflow-x-auto">
              <table className="table w-full border-collapse">
                {/* table head */}
                <thead>
                  <tr className="bg-base-200/50 text-sm uppercase tracking-widest border-b border-base-200">
                    <th className="py-6 px-8">Recipient</th>
                    <th>Location</th>
                    <th className="text-center">Blood Group</th>
                    <th>Schedule</th>
                    <th className="text-right px-8">Action</th>
                  </tr>
                </thead>
                {/* table body */}
                <tbody className="divide-y divide-base-100">
                  {requests.map((request) => (
                    <tr
                      key={request._id}
                      className="hover:bg-base-200/30 transition-all group"
                    >
                      <td className="py-6 px-8">
                        <div className="font-black text-lg group-hover:text-primary transition-colors">
                          {request.recipientName}
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2 font-bold opacity-70">
                          <FaMapMarkerAlt className="text-red-500" />
                          <span>
                            {request.recipientUpazila},{" "}
                            {request.recipientDistrict}
                          </span>
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="badge bg-red-500 border-none text-white font-black p-4 rounded-xl">
                          {request.bloodGroup}
                        </div>
                      </td>
                      <td>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm font-bold">
                            <FaCalendarAlt className="opacity-40" />
                            {formatDate(request.donationDate)}
                          </div>
                          <div className="flex items-center gap-2 text-xs font-medium opacity-50">
                            <FaClock />
                            {request.donationTime}
                          </div>
                        </div>
                      </td>
                      <td className="text-right px-8">
                        <Link
                          to={`/donation-requests/${request._id}`}
                          className="btn btn-sm btn-ghost hover:bg-primary hover:text-white rounded-xl"
                        >
                          <FaEye /> Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* bottom cta section */}
        <div className="mt-20 relative overflow-hidden bg-neutral rounded-[3rem] p-12 text-center shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
            <MdBloodtype className="text-9xl text-red-500" />
          </div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 italic">
              CAN'T FIND A MATCH?
            </h2>
            <p className="mb-10 text-neutral-content/60 font-medium">
              Don't wait. Create your own request and our verified donors
              network will be alerted immediately.
            </p>
            <Link
              to="/dashboard/create-donation-request"
              className="btn btn-lg bg-red-500 border-none text-white hover:bg-red-600 px-12 rounded-2xl font-black shadow-xl"
            >
              Request Blood Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationRequests;
