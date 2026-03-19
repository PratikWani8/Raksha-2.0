import express from "express"
import GuestSOS from "../models/GuestSOS.js"

const router = express.Router()

// start sos
router.post("/start", async (req,res)=>{

try{

const {location,latitude,longitude,message} = req.body

const lastSOS = await GuestSOS.findOne().sort({sosId:-1})

const sosId = lastSOS ? lastSOS.sosId + 1 : 1

const sos = await GuestSOS.create({

sosId,
location,
latitude,
longitude,
message

})

req.io.emit("newSOS",{
sosId:sos.sosId,
username:"Guest User",
location:sos.location,
latitude:sos.latitude,
longitude:sos.longitude,
message:sos.message,
createdAt:sos.createdAt,
type:"Guest"
})

res.json({
success:true,
sosId:sos._id
})

}catch(err){

res.json({error:"SOS failed"})

}

})

// update sos
router.post("/update", async(req,res)=>{

try{

const {sosId,location,latitude,longitude} = req.body

await GuestSOS.findByIdAndUpdate(
sosId,
{location,latitude,longitude}
)

req.io.emit("sosLocationUpdate",{
sosId,
location,
latitude,
longitude
})

res.json({success:true})

}catch(err){

res.json({error:"Update failed"})

}

})

// stop sos
router.post("/stop", async(req,res)=>{

try{

await GuestSOS.findByIdAndUpdate(
req.body.sosId,
{active:false}
)

req.io.emit("sosStopped",{
sosId:req.body.sosId
})

res.json({success:true})

}catch(err){

res.json({error:"Stop failed"})
}

})

// admin fectch guest sos
router.get("/admin", async (req,res)=>{

try{

const alerts = await GuestSOS.find({active:true})
.sort({createdAt:-1})
.lean()

const formatted = alerts.map(s=>({

sosId:s.sosId,
username:"Guest User",
location:s.location,
latitude:s.latitude,
longitude:s.longitude,
message:s.message,
createdAt:s.createdAt,
type:"Guest"

}))

res.json(formatted)

}catch(err){

console.error(err)

res.status(500).json({
error:"Failed to fetch guest SOS"
})

}

})

export default router