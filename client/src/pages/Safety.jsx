import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Phone,
  Eye,
  Moon,
  Shield,
  Hand,
  AlertTriangle,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import safetyImg from "../assets/safety.png";

function Safety() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4 }}
      className="bg-[#fff5f8]"
    >
      <Navbar />

      {/* HERO SECTION */}
      <section className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto px-6 py-16 gap-12">

        {/* LEFT CONTENT */}
        <div className="max-w-xl text-center md:text-left">

          <div className="bg-[#ffd6e5] text-[#e91e63] px-4 py-2 rounded-full inline-block mb-6 font-semibold">
            Stay Alert • Stay Safe • Stay Strong
          </div>

          <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
            Essential{" "}
            <span className="text-[#e91e63] audiowide">
              Safety Tips
            </span>
            <br />
            for Women
          </h1>

          <p className="text-gray-600 mb-8">
            Follow these simple safety guidelines to protect yourself
            and stay confident in every situation.
          </p>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">

            <button
              onClick={() =>
                document.getElementById("tips").scrollIntoView({
                  behavior: "smooth",
                })
              }
              className="bg-[#e91e63] text-white px-6 py-3 font-semibold
              rounded-full hover:scale-105 transition duration-300 shadow-md"
            >
              Get Started ➜
            </button>

            <button
              onClick={() => navigate("/police")}
              className="border-2 border-[#e91e63] text-[#e91e63] px-6 py-3 font-semibold 
              rounded-full hover:bg-[#e91e63] hover:text-white transition duration-300"
            >
              Nearby Police
            </button>

          </div>
        </div>

        {/* RIGHT IMAGE (HIDDEN ON MOBILE) */}
        <div className="hidden md:block">
          <img
            src={safetyImg}
            alt="Safety Tips Illustration"
            className="w-130 drop-shadow-2xl"
          />
        </div>

      </section>

      {/* TIPS SECTION */}
      <section
        id="tips"
        className="max-w-6xl mx-auto px-6 pt-24 pb-20 grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {tips.map((tip, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -6 }}
            className="bg-white border border-[#e91e63] rounded-2xl p-6 shadow-md"
          >
            <div className="flex items-center gap-2 text-[#e91e63] font-semibold mb-3">
              {tip.icon}
              {tip.title}
            </div>

            <p className="text-gray-600 text-sm leading-relaxed">
              {tip.description}
            </p>
          </motion.div>
        ))}
      </section>

      <Footer />
    </motion.div>
  );
}

const tips = [
  {
    icon: <Phone size={20} />,
    title: "Keep Emergency Contacts",
    description:
      "Save important contacts on speed dial and share your location with trusted people.",
  },
  {
    icon: <Eye size={20} />,
    title: "Stay Aware of Surroundings",
    description:
      "Avoid using headphones or phone excessively while walking in public places.",
  },
  {
    icon: <Moon size={20} />,
    title: "Avoid Isolated Areas",
    description:
      "Choose well-lit routes and crowded places, especially at night.",
  },
  {
    icon: <Shield size={20} />,
    title: "Secure Your Online Presence",
    description:
      "Do not share personal information on social media publicly.",
  },
  {
    icon: <Hand size={20} />,
    title: "Learn Self-Defense",
    description:
      "Basic self-defense training helps build confidence and quick response.",
  },
  {
    icon: <AlertTriangle size={20} />,
    title: "Trust Your Instincts",
    description:
      "If something feels wrong, leave immediately and seek help.",
  },
];

export default Safety;