import { Button } from "flowbite-react";
import { Link } from "react-router-dom";
import { HiArrowRight } from "react-icons/hi";

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-pink-900 via-purple-900 to-violet-200 flex items-center justify-center text-white">
      <div className="text-center px-4 md:px-8 py-12">
        {/* Logo */}
        <img
          src="/CiniShineLogo.png"
          alt="CiniShine Logo"
          className="mx-auto h-24 sm:h-32 w-auto drop-shadow-lg"
        />

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight drop-shadow-lg mt-6">
          Welcome to <span className="text-yellow-400">CiniShine</span>
        </h1>

        {/* Tagline */}
        <p className="text-lg sm:text-xl font-medium text-white/80 max-w-2xl mx-auto mt-4">
          Discover talent, connect with creators, and shine in the world of cinema.
        </p>

        {/* Action buttons */}
        <div className="flex justify-center gap-4 mt-8 flex-wrap">
          <Link to="/signup">
            <Button
              size="lg"
              className="bg-yellow-400 text-black font-bold hover:bg-yellow-300 border-0 transition duration-300"
            >
              Get Started
              <HiArrowRight className="ml-2" />
            </Button>
          </Link>

          <Link to="/signin">
            <Button
              outline
              size="lg"
              className="text-white border-white hover:bg-white hover:text-purple-600 transition duration-300"
            >
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
