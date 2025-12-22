import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loading from "../../components/shared/Loading";
import CheckoutForm from "./CheckoutForm";

// Load Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Funding = () => {
  const axiosSecure = useAxiosSecure();
  const [showModal, setShowModal] = useState(false);

  // Fetch all funds
  const {
    data: funds = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["funds"],
    queryFn: async () => {
      const res = await axiosSecure.get("/funds");
      return res.data;
    },
  });

  // Calculate total
  const totalFunds = funds.reduce((sum, fund) => sum + fund.amount, 0);

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-2">Funding</h1>
        <p className="text-center text-gray-500 mb-6">
          Support our blood donation organization
        </p>

        <div className="bg-green-500 text-white p-6 rounded-lg text-center mb-6">
          <p className="text-lg">Total Funds Raised</p>
          <p className="text-4xl font-bold">${totalFunds.toFixed(2)}</p>
        </div>

        <div className="text-center mb-8">
          <button
            onClick={() => setShowModal(true)}
            className="bg-red-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-red-600"
          >
            Give Fund
          </button>
        </div>

        <h2 className="text-xl font-bold mb-4">Recent Donations</h2>

        {funds.length === 0 ? (
          <div className="bg-white p-6 rounded-lg text-center">
            <p className="text-gray-500">No donations yet. Be the first!</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">#</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Amount</th>
                  <th className="p-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {funds.map((fund, index) => (
                  <tr key={fund._id} className="border-t">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{fund.name}</td>
                    <td className="p-3 text-green-600 font-bold">
                      ${fund.amount}
                    </td>
                    <td className="p-3 text-gray-500">
                      {new Date(fund.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Give Fund</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 text-2xl"
              >
                ×
              </button>
            </div>

            <Elements stripe={stripePromise}>
              <CheckoutForm
                onSuccess={() => {
                  setShowModal(false);
                  refetch();
                }}
              />
            </Elements>
          </div>
        </div>
      )}
    </div>
  );
};

export default Funding;
