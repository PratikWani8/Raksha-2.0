import { useState } from "react"
import { motion } from "framer-motion"
import { Turnstile } from "@marsidev/react-turnstile"
import { signInWithPopup } from "firebase/auth"
import confetti from "canvas-confetti"
import LoginModal from "./LoginModal"
import { auth, provider } from "../firebase"

import {
Dialog,
DialogContent,
DialogHeader,
DialogTitle,
DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function RegisterModal({ trigger }) {

const [captchaToken,setCaptchaToken] = useState("")
const [loading,setLoading] = useState(false)

const [showPassword,setShowPassword] = useState(false)
const [showConfirmPassword,setShowConfirmPassword] = useState(false)

const [passwordStrength,setPasswordStrength] = useState("")
const [strengthWidth,setStrengthWidth] = useState("0%")

const [success,setSuccess] = useState(false)
const [shake,setShake] = useState(false)

const getPasswordStrength = (password)=>{

let strength="Weak"
let width="33%"

if(password.length>=6){
strength="Medium"
width="66%"
}

if(password.match(/[A-Z]/) && password.match(/[0-9]/) && password.length>=8){
strength="Strong"
width="100%"
}

setPasswordStrength(strength)
setStrengthWidth(width)

}

const handleRegister = async (e)=>{

e.preventDefault()

const formData=new FormData(e.target)

const name=formData.get("name")
const email=formData.get("email")
const phone=formData.get("phone")
const password=formData.get("password")
const confirmPassword=formData.get("confirmPassword")

if(!name || !email || !phone || !password || !confirmPassword){

setShake(true)
setTimeout(()=>setShake(false),500)
return

}

if(password!==confirmPassword){

alert("Passwords do not match")

setShake(true)
setTimeout(()=>setShake(false),500)

return
}

if(!captchaToken){

alert("Please verify captcha")

setShake(true)
setTimeout(()=>setShake(false),500)

return
}

const confirmSubmit=window.confirm("Do you want to submit the registration form?")

if(!confirmSubmit) return

setLoading(true)

try{

const res=await fetch(
"http://localhost:5000/api/auth/register",
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
name,
email,
phone,
password,
token:captchaToken
})
}
)

const data=await res.json()

if(data.userId){

localStorage.setItem("userId",data.userId)
localStorage.setItem("username",data.name)

confetti({
particleCount:150,
spread:90
})

setSuccess(true)

setTimeout(()=>{
window.location.href="/dashboard"
},2000)

}else{

alert(data.error)

}

}catch{

alert("Registration failed")

}

setLoading(false)

}

const googleSignup = async()=>{

if(!captchaToken){
alert("Please verify captcha first")
return
}

try{

const result=await signInWithPopup(auth,provider)

const user=result.user

const res=await fetch(
"http://localhost:5000/api/auth/google-register",
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
name:user.displayName,
email:user.email,
token:captchaToken
})
}
)

const data=await res.json()

if(data.userId){

localStorage.setItem("userId",data.userId)
localStorage.setItem("username",data.name)

confetti({
particleCount:150,
spread:90
})

setSuccess(true)

setTimeout(()=>{
window.location.href="/dashboard"
},2000)

}

}catch(error){

alert("Google Signup Failed")
console.error(error)

}

}

return(

<Dialog>

<DialogTrigger asChild>
{trigger}
</DialogTrigger>

<DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto bg-white/70 backdrop-blur-xl border border-pink-200 shadow-xl">

<motion.div
animate={shake ? {x:[-10,10,-10,10,0]}:{}}
transition={{duration:0.4}}
>

{success ?(

<div className="text-center py-10">

<motion.div
initial={{scale:0}}
animate={{scale:1}}
className="text-green-600 text-6xl"
>
✔
</motion.div>

<h2 className="text-2xl font-bold mt-4 text-[#e91e63]">
Registration Successful
</h2>

<p className="text-gray-600 mt-2">
Redirecting to dashboard...
</p>

</div>

):( 

<>
<DialogHeader>

<DialogTitle className="text-center text-2xl font-bold text-[#e91e63]">
User Registration
</DialogTitle>

</DialogHeader>

<form onSubmit={handleRegister} className="space-y-4 mt-4">

<div>

<Label>Full Name</Label>

<Input
name="name"
placeholder="Enter full name"
required
/>

</div>

<div>

<Label>Email</Label>

<Input
type="email"
name="email"
placeholder="Enter email"
required
/>

</div>

<div>

<Label>Phone</Label>

<Input
name="phone"
placeholder="10 digit number"
required
/>

</div>

<div>

<Label>Password</Label>

<div className="relative">

<Input
type={showPassword ? "text":"password"}
name="password"
placeholder="Min 6 characters"
required
onChange={(e)=>getPasswordStrength(e.target.value)}
/>

<span
onClick={()=>setShowPassword(!showPassword)}
className="absolute right-3 top-2 cursor-pointer text-sm text-gray-500"
>
{showPassword ? "Hide":"Show"}
</span>

</div>

<div className="w-full h-2 bg-gray-200 rounded mt-2">

<motion.div
animate={{width:strengthWidth}}
className={`h-2 rounded ${
passwordStrength==="Weak"
?"bg-red-500"
:passwordStrength==="Medium"
?"bg-yellow-500"
:"bg-green-500"
}`}
/>

</div>

<p className="text-xs text-gray-500">
Strength: {passwordStrength}
</p>

</div>

<div>

<Label>Confirm Password</Label>

<div className="relative">

<Input
type={showConfirmPassword ? "text":"password"}
name="confirmPassword"
placeholder="Re-enter password"
required
/>

<span
onClick={()=>setShowConfirmPassword(!showConfirmPassword)}
className="absolute right-3 top-2 cursor-pointer text-sm text-gray-500"
>
{showConfirmPassword ? "Hide":"Show"}
</span>

</div>

</div>

<div className="flex justify-center">

<Turnstile
siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
onSuccess={(token)=>setCaptchaToken(token)}
/>

</div>

<Button
disabled={loading || !captchaToken}
className="w-full bg-[#e91e63] hover:bg-[#c2185b] text-white flex items-center justify-center gap-2"
>

{loading ? (
<>
<span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
Registering...
</>
):(
"Register"
)}

</Button>

<div className="flex items-center gap-3 my-4">

<div className="flex-1 h-px bg-gray-300"></div>

<span className="text-sm text-gray-500">
OR Sign up with
</span>

<div className="flex-1 h-px bg-gray-300"></div>

</div>

<Button
type="button"
variant="outline"
className="w-full flex gap-2"
onClick={googleSignup}
>

<img
src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
className="w-4"
/>

Sign up with Google

</Button>

<p className="text-center text-sm text-gray-600 mt-4">

Already registered?{" "}

<LoginModal
trigger={
<span className="text-[#e91e63] font-semibold hover:underline cursor-pointer">
Login
</span>
}
/>

</p>

</form>
</>
)}

</motion.div>

</DialogContent>

</Dialog>

)

}