// src/components/PricingDefault.jsx
import { Card, Button, Badge } from "flowbite-react";
import axios from "axios";
import { load } from "@cashfreepayments/cashfree-js";
import { useState, useEffect } from "react";
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // Optional: if using cookies
});
export default function PricingDefault() {
  const [cashfree, setCashfree] = useState(null);

  useEffect(() => {
    const initializeSDK = async () => {
      const cf = await load({ mode: "production" }); // or "sandbox" for test
      setCashfree(cf);
    };
    initializeSDK();
  }, []);

  const onClickPricing = async (price) => {
    if (!cashfree) {
      alert("⚠️ Cashfree SDK not initialized yet");
      return;
    }

    try {
      const res = await API.post("/api/v1/payments/payment", { price });

      if (!res.data?.payment_session_id || !res.data?.order_id) {
        throw new Error("Failed to receive session ID or order ID.");
      }

      const checkoutOptions = {
  paymentSessionId: res.data.payment_session_id, // ✅ must match backend
  redirectTarget: "_self",
  returnUrl: `${import.meta.env.VITE_FRONTEND_URL}/payment-status?order_id=${res.data.order_id}`,
};


      await cashfree.checkout(checkoutOptions);
    } catch (error) {
      console.error("Payment initiation failed:", error);
      alert("❌ Failed to initiate payment. Try again.");
    }
  };

  return (
    <div className="bg-gray-100 mt-20 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-10">
        Our Pricing Plans
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Basic Plan */}
        <Card className="text-center transform hover:scale-105 transition-transform duration-300">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Basic</h3>
          <p className="text-4xl font-extrabold mt-2 text-gray-800 dark:text-gray-300">₹499</p>
          <ul className="my-4 space-y-2 text-gray-700 dark:text-gray-400">
            <li>✔ Feature 1</li>
            <li>✔ Feature 2</li>
            <li>✔ Limited Access</li>
          </ul>
          <Button onClick={() => onClickPricing(499)}>Choose Plan</Button>
        </Card>

        {/* Pro Plan */}
        <Card className="text-center border-2 border-blue-500 transform hover:scale-105 transition-transform duration-300">
          <Badge color="blue" className="mb-2">Most Popular</Badge>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Pro</h3>
          <p className="text-4xl font-extrabold mt-2 text-gray-800 dark:text-gray-300">₹999</p>
          <ul className="my-4 space-y-2 text-gray-700 dark:text-gray-400">
            <li>✔ All Basic Features</li>
            <li>✔ More Storage</li>
            <li>✔ Support Access</li>
          </ul>
          <Button color="blue" onClick={() => onClickPricing(999)}>Choose Plan</Button>
        </Card>

        {/* Premium Plan */}
        <Card className="text-center transform hover:scale-105 transition-transform duration-300">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Premium</h3>
          <p className="text-4xl font-extrabold mt-2 text-gray-800 dark:text-gray-300">₹1499</p>
          <ul className="my-4 space-y-2 text-gray-700 dark:text-gray-400">
            <li>✔ Everything in Pro</li>
            <li>✔ Priority Support</li>
            <li>✔ Early Access to Jobs</li>
          </ul>
          <Button color="dark" onClick={() => onClickPricing(1499)}>Choose Plan</Button>
        </Card>
      </div>
    </div>
  );
}
