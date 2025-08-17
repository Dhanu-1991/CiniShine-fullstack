import { useState, useEffect } from "react";
// Import icons from react-icons and for the alert
import {
  FaEnvelope,
  FaPhone,
  FaYoutube,
  FaInstagram,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import axios from "axios";

// This can be in a separate file if you prefer
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// A simple, reusable alert component
const FlowbiteAlert = ({ message, type, onclose }) => {
  const isSuccess = type === "success";

  const baseClasses = "flex items-center p-4 mb-4 text-sm rounded-lg shadow-lg";
  const typeClasses = isSuccess
    ? "text-green-800 bg-green-50 dark:bg-gray-800 dark:text-green-400"
    : "text-red-800 bg-red-50 dark:bg-gray-800 dark:text-red-400";

  return (
    <div className={`${baseClasses} ${typeClasses}`} role="alert">
      {isSuccess ? (
        <FaCheckCircle className="flex-shrink-0 inline w-4 h-4 me-3" />
      ) : (
        <FaTimesCircle className="flex-shrink-0 inline w-4 h-4 me-3" />
      )}
      <span className="font-medium">{message}</span>
    </div>
  );
};

export default function ContactUs() {
  const [enquiry, setEnquiry] = useState({ email: "", message: "" });
  const [feedback, setFeedback] = useState({ email: "", message: "" });

  // State to manage the alert
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "success", // 'success' or 'error'
  });

  // useEffect to automatically hide the alert after 3 seconds
  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => {
        setAlert({ ...alert, show: false });
      }, 3000);
      return () => clearTimeout(timer); // Cleanup timer on component unmount or if alert changes
    }
  }, [alert]);

  const handleEnquiryChange = (e) => {
    const { name, value } = e.target;
    setEnquiry((prev) => ({ ...prev, [name]: value }));
  };

  const handleFeedbackChange = (e) => {
    const { name, value } = e.target;
    setFeedback((prev) => ({ ...prev, [name]: value }));
  };

  const handleEnquirySubmit = (e) => {
    e.preventDefault();
    API.post("/api/v1/contact/enquiry", enquiry)
      .then((response) => {
        setAlert({
          show: true,
          message: "Enquiry submitted successfully!",
          type: "success",
        });
        setEnquiry({ email: "", message: "" }); // Reset form
      })
      .catch((error) => {
        console.error("Error submitting enquiry:", error);
        setAlert({
          show: true,
          message: "Failed to submit enquiry.",
          type: "error",
        });
      });
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    API.post("/api/v1/contact/feedback", feedback)
      .then((response) => {
        setAlert({
          show: true,
          message: "Feedback submitted successfully!",
          type: "success",
        });
        setFeedback({ email: "", message: "" }); // Reset form
      })
      .catch((error) => {
        console.error("Error submitting feedback:", error);
        setAlert({
          show: true,
          message: "Failed to submit feedback.",
          type: "error",
        });
      });
  };

  const commonInputStyles =
    "w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100";

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-black py-12 px-4 sm:px-6 lg:px-8">
      {/* Alert Container */}
      <div className="fixed top-5 right-5 z-50 transition-transform duration-300">
        {alert.show && (
          <FlowbiteAlert
            message={alert.message}
            type={alert.type}
            onclose={() => setAlert({ ...alert, show: false })}
          />
        )}
      </div>

      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
        {/* Logo above Contact Us */}
        <div className="flex flex-col items-center mb-4">
          <img
            src="/logo.png"
            alt="Brand Logo"
            className="h-28 w-28 rounded-2xl mb-2 drop-shadow-lg" // Increased size and radius
          />
        </div>
        {/* Changed heading color for Contact Us */}
        <h1 className="text-4xl lg:text-5xl font-extrabold text-center text-blue-700 dark:text-blue-300 mb-8">
          Contact Us
        </h1>

        <div className="flex flex-col md:flex-row gap-12 mb-12">
          {/* Contact Info Section */}
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-4">
              <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 rounded-full p-3">
                <FaEnvelope size={20} />
              </span>
              <a
                href="mailto:info@yourbrand.com"
                className="text-lg text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                info@yourbrand.com
              </a>
            </div>
            <div className="flex items-center gap-4">
              <span className="bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-300 rounded-full p-3">
                <FaPhone size={20} />
              </span>
              <a
                href="tel:+1234567890"
                className="text-lg text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 transition"
              >
                +1 234 567 890
              </a>
            </div>
            <div className="flex items-center gap-4">
              <span className="bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300 rounded-full p-3">
                <FaYoutube size={20} />
              </span>
              <a
                href="https://youtube.com/yourbrand"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg text-gray-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400 transition"
              >
                /yourbrand
              </a>
            </div>
            <div className="flex items-center gap-4">
              <span className="bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-300 rounded-full p-3">
                <FaInstagram size={20} />
              </span>
              <a
                href="https://instagram.com/yourbrand"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg text-gray-700 dark:text-gray-200 hover:text-pink-600 dark:hover:text-pink-400 transition"
              >
                @yourbrand
              </a>
            </div>
          </div>

          {/* Image Section */}
          <div className="flex-1 flex items-center justify-center">
            <img
              src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/contact/contact-us.svg"
              alt="Contact"
              className="w-64 h-64 md:w-80 md:h-80 object-contain"
            />
          </div>
        </div>

        {/* Forms Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Enquiry Form */}
          <div>
            <h2 className="text-3xl font-bold text-blue-700 dark:text-blue-300 mb-2">
              Send an Enquiry
            </h2>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              Our team will get back to you within{" "}
              <span className="font-semibold text-purple-600 dark:text-purple-300">
                48 hours
              </span>
              .
            </p>
            <form onSubmit={handleEnquirySubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="enquiry-email"
                  className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Your Email
                </label>
                <input
                  type="email"
                  id="enquiry-email"
                  name="email"
                  className={commonInputStyles}
                  placeholder="you@example.com"
                  value={enquiry.email}
                  onChange={handleEnquiryChange}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="enquiry-message"
                  className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Your Message
                </label>
                <textarea
                  id="enquiry-message"
                  name="message"
                  className={commonInputStyles}
                  rows={4}
                  placeholder="Type your enquiry here..."
                  value={enquiry.message}
                  onChange={handleEnquiryChange}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full text-white font-bold px-6 py-3 rounded-lg shadow-lg hover:scale-105 transition-transform bg-gradient-to-r from-blue-500 to-purple-600"
              >
                Submit Enquiry
              </button>
            </form>
          </div>

          {/* Feedback Form */}
          <div>
            <h2 className="text-3xl font-bold text-pink-700 dark:text-pink-300 mb-2">
              Share Feedback
            </h2>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              We value your feedback! Let us know your thoughts.
            </p>
            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="feedback-email"
                  className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Your Email
                </label>
                <input
                  type="email"
                  id="feedback-email"
                  name="email"
                  className={commonInputStyles}
                  placeholder="you@example.com"
                  value={feedback.email}
                  onChange={handleFeedbackChange}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="feedback-message"
                  className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Your Feedback
                </label>
                <textarea
                  id="feedback-message"
                  name="message"
                  className={commonInputStyles}
                  rows={4}
                  placeholder="Share your feedback here..."
                  value={feedback.message}
                  onChange={handleFeedbackChange}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full text-white font-bold px-6 py-3 rounded-lg shadow-lg hover:scale-105 transition-transform bg-gradient-to-r from-pink-500 to-orange-500"
              >
                Submit Feedback
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
