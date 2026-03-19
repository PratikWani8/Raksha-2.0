import { useState,useRef } from "react"
import { motion } from "framer-motion"
import Swal from "sweetalert2"

export default function SOS(){
const username = localStorage.getItem("username")
const [tracking,setTracking] = useState(false)
const sosIdRef = useRef(null)
const intervalRef = useRef(null)

/* GET LOCATION */
const getLocation = ()=>{
return new Promise((resolve,reject)=>{
navigator.geolocation.getCurrentPosition(

async(pos)=>{
const lat = pos.coords.latitude
const lon = pos.coords.longitude

const res = await fetch(
`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
)

const data = await res.json()

resolve({
location:data.display_name,
latitude:lat,
longitude:lon
})

},

()=>reject()
)
})
}

/* START SOS */
const startSOS = async()=>{

try{
const loc = await getLocation()

const res = await fetch(
"http://localhost:5000/api/sos/start",
{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({

username,
location:loc.location,
latitude:loc.latitude,
longitude:loc.longitude,
message:"Help! I am in danger."

})
}
)

const data = await res.json()

if(data.success){
sosIdRef.current = data.sosId

setTracking(true)

Swal.fire("SOS Activated","Live tracking started","success")

startTracking()

}

}catch{
Swal.fire("Error","Location failed","error")
}

}

/* START TRACKING */
const startTracking = ()=>{

intervalRef.current = setInterval(async()=>{

try{
const loc = await getLocation()

await fetch(
"http://localhost:5000/api/sos/update",
{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({

sosId:sosIdRef.current,
location:loc.location,
latitude:loc.latitude,
longitude:loc.longitude

})
}
)

}catch(err){

console.log("Tracking error")

}

},5000)

}


/* STOP SOS */
const stopSOS = async()=>{

clearInterval(intervalRef.current)

await fetch(
"http://localhost:5000/api/sos/stop",
{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({
sosId:sosIdRef.current
})
}
)

setTracking(false)

Swal.fire("SOS Stopped","Tracking cancelled","info")

}

return(

<div className="min-h-screen bg-[#fff5f8] flex flex-col items-center justify-center">

<motion.div
initial={{scale:0.8}}
animate={{scale:1}}
className="text-center bg-white p-8 rounded-2xl shadow-xl"
>

<h2 className="text-2xl font-bold text-[#e91e63]">
🚨 Emergency SOS
</h2>

<p className="text-gray-600 mt-2">
Location will update every 5 seconds
</p>

{!tracking ? (

<motion.button
whileHover={{scale:1.1}}
whileTap={{scale:0.9}}
onClick={startSOS}
className="mt-8 h-24 w-24 rounded-full bg-red-500 text-white text-lg font-bold shadow-lg animate-pulse"
>

SOS

</motion.button>

):(

<motion.button
whileHover={{scale:1.1}}
whileTap={{scale:0.9}}
onClick={stopSOS}
className="mt-8 h-24 w-24 rounded-full bg-gray-800 text-white text-lg font-bold shadow-lg"
>

STOP

</motion.button>

)}

<p className="text-sm text-gray-500 mt-4">
Tap the button or shake your phone
</p>

</motion.div>

<a href="/dashboard">
<button className="mt-6 w-80 bg-gray-200 py-2 rounded-full hover:bg-gray-300 transition">

⬅ Back to Dashboard

</button>
</a>

</div>



)

}