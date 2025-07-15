import { useState, useRef, useEffect } from "react";
import { Button, Modal, Label, TextInput,Alert } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import loaderVideo from "../assets/loader.mp4";
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, 
});
// Validation functions
function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
function isPhone(value) {
  return /^(\+?\d{10,15})$/.test(value);
}
const ForgotPassword = () => {
// const [name, setName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [input, setInput] = useState("");
  const [inputType, setInputType] = useState(null);
  const [anim, setAnim] = useState("");
  const [onOpen, setOnOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(0);
  const [message, setMessage] = useState({ type: null, text: "" });


  const otpRefs = useRef([]);
  // Function to reset the form to its default state
    const setDefault = () => {
  setStep(1);
  setInput("");
  setInputType(null);
  setAnim("");
  setOnOpen(true);
  setLoading(false);
  setOtp(["", "", "", ""]);
  setNewPassword("");
  setConfirmNewPassword("");
  setShowPassword(false);
  setMessage({ type: null, text: "" });
  setResendTimer(0);
};
useEffect(() => {
  if (message.text) {
    const timer = setTimeout(() => {
      setMessage({ type: null, text: "" });
    }, 3000); // Auto-dismiss after 3 seconds
    return () => clearTimeout(timer);
  }
}, [message]);

  // Focus first OTP input on Step 2
  useEffect(() => {
    if (step === 2) {
      otpRefs.current[0]?.focus();
    }
  }, [step]);
  useEffect(() => {
  let timer;
  if (resendTimer > 0) {
    timer = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
  }
  return () => clearInterval(timer);
}, [resendTimer]);

  const sendOtp = async (userData) => {
      console.log("sendOtp called with userData");
      console.log("/api/v1/auth/authRoutes/sendOtp calling with data:", userData);
      const otpResponse = await API.post("/api/v1/auth/authRoutes/sendOtp/forgotPass", userData);
      console.log("OTP response:", otpResponse.data);
      return otpResponse.data;
    }

    const handleResendOtp = async () => {
  if (!input || !inputType || resendTimer > 0) return;
  setLoading(true);
  try {
    const otpResult = await sendOtp({ contact: input, type: inputType });
    if (otpResult.message === 'OTP sent successfully') {
      setMessage({ type: "success", text: "OTP resent successfully!" });
      setResendTimer(30);
      setOtp(["", "", "", ""]); // reset OTP boxes
      otpRefs.current[0]?.focus();
    } else {
      setMessage({ type: "failure", text: "Failed to resend OTP." });
    }
  } catch (err) {
    setMessage({ type: "failure", text: "Failed to resend OTP. Please try again." });
  } finally {
    setLoading(false);
  }
};

//handleContinue function to validate input and send OTP
  const handleContinue = async (e) => {
    e.preventDefault();
    console.log("handleContinue called");
    if (!isEmail(input) && !isPhone(input)) {
      setMessage({ type: "warning", text: "Please enter a valid email/phone number." });
      console.log("returning handleContinue due to invalid input");
      return;
    }

    setLoading(true);
    const type = isEmail(input) ? "email" : "phone";
    setInputType(type);

    const userData = {
      contact: input,
      type,
    };
    console.log("User data prepared:", userData);

    try {
      console.log("Sending request to checkUser");
      const res = await API.post("/api/v1/auth/authRoutes/checkUser", userData);
      if (res.data.message === "User does not exist") {
        console.log("User does not exist");
        setMessage({ type: "warning", text: "User not found. Please Signup if you are a new user." });
        // setDefault();
        return;
      } 
      console.log("User exist, proceeding to send OTP");
      const otpResult = await sendOtp(userData);
      console.log("returned from sendOtp");
      if(otpResult.message==='OTP sent successfully'){
        setMessage({ type: "success", text: `OTP sent to ${input}` })
        setResendTimer(30);
        console.log("otp sent Successfully");
         setAnim("animate-slide-left");
      setTimeout(() => {
        setStep(2);
        setAnim("");
      }, 600);
        
      }
      else{
        console.log("some error in sendOtp");
        setMessage({ type: "failure", text: "Error in sending OTP. Please try again!" })
        return;
      }
    } catch (err) {
      setDefault();
      if (err?.response) {
    const message = err?.response?.data?.message;
    console.log("Server error message:", message);
  } else {
    console.log("Unexpected error:", err);
    setMessage({ type: "failure", text: "Something went wrong.Please try again!!!" });
  }
  } 
   finally {
    console.log("Setting loading to false from handleContinue");
    setLoading(false);
  }
};
// Function to handle OTP input changes
  const handleOtpChange = (e, index) => {
    console.log("handleOtpChange called with index:", index, "and value:", e.target.value);
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      otpRefs.current[index + 1]?.focus();
    }
  };
// Function to handle OTP input keydown events
  const handleOtpKeyDown = (e, index) => {
    console.log("handleOtpKeyDown called with index:", index, "and key:", e.key);
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };
// Function to confirm the OTP entered by the user
  const handleConfirmOtp = async (e) => {
    e.preventDefault();
    const fullOtp = otp.join("");
    console.log("handleConfirmOtp called with fullOtp:", fullOtp);
    if (fullOtp.length !== 4) {
      setMessage({ type: "warning", text: "Please enter a valid 4-digit OTP." });
      return;
    }
    setLoading(true);
    try {
      const verifyRes = await API.post("/api/v1/auth/authRoutes/verifyOtp", {
        contact: input,
        otp: fullOtp,
      });
      console.log("OTP verification response:", verifyRes.data);

      if (verifyRes.data.message==='OTP verified successfully') {
      setMessage({ type: "success", text: "OTP verified successfully" });
      setAnim("animate-slide-left");
      setTimeout(() => {
      setStep(3);
      setOtp(["", "", "", ""]);
      setAnim("");
    }, 600);
      return;
      } else {
        setMessage({ type: "warning", text: "Invalid OTP! Please try again." });
        setOtp(["", "", "", ""]);
        
      }
    } catch (err) {

      if(err?.response?.data?.message === 'Invalid OTP') {
      console.error("Invalid Otp:", err?.response?.data);
      setMessage({ type: "warning", text: "Invalid OTP! Please try again." });
      setOtp(["", "", "", ""]);
      }
      setMessage({ type: "warning", text: "OTP verification failed!!" });
      setDefault();
    }
    finally{
      setLoading(false);
    }
  };
// Function to handle going back to the previous step
  // This function animates the transition back to Step 1
  const handleBack = () => {
    console.log("handleBack called");
    setAnim("animate-slide-right");
    setTimeout(() => {
      setStep(prev => prev - 1);
      setOtp(["", "", "", ""]);
      setAnim("");
    }, 300);
  };
  // This function resets the form to its default state and navigates to the home page
  const handleClose = () => {
    console.log("handleClose called");
    setDefault();
    setAnim("");
    setOnOpen(false);
    navigate("/");
  };
  // Function to handle final signup after OTP verification
  const handleChangePassword = async (e) => {
    e.preventDefault();
    console.log("handleChangePassword called");
    if (newPassword !== confirmNewPassword) {
      setMessage({ type: "warning", text: "Passwords didn't match!" });
      setConfirmNewPassword("");
      return;
    }
    if( newPassword.length < 6) {
      setMessage({ type: "warning", text: "Password must be at least 6 characters long." });
      setNewPassword("");
      setConfirmNewPassword("");
      return;
    }
    setLoading(true);
    const userResponse= {
        contact: input,
        newPassword: newPassword,
      }

    try {
      console.log(`sending userResponse= ${userResponse}`)
      const changePasswordRes = await API.post("/api/v1/auth/authRoutes/signin/changePassword", userResponse );
      console.log("Change Password response:", changePasswordRes.data);

      if (changePasswordRes.data.message === 'Password updated successfully') {
        console.log("Password updated successfully, redirecting to dashboard");
        localStorage.setItem("token", changePasswordRes.data.token);
        setMessage({ type: "success", text: "Password updated Successfully!" });
        setTimeout(()=>{
        setDefault();
        setOnOpen(false);
        navigate("/signin");
        },3000);
      } else {
        setMessage({ type: "failure", text: "Password change failed! Please try again." });
        setNewPassword("");
        setConfirmNewPassword("");

      }
    } catch (err) {
      console.error("Password update-error:", err);
      setMessage({ type: "failure", text: "Password change failed! Please try again." });
    }
    finally{
      setLoading(false);
    }
  };




  return (
       <Modal show={onOpen} onClose={handleClose} size="md" popup>
         {
           console.log("Rendering Modal component with step:", step)
         }
         <div
           className={`relative bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-md overflow-hidden ${anim}`}
         >
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
   
           {message.text && (
     <div className="absolute top-4 inset-x-4 z-50">
       <Alert color={message.type} onDismiss={() => setMessage({ type: null, text: "" })}>
         {message.text}
       </Alert>
     </div>
   )}
   
   
           {step === 1 && (
     <>
       {/* Close Button */}
       <button
         type="button"
         onClick={handleClose}
         className="absolute top-4 right-4 text-2xl text-pink-400 hover:text-red-600 font-bold z-30 dark:text-orange-500"
         aria-label="Close"
       >
         &times;
       </button>
   
       {/* Logo */}
       <div className="flex justify-center mt-2 mb-4">
         <img
           src="/logo.png"
           alt="App Logo"
           className="h-24 w-auto object-contain"
         />
       </div>
   
       {/* Form */}
       <form
         onSubmit={handleContinue}
         className="flex flex-col gap-6 w-full transition-all duration-500 ease-in-out z-10"
       >
         <h2 className="text-3xl font-bold text-center text-orange-500">Forgot Password?</h2>
   
         <div>
           <Label htmlFor="contact" className="mb-2 block text-teal-500 dark:text-teal-400 font-medium">
             Email or Phone
           </Label>
           <TextInput
             id="contact"
             type="text"
             placeholder="Enter your email or phone"
             required
             shadow
             className="w-full focus:ring-pink-500"
             value={input}
             onChange={(e) => setInput(e.target.value)}
           />
         </div>
   
         <Button
           type="submit"
           className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold dark:bg-indigo-500 dark:hover:bg-indigo-600"
         >
           Get OTP
         </Button>
         <div className="flex items-center gap-2 justify-center mt-2">
        <span className="text-sm text-cyan-500 font-semibold dark:text-cyan-500 font-semibold">
          Don't have an account?
        </span>
        <Link
          to="/signup"
          className="text-pink-500 hover:text-pink-700 font-semibold underline dark:text-blue-600 font-semibold dark:hover:text-purple-600"
        >
          Signup
        </Link>
      </div>

       </form>
     </>
   )}
   
   
           {step === 2 && (
     <>
       {/* Back Button */}
       <button
         type="button"
         onClick={handleBack}
         className="absolute top-4 left-4 text-2xl text-gray-400 hover:text-red-500 font-bold z-30"
         aria-label="Back"
       >
         <svg
           xmlns="http://www.w3.org/2000/svg"
           className="h-6 w-6"
           fill="none"
           viewBox="0 0 24 24"
           stroke="currentColor"
         >
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
         </svg>
       </button>
   
       {/* Logo */}
       <div className="flex justify-center mt-2 mb-4">
         <img
           src="/logo.png"
           alt="App Logo"
           className="h-20 w-auto object-contain"
         />
       </div>
   
       {/* OTP Content */}
       <div className="flex flex-col gap-6 w-full transition-all duration-500 ease-in-out z-10">
         <h2 className="text-2xl font-bold text-center mb-2 text-orange-600">
           {inputType === "email" ? "Email Verification" : "Phone Verification"}
         </h2>
   
         <div className="text-center text-gray-700 dark:text-gray-300 mb-2">
           Enter the 4-digit OTP sent to:
           <div className="font-semibold mt-1 text-cyan-600">{input}</div>
           <div className="text-sm text-gray-500 mt-1">
             (OTP is valid for 5 minutes)
           </div>
         </div>
   
         <form
           className="flex flex-col gap-4 w-full items-center"
           onSubmit={handleConfirmOtp}
         >
           <div className="flex gap-2 justify-center">
             {[0, 1, 2, 3].map((i) => (
               <input
                 key={i}
                 type="text"
                 inputMode="numeric"
                 pattern="[0-9]*"
                 maxLength={1}
                 ref={(el) => (otpRefs.current[i] = el)}
                 value={otp[i]}
                 onChange={(e) => handleOtpChange(e, i)}
                 onKeyDown={(e) => handleOtpKeyDown(e, i)}
                 className="otp-box w-12 h-12 text-2xl text-center border rounded focus:outline-pink-500 bg-white"
                 style={{ imeMode: "disabled" }}
               />
             ))}
           </div>
   
           {/* Resend OTP */}
           <button
     type="button"
     onClick={handleResendOtp}
     disabled={resendTimer > 0}
     className={`text-sm font-medium ${
       resendTimer > 0 ? 'text-gray-400' : 'text-blue-600 hover:underline'
     }`}
   >
     {resendTimer > 0
       ? `Resend OTP in ${resendTimer}s`
       : "Resend OTP"}
   </button>
   
   
           {/* Submit Button */}
           <Button
             className="w-full mt-2 bg-pink-500 hover:bg-pink-600 text-white font-semibold dark:bg-indigo-500 dark:hover:bg-indigo-600"
             type="submit"
           >
             Confirm OTP
           </Button>
         </form>
       </div>
     </>
   )}
   
           {step === 3 && (
     <>
       <button
         type="button"
         onClick={handleClose}
         className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-fuchsia-600 font-bold z-30"
         aria-label="Close"
       >
         &times;
       </button>

        {/* Logo */}
       <div className="flex justify-center mt-2 mb-4">
         <img
           src="/logo.png"
           alt="App Logo"
           className="h-20 w-auto object-contain"
         />
       </div>


       <form onSubmit={handleChangePassword} className="flex flex-col gap-6 w-full transition-all duration-300 z-10">
         <h2 className="text-2xl font-bold text-center mb-4 text-cyan-600">Reset your password</h2>
   
        
         <div className="relative">
           <Label htmlFor="newPassword" className="mb-2 block">New Password</Label>
           <TextInput
             id="newPassword"
             type={showPassword ? "text" : "password"}
             placeholder="Enter new password"
             required
             value={newPassword}
             onChange={(e) => setNewPassword(e.target.value)}
             shadow
           />
           <button
             type="button"
             onClick={() => setShowPassword(prev => !prev)}
             className="absolute right-2 top-[38px] text-gray-500 hover:text-fuchsia-600"
           >
             {showPassword ? (
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.03-10-9s4.477-9 10-9 10 4.03 10 9c0 1.18-.207 2.313-.588 3.363M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
               </svg>
             ) : (
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.03-10-9s4.477-9 10-9c2.017 0 3.891.593 5.467 1.603M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
               </svg>
             )}
           </button>
         </div>
   
         <div>
           <Label htmlFor="confirmNewPassword" className="mb-2 block">Confirm New Password</Label>
           <TextInput
             id="confirmNewPassword"
             type="password"
             placeholder="Re-enter new password"
             required
             value={confirmNewPassword}
             onChange={(e) => setConfirmNewPassword(e.target.value)}
             shadow
           />
         </div>
   
         <Button type="submit" className=" w-full" color="purple">
           Confirm!
         </Button>
       </form>
     </>
   )}
   
         </div>
   
         {/* Custom CSS */}
         <style>
           {`
             .animate-slide-left {
               animation: slideLeft 0.3s forwards;
             }
             .animate-slide-right {
               animation: slideRight 0.3s forwards;
             }
             @keyframes slideLeft {
               from { transform: translateX(0); }
               to { transform: translateX(-100%); opacity: 0; }
             }
             @keyframes slideRight {
               from { transform: translateX(0); }
               to { transform: translateX(100%); opacity: 0; }
             }
   
             .otp-box::-webkit-outer-spin-button,
             .otp-box::-webkit-inner-spin-button {
               -webkit-appearance: none;
               margin: 0;
             }
   
             .otp-box {
               -moz-appearance: textfield;
             }
           `}
         </style>
       </Modal>
     );
};

export default ForgotPassword;
