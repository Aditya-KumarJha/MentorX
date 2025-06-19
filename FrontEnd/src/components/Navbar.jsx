import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Sun, Moon, Menu } from "lucide-react";
import { ThemeContext } from "../context/ThemeContext";

const Navbar = ({ contactRef, onContactClick }) => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleContactClick = () => {
    onContactClick?.();
    setIsMenuOpen(false); 
  };

  const navLinks = [
    { label: "Mentor AI", href: "#mentor" },
    { label: "PathFinder AI", href: "#pathfinder" },
    { label: "EduMatrix", href: "#edumatrix" },
    { label: "Community", href: "#community" },
  ];

  const bgClass = darkMode ? "bg-zinc-900 text-white" : "bg-white text-gray-900";

  return (
    <div className={bgClass}>
      <header
        className={`flex justify-between items-center shadow-md transition-all duration-300 ${bgClass} px-4 sm:px-6 py-3 sm:py-5 lg:px-10`}
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <img src="/MentorX.png" alt="logo" className="w-7 h-7 sm:w-9 sm:h-9" />
          <h1 className="text-lg sm:text-2xl font-extrabold tracking-wide">
            Mentor<span className="text-pink-500">X</span>
          </h1>
        </div>

        <nav className="hidden lg:flex gap-6 text-lg font-semibold">
          {navLinks.map(({ label, href }, i) => (
            <div
              key={i}
              className={`group relative px-4 py-2 rounded-xl transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                darkMode
                  ? "hover:bg-zinc-800 hover:border hover:border-blue-400"
                  : "hover:bg-blue-100 hover:border hover:border-blue-400"
              }`}
            >
              <a
                href={href}
                className={`transition-all duration-300 ${
                  darkMode ? "group-hover:text-blue-400" : "group-hover:text-blue-600"
                }`}
              >
                {label}
              </a>
            </div>
          ))}

          <div
            onClick={handleContactClick}
            className={`group relative px-4 py-2 rounded-xl transition-all duration-300 cursor-pointer transform hover:scale-105 ${
              darkMode
                ? "hover:bg-zinc-800 hover:border hover:border-blue-400"
                : "hover:bg-blue-100 hover:border hover:border-blue-400"
            }`}
          >
            <span
              className={`transition-all duration-300 ${
                darkMode ? "group-hover:text-blue-400" : "group-hover:text-blue-600"
              }`}
            >
              Contact Us
            </span>
          </div>
        </nav>

        <div className="flex items-center gap-2 sm:gap-4 pt-1">
          <button
            onClick={toggleDarkMode}
            className={`p-2 sm:p-2.5 rounded-full transition-all transform hover:scale-110 ${
              darkMode ? "bg-white text-black" : "bg-gray-200 text-black"
            }`}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <div className="hidden md:flex">
            <button
              onClick={() => navigate("/login")}
              className="relative overflow-hidden px-4 py-1.5 sm:px-6 sm:py-2 font-semibold border-2 border-cyan-400 text-cyan-400 rounded-full z-10 group transition-all duration-300 text-sm sm:text-base"
            >
              <span className="relative z-20 group-hover:text-black transition-all duration-300">Login</span>
              <span className="absolute inset-0 flex justify-center items-center z-0">
                <span className="h-10 w-10 sm:h-12 sm:w-12 bg-cyan-400 rounded-full scale-0 group-hover:scale-[2.5] transition-transform duration-500 ease-out"></span>
              </span>
            </button>

            <button
              onClick={() => navigate("/signup")}
              className="ml-2 relative overflow-hidden px-4 py-1.5 sm:px-6 sm:py-2 font-semibold border-2 border-rose-400 text-rose-400 rounded-full z-10 group transition-all duration-300 text-sm sm:text-base"
            >
              <span className="relative z-20 group-hover:text-black transition-all duration-300">Signup</span>
              <span className="absolute inset-0 flex justify-center items-center z-0">
                <span className="h-10 w-10 sm:h-12 sm:w-12 bg-rose-400 rounded-full scale-0 group-hover:scale-[2.5] transition-transform duration-500 ease-out"></span>
              </span>
            </button>
          </div>

          <div className="block lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-full transition hover:bg-gray-200 dark:hover:bg-zinc-800"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <div className={`block lg:hidden px-4 py-2 shadow-md space-y-2 ${bgClass}`}>
          {navLinks.map(({ label, href }, i) => (
            <a
              key={i}
              href={href}
              className="block px-4 py-2 rounded-md text-sm font-medium transition hover:bg-blue-100 dark:hover:bg-zinc-800 hover:text-blue-600 dark:hover:text-blue-400"
            >
              {label}
            </a>
          ))}

          <button
            onClick={handleContactClick}
            className="w-full text-left px-4 py-2 rounded-md text-sm font-medium transition hover:bg-blue-100 dark:hover:bg-zinc-800 hover:text-blue-600 dark:hover:text-blue-400"
          >
            Contact Us
          </button>

          <div className="flex justify-center gap-2 mt-3 md:hidden">
            <button
              onClick={() => navigate("/login")}
              className="w-full max-w-[45%] text-center px-3 py-2 text-sm font-semibold border-2 border-cyan-400 text-cyan-400 rounded-full relative overflow-hidden group"
            >
              <span className="relative z-20 group-hover:text-black transition-all duration-300">Login</span>
              <span className="absolute inset-0 flex justify-center items-center z-0">
                <span className="h-10 w-10 bg-cyan-400 rounded-full scale-0 group-hover:scale-[2.5] transition-transform duration-500 ease-out"></span>
              </span>
            </button>

            <button
              onClick={() => navigate("/signup")}
              className="w-full max-w-[45%] text-center px-3 py-2 text-sm font-semibold border-2 border-rose-400 text-rose-400 rounded-full relative overflow-hidden group"
            >
              <span className="relative z-20 group-hover:text-black transition-all duration-300">Signup</span>
              <span className="absolute inset-0 flex justify-center items-center z-0">
                <span className="h-10 w-10 bg-rose-400 rounded-full scale-0 group-hover:scale-[2.5] transition-transform duration-500 ease-out"></span>
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
