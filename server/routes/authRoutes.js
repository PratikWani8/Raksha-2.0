import express from "express"
import jwt from "jsonwebtoken"

import User from "../models/User.js"

import {
register,
login,
googleRegister
} from "../controllers/authController.js"

const router = express.Router()


// AUTH MIDDLEWARE
const authMiddleware = (req,res,next)=>{

const authHeader = req.headers.authorization

if(!authHeader){
return res.status(401).json({error:"No token"})
}

const token = authHeader.split(" ")[1]

try{

const decoded = jwt.verify(token,process.env.JWT_SECRET)

req.user = decoded

next()

}catch(err){

return res.status(401).json({error:"Invalid token"})

}

}


// REGISTER
router.post("/register", register)


// LOGIN
router.post("/login", login)


// GOOGLE REGISTER
router.post("/google-register", googleRegister)


// PROFILE
router.get("/profile", authMiddleware, async (req,res)=>{

try{

const user = await User.findById(req.user.id).select("-password")

if(!user){
return res.status(404).json({error:"User not found"})
}

res.json({
userNo:user._id,
name:user.name,
phone:user.phone
})

}catch(err){

console.log("Profile Error:",err)

res.status(500).json({
error:"Failed to fetch profile"
})

}

})


export default router