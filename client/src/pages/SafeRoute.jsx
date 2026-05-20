import { useEffect,useRef,useState } from "react"
import { motion } from "framer-motion"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-routing-machine"
import "leaflet.heat"
import axios from "axios"
import API from "../api/api"

export default function SafeRoute(){

const mapRef = useRef(null)
const heatRef = useRef(null)
const routeRef = useRef(null)

const [start,setStart] = useState("")
const [end,setEnd] = useState("")
const [loading,setLoading] = useState(false)
const [danger,setDanger] = useState(false)

let dangerZones = []
let lastWarning = 0

// SPEAK FUNCTION
function speak(msg){

const speech = new SpeechSynthesisUtterance(msg)
speech.lang="en-US"

speechSynthesis.speak(speech)

}

// CREATE MAP
useEffect(()=>{

if(mapRef.current) return

const map = L.map("map").setView([18.5204,73.8567],12)

L.tileLayer(
"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
).addTo(map)

mapRef.current = map

heatRef.current = L.heatLayer([],{

radius:30,
blur:20,

gradient:{
0.0:"green",
0.3:"lime",
0.5:"yellow",
0.7:"orange",
1.0:"red"
}

}).addTo(map)

loadHeatmap()

},[])

// LOAD HEATMAP DATA
async function loadHeatmap(){

const res = await API.get(
  "/api/heatmap"
);

dangerZones = res.data

dangerZones.forEach(p=>{

heatRef.current.addLatLng([
p.lat,
p.lng,
p.score
])

})

drawDangerZones(dangerZones)
drawDangerWaves(dangerZones)

}

// ANIMATED DANGER ZONES
function drawDangerZones(data){

data.forEach(p=>{

if(p.score > 0.6){

let lat = parseFloat(p.lat)
let lng = parseFloat(p.lng)

const pulse = L.circle([lat,lng],{

radius:120,
color:"red",
fillColor:"red",
fillOpacity:0.4,
weight:1

}).addTo(mapRef.current)

let grow = true

setInterval(()=>{

let r = pulse.getRadius()

if(grow){

pulse.setRadius(r+30)

if(r > 220) grow=false

}else{

pulse.setRadius(r-30)

if(r < 120) grow=true

}

},400)

}

})

}

function drawDangerWaves(data){

data.forEach(p=>{

if(p.score > 0.6){

let lat = parseFloat(p.lat)
let lng = parseFloat(p.lng)

let wave = L.circle([lat,lng],{

radius:80,
color:"red",
weight:2,
fillOpacity:0

}).addTo(mapRef.current)

let radius = 80
let opacity = 0.8

setInterval(()=>{

radius += 40
opacity -= 0.05

wave.setRadius(radius)

wave.setStyle({
opacity:opacity
})

if(radius > 500){

radius = 80
opacity = 0.8

}

},120)

}

})

}

// CHECK USER NEAR DANGER
function checkDanger(lat,lng){

dangerZones.forEach(p=>{

let dist = mapRef.current.distance(
[lat,lng],
[p.lat,p.lng]
)

if(dist < 150 && p.score > 0.6){

let now = Date.now()

// allow warning only every 30 seconds
if(now - lastWarning > 30000){

lastWarning = now

speak("Warning. You are entering a dangerous area")

}

}

})

}

// GEOCODE LOCATION
async function geocode(place){

const url =
`https://nominatim.openstreetmap.org/search?format=json&q=${place}`

const res = await fetch(url)
const data = await res.json()

if(!data.length) return null

return L.latLng(data[0].lat,data[0].lon)

}

// FIND SAFE ROUTE
async function findRoute(){

if(!start || !end){

alert("Enter locations")
return

}

setLoading(true)

const s = await geocode(start)
const e = await geocode(end)

if(!s || !e){

alert("Location not found")
setLoading(false)
return

}

if(routeRef.current){

mapRef.current.removeControl(routeRef.current)

}

routeRef.current = L.Routing.control({

waypoints:[s,e],
routeWhileDragging:false,
show:false

}).addTo(mapRef.current)

routeRef.current.on("routesfound", async function(e){

const coords = e.routes[0].coordinates

let points=[]

for(let i=0;i<coords.length;i+=5){

points.push({
lat:coords[i].lat,
lng:coords[i].lng
})

}

const res = await API.post(
  "/api/safe-route",
  { points }
);

setLoading(false)

if(!res.data.safe){

setDanger(true)

speak("Dangerous route detected")

}else{

setDanger(false)

speak("Safe route found")

}

})

}

// USER LOCATION TRACKING
useEffect(()=>{

if(!navigator.geolocation) return

navigator.geolocation.watchPosition(pos=>{

let lat = pos.coords.latitude
let lng = pos.coords.longitude

checkDanger(lat,lng)

})

},[])

return(

<div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 flex items-center justify-center p-6">

<motion.div
initial={{opacity:0,scale:0.9}}
animate={{opacity:1,scale:1}}
transition={{duration:0.5}}
className="backdrop-blur-lg bg-white/70 shadow-2xl rounded-3xl w-full max-w-5xl p-8"
>

<motion.h1
initial={{y:-20,opacity:0}}
animate={{y:0,opacity:1}}
className="text-3xl font-bold text-center text-pink-600 mb-6"
>

AI Safe Route Navigation

</motion.h1>

<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

<input
value={start}
onChange={e=>setStart(e.target.value)}
placeholder="Start location"
className="p-3 rounded-xl border focus:ring-2 focus:ring-pink-400"
/>

<input
value={end}
onChange={e=>setEnd(e.target.value)}
placeholder="Destination"
className="p-3 rounded-xl border focus:ring-2 focus:ring-purple-400"
/>

<motion.button
whileHover={{scale:1.05}}
whileTap={{scale:0.95}}
onClick={findRoute}
className="bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl p-3 font-semibold shadow-lg"
>

{loading ? "Finding Route..." : "Find Safe Route"}

</motion.button>

</div>

{danger && (

<motion.div
initial={{opacity:0}}
animate={{opacity:1}}
className="flex justify-center mb-4"
>

<div className="relative flex items-center gap-3 bg-red-100 text-red-600 px-4 py-2 rounded-xl shadow">

<div className="absolute w-4 h-4 bg-red-500 rounded-full animate-ping"></div>

<div className="w-4 h-4 bg-red-500 rounded-full"></div>

Dangerous route detected

</div>

</motion.div>

)}

<motion.div
initial={{opacity:0}}
animate={{opacity:1}}
transition={{delay:0.2}}
id="map"
className="h-[520px] rounded-2xl overflow-hidden shadow-xl"
/>

</motion.div>

</div>

)

}