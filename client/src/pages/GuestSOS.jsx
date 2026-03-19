import { useState,useRef,useEffect } from "react"
import { motion } from "framer-motion"
import Swal from "sweetalert2"

export default function GuestSOS(){

const [message,setMessage] = useState("Help! I am in danger.")
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
"http://localhost:5000/api/guest-sos/start",
{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({
location:loc.location,
latitude:loc.latitude,
longitude:loc.longitude,
message
})
}
)

const data = await res.json()

if(data.success){

sosIdRef.current = data.sosId

setTracking(true)

Swal.fire(
"SOS Activated",
"Live tracking started",
"success"
)

startTracking()

}

}catch{

Swal.fire("Error","Location failed","error")

}

}


/* UPDATE LOCATION EVERY 5 SECONDS */

const startTracking = ()=>{

intervalRef.current = setInterval(async()=>{

try{

const loc = await getLocation()

await fetch(
"http://localhost:5000/api/guest-sos/update",
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
"http://localhost:5000/api/guest-sos/stop",
{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({
sosId:sosIdRef.current
})
}
)

setTracking(false)

Swal.fire(
"SOS Stopped",
"Tracking cancelled",
"info"
)

}


/* SHAKE DETECTION */

useEffect(()=>{

let lastX=0,lastY=0,lastZ=0
let threshold=15
let lastShake=0

const detectShake=(event)=>{

const acc=event.accelerationIncludingGravity
if(!acc) return

let diffX=Math.abs(acc.x-lastX)
let diffY=Math.abs(acc.y-lastY)
let diffZ=Math.abs(acc.z-lastZ)

if(diffX+diffY+diffZ > threshold){

let now=new Date().getTime()

if(now-lastShake > 5000){

lastShake=now

Swal.fire(
"Shake detected",
"Sending SOS...",
"warning"
)

startSOS()

}

}

lastX=acc.x
lastY=acc.y
lastZ=acc.z

}

window.addEventListener("devicemotion",detectShake)

return ()=>window.removeEventListener("devicemotion",detectShake)

},[])


return(

<div className="min-h-screen bg-[#fff5f8] flex flex-col items-center justify-center">

<motion.div
initial={{scale:0.9}}
animate={{scale:1}}
className="bg-white p-8 rounded-2xl shadow-xl text-center"
>

<h2 className="text-2xl font-bold text-[#e91e63]">
🚨 Emergency SOS (Guest)
</h2>

<p className="text-gray-600 mt-2">
Location updates every 5 seconds
</p>

<label className="block text-left mt-4 font-medium">
Emergency Message
</label>

<textarea
value={message}
onChange={(e)=>setMessage(e.target.value)}
className="w-full border rounded-lg p-2 mt-1"
rows="3"
/>

{!tracking ? (

<motion.button
whileHover={{scale:1.1}}
whileTap={{scale:0.9}}
onClick={startSOS}
className="mt-8 h-24 w-24 rounded-full bg-red-500 text-white font-bold shadow-lg animate-pulse"
>

SOS

</motion.button>

):( 

<motion.button
whileHover={{scale:1.1}}
whileTap={{scale:0.9}}
onClick={stopSOS}
className="mt-8 h-24 w-24 rounded-full bg-gray-800 text-white font-bold shadow-lg"
>

STOP

</motion.button>

)}

<p className="text-sm text-gray-500 mt-4">
Tap the button or shake your phone
</p>

</motion.div>

</div>

)

}