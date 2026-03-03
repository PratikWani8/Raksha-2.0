import { motion } from "framer-motion";

const steps = [
  "Register & Login securely.",
  "Activate SOS during emergency.",
  "Share live location with police.",
  "Get immediate help from authorities."
];

function HowItWorks() {
  return (
    <section className="bg-softPink py-24 px-6 text-center">
      <div className="max-w-6xl mx-auto">

        <h2 className="text-4xl font-bold text-primary mb-6">
          How Raksha Works
        </h2>

        <p className="text-gray-600 mb-16 max-w-2xl mx-auto">
          Raksha protects women in emergency situations using smart technology and quick response systems.
        </p>

        <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-8">

          {steps.map((step, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -6 }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-white border border-primary rounded-2xl p-8 shadow-md"
            >
              <div className="w-12 h-12 mx-auto mb-4 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                {index + 1}
              </div>
              <p className="text-gray-700 font-medium">
                {step}
              </p>
            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
}

export default HowItWorks;