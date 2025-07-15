import { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Label,
  TextInput,
  Checkbox,
  Alert,
} from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import loaderVideo from "../assets/loader.mp4";
import { HiCheckCircle, HiExclamationCircle, HiEye, HiEyeOff } from "react-icons/hi";
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, 
});
export function Signin() {
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); 

  const navigate = useNavigate();

  const setDefault = () => {
    setContact("");
    setPassword("");
    setAgree(false);
    setShowPassword(false);
    setLoading(false);
    setMessage(null);
  };

  const isFormValid =
    contact.trim() !== "" && password.trim() !== "" && agree;

  // Auto-dismiss alerts after 3 seconds + redirect if success
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        if (message.type === "success") {
          setOpen(false);
        }
        setMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, navigate]);

  const signin = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setMessage({
        type: "failure",
        text: "Password must be at least 6 characters long.",
      });
      return;
    }

    const userData = {
      contact: contact.trim(),
      password: password.trim(),
    };

    try {
      setLoading(true);
      const signinRes = await API.post(
        "/api/v1/auth/authRoutes/signin",
        userData
      );

      if (signinRes.data.message === "Signin successful") {
        localStorage.setItem("token", signinRes.data.token);
        setDefault();
        setMessage({ type: "success", text: "Signin successful! Redirecting..." });
        window.location.href = "/dashboard";
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setMessage({
          type: "failure",
          text: "Invalid credentials. Please check your phone/email and password.",
        });
      } else if (error.response?.status === 404) {
        setDefault();
        setMessage({
          type: "failure",
          text: "Please signup if you are a new user.",
        });
      } else {
        setMessage({
          type: "failure",
          text: "Signin failed. Please try again.",
        });
      }
      console.error("Signin error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOnClose = () => {
    setDefault();
    setOpen(false);
    navigate("/");
  };
  const handleForgotPassword = () => {
    setDefault();
    navigate("forgot-password/");
  };

  return (
    <>
      <Modal
        show={open}
        onClose={handleOnClose}
        size="lg"
        popup
        position="center"
      >
        <div className="relative w-full h-full bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4 sm:p-8 flex flex-col justify-center transition-all duration-700 ease-in-out">

          {/* ✅ Loader Overlay */}
          {loading && (
            <div className="absolute inset-0 z-40 bg-black/40 flex items-center justify-center">
              <div className="rounded-full bg-white/10 p-6 shadow-lg">
                <video
                  src={loaderVideo}
                  autoPlay
                  loop
                  muted
                  className="w-24 h-24 rounded-full object-cover"
                />
              </div>
            </div>
          )}

          {/* ❌ Close Button */}
          <button
            type="button"
            onClick={handleOnClose}
            className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-fuchsia-600 font-bold focus:outline-none"
            aria-label="Close"
          >
            &times;
          </button>

          {/* ✅ Logo */}
          <div className="flex justify-center mt-4 mb-2">
            <img
              src="/logo.png"
              alt="App Logo"
              className="h-24 sm:h-28 w-auto object-contain"
            />
          </div>

          {/* ✅ Alert */}
          {message && (
            <div className="mb-4">
              <Alert
                color={message.type === "success" ? "success" : "failure"}
                icon={message.type === "success" ? HiCheckCircle : HiExclamationCircle}
                className="rounded-lg shadow"
              >
                <span className="font-medium">{message.text}</span>
              </Alert>
            </div>
          )}

          <form className="flex flex-col gap-6 w-full" onSubmit={signin}>
            <h2 className="text-3xl font-bold text-center mb-6 text-pink-600 dark:text-pink-500">
              Sign in
            </h2>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="contact2">Your phone/email</Label>
              </div>
              <TextInput
                id="contact2"
                type="text"
                placeholder="name@flowbite.com / 9876543210"
                required
                shadow
                className="w-full"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* 👁️ Password Input with Toggle */}
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password2">Your password</Label>
              </div>
              <div className="relative">
                <TextInput
                  id="password2"
                  type={showPassword ? "text" : "password"}
                  required
                  shadow
                  className="w-full pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-fuchsia-600"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                >
                  {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                </button>
              </div>
            </div>

            <div className="mt-2 text-right">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-cyan-600 hover:underline dark:text-cyan-400"
                disabled={loading}
              >
                Forgot password?
              </button>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="agree"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                disabled={loading}
              />
              <Label htmlFor="agree" className="flex">
                I agree with the&nbsp;
                <Link
                  to="#"
                  className="text-cyan-600 hover:underline dark:text-cyan-500"
                >
                  terms and conditions
                </Link>
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-fuchsia-600 via-pink-500 to-yellow-400 text-white font-bold hover:from-fuchsia-700 hover:to-yellow-500 focus:ring-4 focus:ring-fuchsia-300 border-0"
              disabled={!isFormValid || loading}
            >
              {loading ? "Signing in..." : "Login"}
            </Button>

            <div className="flex items-center gap-2 justify-center mt-2">
              <span className="text-sm font-semibold text-pink-600">
                Don't have an account?
              </span>
              <Link
                to="/signup"
                className="text-cyan-600 hover:underline dark:text-cyan-500 font-semibold"
              >
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
