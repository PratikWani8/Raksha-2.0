import express from "express"
import SOS from "../models/SOS.js"

const router = express.Router()

router.post("/start", async (req,res)=>{

try{

const {username,location,latitude,longitude,message} = req.body

const lastSOS = await SOS.findOne().sort({sosId:-1})

const sosId = lastSOS ? lastSOS.sosId + 1 : 1

const sos = await SOS.create({

sosId,
username,
location,
latitude,
longitude,
message

})

req.io.emit("newSOS",{
sosId:sos.sosId,
username:sos.username,
location:sos.location,
latitude:sos.latitude,
longitude:sos.longitude,
message:sos.message,
createdAt:sos.createdAt,
type:"Registered"
})

res.json({
success:true,
sosId:sos._id
})

}catch(err){

res.json({error:"SOS failed"})

}

})

// UPDATE LOCATION
router.post("/update", async(req,res)=>{

try{

const {sosId,location,latitude,longitude} = req.body

await SOS.findByIdAndUpdate(sosId,{
location,
latitude,
longitude
})

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

// Stop SOS
router.post("/stop", async(req,res)=>{

try{

await SOS.findByIdAndUpdate(
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

// admin fetch sos
router.get("/admin", async (req,res)=>{

try{

const alerts = await SOS.find({active:true}).sort({createdAt:-1}).lean()

const formatted = alerts.map(s=>({

sosId:s.sosId,
username:s.username,
location:s.location,
latitude:s.latitude,
longitude:s.longitude,
message:s.message,
createdAt:s.createdAt,
type:"Registered"

}))

res.json(formatted)

}catch(err){

console.error(err)

res.status(500).json({
error:"Failed to fetch SOS alerts"
})

}

})

export default router