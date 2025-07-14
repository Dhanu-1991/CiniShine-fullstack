// src/pages/PaymentStatus.jsx
import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function PaymentStatus() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");
  const [status, setStatus] = useState("Checking...");

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.post("https://your-backend.com/api/v1/payments/payment-verify", { orderId });
        setStatus(res.data.order_status || "Unknown");
      } catch (error) {
        console.error("Error verifying payment:", error);
        setStatus("Error verifying payment");
      }
    };

    if (orderId) {
      verify();
    }
  }, [orderId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Payment Status</h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">{status}</p>
      </div>
    </div>
  );
}
