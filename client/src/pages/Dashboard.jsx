import { motion } from "framer-motion"
import Chatbot from "../components/Chatbot"
import { Link, useNavigate } from "react-router-dom"
import {
   User,
  MessageCircle,
  AlertTriangle,
  Camera,
  FileText,
  Flame,
  Map,
  FilePlus,
  LogOut
} from "lucide-react"

export default function Dashboard() {

  const navigate = useNavigate()
  const username = localStorage.getItem("username") || "User"

  const handleLogout = () => {
    localStorage.clear()
    navigate("/")
  }

  const cards = [
    { icon: AlertTriangle, label: "SOS", link: "/sos", danger: true },
    { icon: Camera, label: "Live Evidence", link: "/live-evidence" },
    { icon: Flame, label: "Heatmap", link: "/heatmap" },
    { icon: Map, label: "Route", link: "/safe-route" },
    { icon: FilePlus, label: "FIR", link: "/fir" },
    { icon: MessageCircle, label: "Complaint", link: "/complaint" },
    { icon: FileText, label: "Status", link: "/status" },
    { icon: LogOut, label: "Logout", logout: true }
  ]

  return (
  <div className="min-h-screen bg-linear-to-br from-[#fff5f8] via-[#ffe4ec] to-[#f8d9ff] font-poppins">

    {/* HEADER */}
    <header className="pt-4 md:pt-6">
      <div className="max-w-md mx-auto bg-[#e91e63] rounded-full py-3 flex items-center justify-center gap-2 text-white font-semibold text-lg shadow-lg">
        <User size={22} />
        <span>User Dashboard</span>
      </div>
    </header>

    {/* WELCOME */}
    <p className="text-center mt-8 mb-8 text-base md:text-lg text-black">
      Welcome, <strong>{username}</strong>! Choose an action below:
    </p>

    {/* CARDS */}
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 sm:gap-6 md:gap-10 px-4 max-w-2xl mx-auto pb-20">

      {cards.map((card, index) => {

        const Icon = card.icon

        if (card.logout) {
          return (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 160, damping: 14 }}
              onClick={handleLogout}
              className="col-span-2 sm:col-span-3 md:col-span-4 h-20 md:h-22 rounded-[2rem] flex flex-row justify-center items-center gap-4
              bg-red-500/70 border border-red-500 backdrop-blur-xl shadow-lg
              hover:shadow-red-500/60 transition-all duration-300 cursor-pointer"
            >

              <Icon className="w-7 h-7 md:w-8 md:h-8 text-white" />

              <span className="text-white text-base md:text-lg font-semibold">
                Logout
              </span>

            </motion.div>
          )
        }

        return (
          <Link key={index} to={card.link}>

            <motion.div
              whileHover={{ scale: 1.05, y: -6 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 160, damping: 14 }}
              className={`h-24 sm:h-28 md:h-30 rounded-[2rem] flex flex-col justify-center items-center gap-2
              backdrop-blur-xl border shadow-lg
              transition-all duration-300 ease-out
              hover:shadow-2xl hover:-translate-y-1

              ${card.danger
                ? "bg-red-500/60 border-red-500 shadow-red-400/40 hover:shadow-red-500/60 animate-sos"
                : "bg-pink-300/40 border-pink-500/40 hover:shadow-pink-400/50"
              }
            `}
            >

              <Icon
                className={card.danger
                  ? "w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white"
                  : "w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-black"}
              />

              <span className="text-xs sm:text-sm font-semibold text-black">
                {card.label}
              </span>

            </motion.div>

          </Link>
        )
      })}

    </div>

    {/* CHATBOT */}
    <Chatbot />

  </div>
)
}