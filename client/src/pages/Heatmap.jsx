import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet.heat"
import { BASE_URL } from "../api/api"
import API from "../api/api"
import { AI_API } from "../api/api"
import io from "socket.io-client"

// leaflet marker icon
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

const socket = io(BASE_URL, {
  transports: ["websocket"],
});

export default function Heatmap() {

  const mapRef = useRef(null)
  const heatRef = useRef(null)
  const futureHeatRef = useRef(null)
  const userMarker = useRef(null)
  const watchId = useRef(null)

  const lastWarning = useRef(0)

  const [mapLoaded, setMapLoaded] = useState(false)

  // CREATE MAP
  useEffect(() => {

    if (mapRef.current) return

    const map = L.map("map").setView([18.5204, 73.8567], 12)

    L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      { attribution: "© OpenStreetMap" }
    ).addTo(map)

    mapRef.current = map

    // CURRENT CRIME HEATMAP
    heatRef.current = L.heatLayer([], {
      radius: 30,
      blur: 20,
      gradient: {
        0.0: "green",
        0.4: "lime",
        0.6: "yellow",
        0.8: "orange",
        1.0: "red"
      }
    }).addTo(map)

    // FUTURE PREDICTION HEATMAP
    futureHeatRef.current = L.heatLayer([], {
      radius: 30,
      blur: 20,
      gradient: {
        0.0: "#b3ecff",
        0.4: "#66d9ff",
        0.7: "#33ccff",
        1.0: "#0099ff"
      }
    }).addTo(map)

    setMapLoaded(true)

  }, [])

  // LOAD CURRENT HEATMAP
 useEffect(() => {

  if (!mapLoaded) return;

  const loadHeatmap = async () => {

    try {

      const res = await API.get("/api/heatmap");

      const points = res.data.map((p) => [
        p.lat,
        p.lng,
        p.score,
      ]);

      heatRef.current.setLatLngs(points);

    } catch (err) {

      console.log("Heatmap error:", err);

    }
  };

  loadHeatmap();

}, [mapLoaded]);

  // LOAD FUTURE HOTSPOTS
 useEffect(() => {

  if (!mapLoaded) return;

  const loadFutureHotspots = async () => {

    try {

      const res = await API.get(
        "/api/future-hotspots"
      );

      const futurePoints = res.data.map((p) => [
        p.lat,
        p.lng,
        p.score,
      ]);

      futureHeatRef.current.setLatLngs(futurePoints);

      drawFutureWaves(res.data);

    } catch (err) {

      console.log(
        "Future prediction error:",
        err
      );

    }
  };

  loadFutureHotspots();

}, [mapLoaded]);

function drawFutureWaves(data){

data.forEach(p=>{

if(p.score > 0.6){

let lat = parseFloat(p.lat)
let lng = parseFloat(p.lng)

const wave = L.circle([lat,lng],{

radius:100,
color:"#00aaff",
weight:2,
fillOpacity:0,
className:"future-wave"

}).addTo(mapRef.current)

let radius = 100
let opacity = 0.8

setInterval(()=>{

radius += 40
opacity -= 0.05

wave.setRadius(radius)

wave.setStyle({
opacity:opacity
})

if(radius > 600){

radius = 100
opacity = 0.8

}

},120)

}

})

}

  // LIVE SOS UPDATE
  useEffect(() => {

    const handler = (data) => {

      if (heatRef.current) {

        heatRef.current.addLatLng([
          data.lat,
          data.lng,
          1
        ])

      }

    }

    socket.on("newSOS", handler)

    return () => {
      socket.off("newSOS", handler)
    }

  }, [])

  // USER LOCATION + AI PREDICTION
  useEffect(() => {

    watchId.current = navigator.geolocation.watchPosition(

      async (pos) => {

        const lat = pos.coords.latitude
        const lng = pos.coords.longitude

        // USER MARKER
        if (userMarker.current) {

          userMarker.current.setLatLng([lat, lng])

        } else {

          userMarker.current = L.marker([lat, lng])
            .addTo(mapRef.current)
            .bindPopup("📍 You are here")

        }

        // AI RISK CHECK
        try {

  const res = await AI_API.post(
    "/predict",
    { lat, lng }
  );

  const risk = res.data.risk;

  const now = Date.now();

  if (
    risk > 0.7 &&
    now - lastWarning.current > 30000
  ) {

    lastWarning.current = now;

    alert("🚨 Dangerous Area");

    const msg = new SpeechSynthesisUtterance(
      "Warning. You are entering a dangerous area"
    );

    speechSynthesis.speak(msg);
  }

} catch (err) {

  console.log(
    "AI error:",
    err.message
  );

}

      },

      (err) => {
        console.log("Location error:", err)
      },

      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000
      }

    )

    return () => {
      navigator.geolocation.clearWatch(watchId.current)
    }

  }, [])

  return (

    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 p-6">

      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-xl rounded-3xl p-6 max-w-4xl mx-auto"
      >

        <h2 className="text-xl font-bold text-center text-pink-600 mb-4">
          AI Crime Heatmap
        </h2>

        <div
          id="map"
          className="h-[500px] rounded-xl"
        ></div>

      </motion.div>

    </div>

  )

}