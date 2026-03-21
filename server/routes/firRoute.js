import express from "express"
import FIR from "../models/FIR.js"
import multer from "multer"

const router = express.Router()

// Multer configuration
const storage = multer.diskStorage({
destination:(req,file,cb)=>{
cb(null,"uploads/")
},
filename:(req,file,cb)=>{
cb(null,Date.now()+"-"+file.originalname)
}
})

const upload = multer({storage})

// Submit FIR
router.post("/", upload.single("evidence"), async (req,res)=>{

try{

// find last FIR
const lastFIR = await FIR.findOne().sort({firSrNo:-1})

let nextSrNo = 1

if(lastFIR){
nextSrNo = lastFIR.firSrNo + 1
}

const fir = new FIR({

firSrNo:nextSrNo,
userNo:req.body.userNo,

name:req.body.name,
phone:req.body.phone,

location:req.body.location,

crimeType:req.body.crimeType,
ipc:req.body.ipc,

description:req.body.description,
fir:req.body.fir,

// evidence file
evidence:req.file ? req.file.filename : null

})

await fir.save()

res.json({
message:"FIR submitted successfully",
firSrNo:nextSrNo
})

}catch(err){

console.log(err)
res.status(500).json({error:"Server error"})

}

})

// Admin view FIR list
router.get("/", async (req,res)=>{

try{

const data = await FIR.find().sort({firSrNo:-1})

res.json(data)

}catch(err){

console.log(err)
res.status(500).json({error:"Server error"})

}

})

export default router