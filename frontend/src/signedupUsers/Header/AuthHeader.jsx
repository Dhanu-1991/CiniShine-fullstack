import { Alert, Avatar } from "flowbite-react";
import { HiMenu, HiChevronDown } from "react-icons/hi";
import logo from "/CiniShineLogo.png";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  // withCredentials: true, // Optional: if using cookies
});
export default function AuthHeader({ onMenuToggle }) {
  const [userName, setUserName] = useState("John Doe");
  const [userContact, setUserContact] = useState("user@example.com");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hoverInfo, setHoverInfo] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    async function fetchUserData() {
      try {
        const token = localStorage.getItem("token");
        const response = await API.get("/api/v1/auth/authRoutes/user-data", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const userData = response.data.user;
          console.log("User data fetched successfully:", userData);
          setUserName(userData.userName || "John Doe");
          setUserContact(userData.contact || "user@example.com");
        } else {
          throw new Error("Invalid token");
        }
      } catch (error) {
        console.error("Session expired or error fetching user data:", error);
        localStorage.removeItem("token");
        setSessionExpired(true);

        // Redirect after 2 seconds
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000000);
      }
    }

    fetchUserData();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  

  return (
    <header className="bg-gradient-to-r from-blue-900 via-indigo-800 to-cyan-600 text-white shadow-md fixed top-0 left-0 w-full h-20 z-50 flex items-center justify-between px-4">
      {/* Left: Hamburger + Logo */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onMenuToggle}
          className="text-white hover:text-yellow-300 text-2xl focus:outline-none"
        >
          <HiMenu />
        </button>
        <Link to="/dashboard" className="flex items-center space-x-2">
          <img src={logo} className="h-8" alt="Logo" />
          <span className="text-yellow-300 font-bold text-lg tracking-wide">
            CiniShine
          </span>
        </Link>
      </div>

      {/* Right: Avatar + Info + Dropdown */}
      <div ref={dropdownRef} className="relative flex flex-col items-center">
        {/* Avatar + Dropdown */}
        <div className="flex items-center space-x-2">
          <div
            className="hover:scale-105 transition-transform duration-200 cursor-pointer"
            onMouseEnter={() => setHoverInfo(true)}
            onMouseLeave={() => setHoverInfo(false)}
          >
            <Avatar alt="User settings" rounded />
          </div>

          <HiChevronDown
            className="text-white text-xl hover:text-yellow-300 cursor-pointer"
            onClick={() => setDropdownOpen((prev) => !prev)}
          />
        </div>

        {/* Hover-only Floating user info */}
        {hoverInfo && (
          <div className="absolute top-full mt-2 right-0 bg-white text-black text-sm shadow-lg rounded p-2 w-44 z-50">
            <div className="font-medium">{userName}</div>
            <div className="text-xs text-gray-600 truncate">{userContact}</div>
          </div>
        )}

        {/* Always show user info below */}
        <div className="text-center mt-1 leading-tight text-sm">
          <div className="font-medium">{userName}</div>
          <div className="text-xs text-gray-300">{userContact}</div>
        </div>

        {/* Dropdown menu */}
        {dropdownOpen && (
          <div className="absolute top-full mt-3 right-0 bg-white text-black rounded shadow-lg w-40 text-sm z-50">
            <Link
              to="/settings"
              className="block px-4 py-2 hover:bg-gray-100"
              onClick={() => setDropdownOpen(false)}
            >
              Settings
            </Link>
            <Link
              to="/logout"
              className="block px-4 py-2 hover:bg-gray-100"
              onClick={() => setDropdownOpen(false)}
            >
              Logout
            </Link>
          </div>
        )}
      </div>

      {/* Session expired alert */}
      {sessionExpired && (
        <div className="fixed top-20 right-4 z-[999]">
          <Alert color="failure">
            <span className="font-medium">Session expired!</span> Redirecting to login...
          </Alert>
        </div>
      )}
    </header>
  );
}
