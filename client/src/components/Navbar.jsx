import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu } from "lucide-react";
import { motion } from "framer-motion";

function Navbar() {
  const [open, setOpen] = useState(false);

  const linkStyle = ({ isActive }) =>
    `transition duration-300 ${
      isActive
        ? "text-[#e91e63] font-semibold border-b-2 border-[#e91e63]"
        : "text-gray-700 hover:text-[#e91e63]"
    }`;

  return (
    <>
      {/* Top Banner */}
      <div className="bg-[#e91e63] text-white flex justify-center items-center gap-3 py-3 text-sm font-medium border-b border-white/30">
        <p>
          🚨 Emergency Helpline: 112 | Women Helpline: 181 | Need Help Urgently?
        </p>
        <button className="bg-white text-[#e91e63] px-4 py-1 rounded-full font-semibold hover:scale-105 transition">
          Get Help
        </button>
      </div>

      {/* Navbar */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-6 z-50 px-6 mt-4"
      >
        <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-lg rounded-full border border-[#e91e63]/90 px-6 py-4 flex justify-between items-center">

          {/* Logo */}
          <h1 className="text-[#e91e63] text-2xl font-bold">
            Raksha
          </h1>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-6 font-medium">

            <NavLink to="/" className={linkStyle}>
              Home
            </NavLink>

            <NavLink to="/safety" className={linkStyle}>
              Safety Tips
            </NavLink>

            <NavLink to="/police" className={linkStyle}>
              Nearby Police
            </NavLink>

            <NavLink to="/user" className={linkStyle}>
              User
            </NavLink>

            <NavLink to="/admin" className={linkStyle}>
              Admin
            </NavLink>

          </div>

          {/* Start Button (Desktop Only) */}
          <button className="hidden md:block bg-[#e91e63] text-white px-5 py-2 rounded-full hover:bg-pink-700 transition">
            Start Protection
          </button>

          {/* Mobile Menu Icon */}
          <Menu
            className="md:hidden text-[#e91e63] cursor-pointer"
            onClick={() => setOpen(!open)}
          />
        </div>

        {/* Mobile Dropdown */}
        {open && (
          <div className="md:hidden mt-3 bg-white rounded-2xl shadow-xl border border-gray-200 p-6 flex flex-col gap-4 font-medium">

            <NavLink to="/" className={linkStyle} onClick={() => setOpen(false)}>
              Home
            </NavLink>

            <NavLink to="/safety" className={linkStyle} onClick={() => setOpen(false)}>
              Safety Tips
            </NavLink>

            <NavLink to="/police" className={linkStyle} onClick={() => setOpen(false)}>
              Nearby Police
            </NavLink>

            <NavLink to="/user" className={linkStyle} onClick={() => setOpen(false)}>
              User
            </NavLink>

            <NavLink to="/admin" className={linkStyle} onClick={() => setOpen(false)}>
              Admin
            </NavLink>

            <button className="bg-[#e91e63] text-white px-5 py-2 rounded-full hover:bg-pink-700 transition mt-2">
              Start Protection
            </button>

          </div>
        )}
      </motion.div>
    </>
  );
}

export default Navbar;