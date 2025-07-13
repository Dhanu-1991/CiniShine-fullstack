import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function PublicHeader() {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ to get the current path
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setHidden(true); // scroll down → hide
      } else {
        setHidden(false); // scroll up → show
      }
      setLastScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <Navbar
      fluid
      rounded
      className={`fixed top-0 left-0 right-0 h-20 z-50 shadow bg-gradient-to-r from-purple-800 via-fuchsia-600 to-pink-400 transition-transform duration-300 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <NavbarBrand>
        <img
          src="/CiniShineLogo.png"
          className="mr-3 h-6 sm:h-9"
          alt="CiniShine Logo"
        />
        <span className="self-center whitespace-nowrap text-xl font-semibold text-yellow-300 drop-shadow-lg">
          CiniShine
        </span>
      </NavbarBrand>

      <div className="flex md:order-2">
        <Button
          className="bg-orange-400 hover:bg-orange-500 text-white font-bold border-0 focus:ring-4 focus:ring-orange-300 dark:bg-orange-400 dark:hover:bg-orange-600"
          onClick={() => navigate("/signup")}
        >
          Get started
        </Button>
        <NavbarToggle />
      </div>

      <NavbarCollapse>
        <NavbarLink
          as={Link}
          to="/home"
          active={location.pathname === "/home"} // ✅ Highlight if current path is /home
          className="text-white"
        >
          Home
        </NavbarLink>
        <NavbarLink
          as={Link}
          to="/about"
          active={location.pathname === "/about"}
          className="text-white"
        >
          About
        </NavbarLink>
        <NavbarLink
          as={Link}
          to="/services"
          active={location.pathname === "/services"}
          className="text-white"
        >
          Services
        </NavbarLink>
        <NavbarLink
          as={Link}
          to="/pricing"
          active={location.pathname === "/pricing"}
          className="text-white"
        >
          Pricing
        </NavbarLink>
        <NavbarLink
          as={Link}
          to="/contact"
          active={location.pathname === "/contact"}
          className="text-white"
        >
          Contact
        </NavbarLink>
      </NavbarCollapse>
    </Navbar>
  );
}
