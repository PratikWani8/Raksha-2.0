import { useEffect,useRef,useState } from "react"
import axios from "axios"
import { BASE_URL } from "../api/api"
import { io } from "socket.io-client"
import { motion } from "framer-motion"

const socket = io(BASE_URL, {
  transports: ["websocket"],
});

export default function LiveEvidence(){

const videoRef = useRef(null)
const peerConnections = useRef({})

const [user,setUser] = useState(null)
const [stream,setStream] = useState(null)
const [live,setLive] = useState(false)
const [location,setLocation] = useState("Detecting...")

/* FETCH USER FROM DB */
useEffect(() => {

  const fetchUser = async () => {

    try {

      const res = await API.get(
        "/api/auth/profile",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setUser(res.data);

    } catch (err) {

      console.log("User fetch error:", err);

    }
  };

  fetchUser();

}, []);

/* GET LOCATION */
const detectLocation = ()=>{

return new Promise((resolve)=>{

navigator.geolocation.getCurrentPosition(async(pos)=>{

const lat = pos.coords.latitude
const lng = pos.coords.longitude

try{

const geo = await axios.get(
`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
)

resolve(geo.data.display_name)

}catch{

resolve("Unknown location")

}

})

})

}

/* START LIVE */
const startLive = async()=>{

const liveLocation = await detectLocation()   
setLocation(liveLocation)

const mediaStream = await navigator.mediaDevices.getUserMedia({
video:true,
audio:true
})

videoRef.current.srcObject = mediaStream

setStream(mediaStream)
setLive(true)

socket.emit("start_live",{
userId:user.userNo,
name:user.name,
phone:user.phone,
location: liveLocation   
})

socket.on("offer",async(data)=>{

const pc = new RTCPeerConnection({
iceServers:[
{ urls:"stun:stun.l.google.com:19302" }
]
})

peerConnections.current[data.sender] = pc

mediaStream.getTracks().forEach(track=>{
pc.addTrack(track,mediaStream)
})

await pc.setRemoteDescription(new RTCSessionDescription(data.offer))

const answer = await pc.createAnswer()

await pc.setLocalDescription(answer)

socket.emit("answer",{
target:data.sender,
answer
})

pc.onicecandidate=(event)=>{

if(event.candidate){

socket.emit("ice_candidate",{
target:data.sender,
candidate:event.candidate
})

}

}

})

}

/* STOP */
const stopLive = ()=>{

if(stream){
stream.getTracks().forEach(track=>track.stop())
}

setLive(false)

socket.emit("stop_live")

}

return(

<div className="min-h-screen bg-linear-to-br from-indigo-900 via-purple-900 to-black flex items-center justify-center p-6">

<motion.div
initial={{opacity:0,scale:0.8}}
animate={{opacity:1,scale:1}}
transition={{duration:0.5}}
className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-8 w-full max-w-xl"
>

<div className="flex justify-between items-center mb-6">

<h1 className="text-white text-2xl font-bold">
Live Evidence
</h1>

{live && (
<span className="text-red-400 text-sm animate-pulse">
LIVE
</span>
)}

</div>

<video
ref={videoRef}
autoPlay
playsInline
muted
className="rounded-xl w-full border border-white/20"
/>

{user &&(

<div className="text-white text-sm mt-4 space-y-1">

<p><b>Name:</b> {user.name}</p>
<p><b>Phone:</b> {user.phone}</p>
<p><b>Location:</b> {location}</p>

</div>

)}

<div className="flex gap-4 mt-6">

<motion.button
whileHover={{scale:1.05}}
whileTap={{scale:0.9}}
onClick={startLive}
className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg"
>

Start Live

</motion.button>

<motion.button
whileHover={{scale:1.05}}
whileTap={{scale:0.9}}
onClick={stopLive}
className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg"
>

Stop Live

</motion.button>

</div>

<p className="text-xs text-white/60 mt-4 text-center">
Your camera stream is securely sent to Raksha control room.
</p>

</motion.div>

</div>

)

}
