import heroImg from "../assets/r2.0_logo.png";
import { motion } from "framer-motion";

function Hero() {
  return (
     <section className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto px-6 py-10 md:py-16 gap-12">
      {/* Left Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-xl text-center md:text-left"
      >
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-[#ffd6e5] text-[#e91e63] px-4 py-2 rounded-full mb-3">
          <span className="text-sm font-semibold">
            💖 Trusted by 10,000+ Women
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6">
          Your Personal Smart <br />
          <span className="text-[#e91e63] audiowide">Safety Protection</span> Companion.
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-8 text-sm sm:text-base leading-relaxed">
          A smart A.I based platform for women to report safety incidents,
          send emergency SOS alerts and track complaint status securely.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start font-semibold">
          <button className="bg-[#e91e63] text-white px-6 py-3 rounded-full hover:scale-105 transition-all duration-300 shadow-md">
            Start ➜
          </button>

          <button className="border-2 border-[#e91e63] text-[#e91e63] px-6 py-3 font-semibold rounded-full hover:bg-[#e91e63] hover:text-white transition-all duration-300">
            Safety Guide
          </button>
        </div>
      </motion.div>

      {/* Right Image */}
      <motion.div
  initial={{ opacity: 0, y: 40 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 1, delay: 0.2 }}
  className="hidden md:flex justify-center"
>
  <motion.img
    src={heroImg}
    alt="Raksha Safety Hero"
    className="w-110 drop-shadow-2xl"
    whileHover={{ scale: 1.05 }}
  />
</motion.div>

    </section>
  );
}

export default Hero;