import { ShieldCheck, MapPin, Siren, Lock, Zap, Heart } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: <Siren size={40} />,
    title: "Instant SOS Alerts",
    desc: "Send emergency alerts instantly with one click during dangerous situations.",
  },
  {
    icon: <MapPin size={40} />,
    title: "Live Location Tracking",
    desc: "Share your real-time location with authorities and trusted contacts.",
  },
  {
    icon: <ShieldCheck size={40} />,
    title: "Nearby Police Help",
    desc: "Quickly find nearby police stations and emergency support services.",
  },
  {
    icon: <Lock size={40} />,
    title: "Secure & Private",
    desc: "Your data is encrypted and protected to ensure maximum privacy.",
  },
  {
    icon: <Zap size={40} />,
    title: "Fast Response",
    desc: "Authorities receive alerts immediately for quicker response time.",
  },
  {
    icon: <Heart size={40} />,
    title: "Women Empowerment",
    desc: "Helping women feel safe, confident, and empowered in daily life using AI.",
  },
];

function WhyRaksha() {
  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-6xl mx-auto text-center">

        <h2 className="text-4xl font-bold text-primary mb-4">
          Why Choose Raksha?
        </h2>

        <p className="text-gray-600 max-w-2xl mx-auto mb-14">
          Raksha empowers women with smart features, fast response, and reliable protection whenever needed.
        </p>

        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-8">

          {features.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -8 }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-softPink border border-primary rounded-2xl p-8 text-center shadow-md"
            >
              <div className="text-primary mb-4 flex justify-center">
                {item.icon}
              </div>
              <h3 className="font-semibold text-lg mb-2 text-primary">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {item.desc}
              </p>
            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
}

export default WhyRaksha;