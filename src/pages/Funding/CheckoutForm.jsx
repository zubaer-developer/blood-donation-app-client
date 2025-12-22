import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const CheckoutForm = ({ onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (!amount || amount < 1) {
      setError("Please enter a valid amount (minimum $1)");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Create payment intent
      const { data } = await axiosSecure.post("/create-payment-intent", {
        amount: parseFloat(amount),
      });

      // Confirm payment
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
        // Save to database
        const fundData = {
          name: user?.displayName || "Anonymous",
          email: user?.email,
          amount: parseFloat(amount),
          transactionId: paymentIntent.id,
        };

        await axiosSecure.post("/funds", fundData);

        toast.success("Thank you for your donation!");
        onSuccess();
      }
    } catch (err) {
      console.error(err);
      setError("Payment failed. Please try again.");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Amount (USD)</label>
        <input
          type="number"
          min="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="w-full border p-3 rounded"
          required
        />
      </div>

      {/* Card Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Card Details</label>
        <div className="border p-3 rounded">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#9e2146",
                },
              },
            }}
          />
        </div>
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-green-500 text-white p-3 rounded font-semibold hover:bg-green-600 disabled:opacity-50"
      >
        {loading ? "Processing..." : `Pay $${amount || "0"}`}
      </button>
    </form>
  );
};

export default CheckoutForm;
