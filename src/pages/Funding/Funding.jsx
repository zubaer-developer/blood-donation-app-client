import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loading from "../../components/shared/Loading";
import CheckoutForm from "./CheckoutForm";
import {
  FaDonate,
  FaHistory,
  FaHeart,
  FaTimes,
  FaShieldAlt,
} from "react-icons/fa";
import { MdBloodtype } from "react-icons/md";

// load stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Funding = () => {
  const axiosSecure = useAxiosSecure();
  const [showModal, setShowModal] = useState(false);

  // fetch funds data
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

  // calculate total amount
  const totalFunds = funds.reduce((sum, fund) => sum + fund.amount, 0);

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-base-100 py-16 transition-colors duration-300">
      <title>Funding | Support BloodBank</title>

      <div className="max-w-6xl mx-auto px-4">
        {/* page header */}
        <div className="text-center mb-16 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 opacity-5 -z-10">
            <MdBloodtype className="text-[12rem] text-red-500" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">
            Our <span className="text-red-500">Impact</span>
          </h1>
          <p className="text-base-content/60 max-w-xl mx-auto font-medium">
            Your financial support helps us maintain the infrastructure needed
            to bridge the gap between donors and patients.
          </p>
        </div>

        {/* main stats and action card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
          <div className="lg:col-span-2 card bg-neutral p-10 text-white flex flex-col md:flex-row items-center justify-between rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50 mb-2">
                Total Funds Raised
              </p>
              <h2 className="text-6xl md:text-7xl font-black tracking-tighter">
                ${totalFunds.toLocaleString()}
              </h2>
              <div className="mt-4 flex items-center gap-2 font-bold text-red-500">
                <FaHeart className="animate-pulse" /> Driven by community love
              </div>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="btn btn-lg bg-red-500 hover:bg-red-600 border-none text-white rounded-2xl px-12 mt-8 md:mt-0 shadow-xl shadow-red-500/20 font-black relative z-10"
            >
              <FaDonate className="text-xl" /> Donate Now
            </button>

            <div className="absolute top-0 right-0 p-10 opacity-5">
              <MdBloodtype className="text-9xl" />
            </div>
          </div>

          {/* security badge card */}
          <div className="card bg-base-200 p-8 rounded-[2.5rem] border border-base-300 flex flex-col justify-center items-center text-center">
            <FaShieldAlt className="text-5xl text-red-500 mb-4" />
            <h3 className="font-black text-xl mb-1">Secure Payments</h3>
            <p className="text-sm opacity-50 font-medium">
              All transactions are encrypted and processed securely via Stripe.
            </p>
          </div>
        </div>

        {/* contribution history table */}
        <div className="space-y-8">
          <div className="flex items-center justify-between border-b border-base-200 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
                <FaHistory className="text-xl" />
              </div>
              <h2 className="text-3xl font-black tracking-tight uppercase">
                History
              </h2>
            </div>
            <div className="badge badge-lg bg-base-200 border-none font-bold p-4">
              {funds.length} Contributions
            </div>
          </div>

          {funds.length === 0 ? (
            <div className="py-20 text-center bg-base-200/50 rounded-[3rem] border-2 border-dashed border-base-300">
              <p className="text-xl font-bold opacity-30 italic">
                No donations found in the ledger.
              </p>
            </div>
          ) : (
            <div className="bg-base-100 rounded-[2.5rem] border border-base-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr className="bg-base-200/50 text-sm uppercase tracking-widest font-black border-none">
                      <th className="py-6 px-8">Contributor</th>
                      <th>Method</th>
                      <th>Amount</th>
                      <th className="text-right px-8">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-base-100">
                    {funds.map((fund) => (
                      <tr
                        key={fund._id}
                        className="hover:bg-base-200/30 transition-all group"
                      >
                        <td className="py-6 px-8">
                          <div className="font-black text-lg group-hover:text-red-500 transition-colors">
                            {fund.name}
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-ghost font-bold opacity-50">
                            Card/Stripe
                          </span>
                        </td>
                        <td>
                          <div className="font-black text-red-500 text-lg">
                            ${fund.amount.toFixed(2)}
                          </div>
                        </td>
                        <td className="text-right px-8 font-bold opacity-40">
                          {new Date(fund.createdAt).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* payment modal */}
      {showModal && (
        <div className="modal modal-open backdrop-blur-md transition-all z-50">
          <div className="modal-box p-0 bg-base-100 rounded-[2.5rem] overflow-hidden border border-base-200 shadow-2xl max-w-lg relative">
            {/* modal header area */}
            <div className="bg-neutral p-10 text-white text-center relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-red-500 flex items-center justify-center transition-all z-20"
              >
                <FaTimes />
              </button>
              <MdBloodtype className="text-6xl text-red-500 mx-auto mb-4" />
              <h2 className="text-3xl font-black tracking-tighter uppercase">
                Support Us
              </h2>
              <p className="text-xs font-black tracking-widest opacity-40 mt-2 uppercase">
                Safe & Encrypted
              </p>
            </div>

            {/* payment form area (CheckoutForm handles the button) */}
            <div className="p-10">
              <Elements stripe={stripePromise}>
                <CheckoutForm
                  onSuccess={() => {
                    setShowModal(false);
                    refetch();
                  }}
                />
              </Elements>

              {/* stripe branding */}
              <div className="mt-8 pt-6 border-t border-base-200 flex flex-col items-center gap-4">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg"
                  className="h-5 grayscale opacity-30"
                  alt="Stripe"
                />
                <p className="text-[10px] font-bold opacity-20 uppercase tracking-[0.2em]">
                  Powered by Stripe Inc.
                </p>
              </div>
            </div>
          </div>
          {/* backdrop click to close */}
          <div
            className="fixed inset-0 -z-10"
            onClick={() => setShowModal(false)}
          ></div>
        </div>
      )}
    </div>
  );
};

export default Funding;
