import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { FaDollarSign, FaShieldAlt, FaHeart } from "react-icons/fa";

const CheckoutForm = ({ onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const quickAmounts = [10, 25, 50, 100];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    if (!amount || amount < 1) {
      setError("Min donation is $1. Every bit helps!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // create payment intent
      const { data } = await axiosSecure.post("/create-payment-intent", {
        amount: parseFloat(amount),
      });

      // confirm payment with stripe
      const { paymentIntent, error: confirmError } =
        await stripe.confirmCardPayment(data.clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: user?.displayName || "Anonymous",
              email: user?.email,
            },
          },
        });

      if (confirmError) {
        setError(confirmError.message);
        setLoading(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        const fundData = {
          name: user?.displayName || "Anonymous",
          email: user?.email,
          amount: parseFloat(amount),
          transactionId: paymentIntent.id,
          createdAt: new Date(),
        };

        // save to database
        await axiosSecure.post("/funds", fundData);
        toast.success("Hero Status Unlocked! Thank you.");
        onSuccess();
      }
    } catch (err) {
      setError("Connection lost. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* amount selector chips */}
      <div>
        <label className="label mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest opacity-40">
            Select Amount
          </span>
        </label>
        <div className="grid grid-cols-4 gap-3">
          {quickAmounts.map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => {
                setAmount(amt);
                setError("");
              }}
              className={`py-3 rounded-xl font-black transition-all border-2 text-sm ${
                amount == amt
                  ? "bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/20 scale-105"
                  : "bg-base-200 border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              ${amt}
            </button>
          ))}
        </div>
      </div>

      {/* custom amount input */}
      <div className="form-control">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none group-focus-within:text-red-500 transition-colors">
            <FaDollarSign className="text-xl" />
          </div>
          <input
            type="number"
            min="1"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setError("");
            }}
            placeholder="Custom amount"
            className="input input-lg w-full pl-12 bg-base-200 border-none rounded-2xl font-black text-2xl focus:ring-4 ring-red-500/10 transition-all"
            required
          />
        </div>
      </div>

      {/* dark card container for stripe */}
      <div className="p-6 rounded-[2rem] bg-neutral text-white border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <span className="text-[9px] font-black tracking-widest opacity-40 uppercase">
            Card Details
          </span>
          <FaShieldAlt className="text-red-500 opacity-50" />
        </div>

        <div className="bg-white p-4 rounded-xl shadow-inner">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#1f2937",
                  fontFamily: "inherit",
                  "::placeholder": { color: "#9ca3af" },
                },
                invalid: { color: "#ef4444" },
              },
            }}
          />
        </div>
      </div>

      {/* error alert */}
      {error && (
        <div className="bg-red-500/10 p-3 rounded-xl border border-red-500/20 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
          <p className="text-red-500 text-[11px] font-bold uppercase tracking-tight">
            {error}
          </p>
        </div>
      )}

      {/* submit button area */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={!stripe || loading}
          className="btn btn-primary btn-block h-16 rounded-2xl shadow-xl shadow-red-500/20 hover:scale-[1.02] active:scale-95 transition-all border-none text-white font-black text-lg group"
        >
          {loading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            <div className="flex items-center gap-3">
              <span>Complete Funding</span>
              <FaHeart className="text-white group-hover:scale-125 transition-transform duration-300" />
            </div>
          )}
        </button>

        <div className="flex flex-col items-center gap-2 mt-6 opacity-30">
          <div className="flex items-center gap-2">
            <FaShieldAlt className="text-[10px]" />
            <span className="text-[9px] uppercase font-bold tracking-[0.2em]">
              Secure PCI-DSS Payment
            </span>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CheckoutForm;
