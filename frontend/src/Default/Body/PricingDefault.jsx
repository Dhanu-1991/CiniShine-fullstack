import { Card, Button, Badge } from "flowbite-react";
import axios from "axios";
import { load } from "@cashfreepayments/cashfree-js";
import { useState, useEffect } from "react";

export default function PricingDefault() {
  const [cashfree, setCashfree] = useState(null);
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    const initializeSDK = async () => {
      const cf = await load({ mode: "production" }); // use "production" for live
      setCashfree(cf);
    };
    initializeSDK();
  }, []);

  const getSessionId = async (price) => {
    try {
      const res = await axios.post("http://localhost:5000/api/v1/payments/payment", { price });
      if (res.data?.payment_session_id) {
        setOrderId(res.data.order_id);
        return res.data.payment_session_id;
      } else {
        throw new Error("Session ID not received");
      }
    } catch (error) {
      console.error("Get session failed:", error);
    }
  };

  const verifyPayment = async (orderId) => {
    try {
      const res = await axios.post("http://localhost:5000/api/v1/payments/payment-verify", { orderId });
      if (res.data) {
        alert("✅ Payment Status: " + res.data.order_status);
      }
    } catch (error) {
      console.error("Verification failed:", error);
    }
  };

  const onClickPricing = async (price) => {
    if (!cashfree) {
      alert("⚠️ Cashfree SDK not initialized yet");
      return;
    }

    try {
      console.log("Initiating payment for price:", price);
      const sessionId = await getSessionId(price);
      const checkoutOptions = {
        paymentSessionId: sessionId,
        redirectTarget: "_self",
      };

      await cashfree.checkout(checkoutOptions);
      await verifyPayment(orderId);
    } catch (error) {
      console.error("Payment initiation failed:", error);
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
