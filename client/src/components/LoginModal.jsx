import { useState } from "react"
import { motion } from "framer-motion"
import { Turnstile } from "@marsidev/react-turnstile"
import { signInWithPopup } from "firebase/auth"
import RegisterModal from "./RegisterModal"
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

export default function LoginModal({ trigger }) {

const [captchaToken,setCaptchaToken] = useState("")
const [loading,setLoading] = useState(false)

const handleLogin = async (e) => {

e.preventDefault()

if(!captchaToken){
alert("Please verify captcha")
return
}

setLoading(true)

const formData = new FormData(e.target)

const email = formData.get("email")
const password = formData.get("password")

try{

const res = await fetch(
"http://localhost:5000/api/auth/login",
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
email,
password,
token:captchaToken
})
}
)

const data = await res.json()

if(data.userId){

localStorage.setItem("token",data.token)
localStorage.setItem("userId",data.userId)
localStorage.setItem("username",data.name)


window.location.href="/dashboard"

}else{

alert(data.error)

}

}catch{

alert("Login failed")

}

setLoading(false)

}

const googleLogin = async () => {

if(!captchaToken){
alert("Verify captcha first")
return
}

try{

const result = await signInWithPopup(auth,provider)

const user = result.user

const res = await fetch(
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

const data = await res.json()

if(data.userId){
    
localStorage.setItem("token",data.token)
localStorage.setItem("userId",data.userId)
localStorage.setItem("username",data.name)

window.location.href="/dashboard"

}

}catch(err){

alert("Google login failed")
console.error(err)

}

}

return(

<Dialog>

<DialogTrigger asChild>
{trigger}
</DialogTrigger>

<DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto bg-white/70 backdrop-blur-xl border border-pink-200 shadow-xl">

<motion.div
initial={{opacity:0,scale:0.9}}
animate={{opacity:1,scale:1}}
transition={{duration:0.3}}
>

<DialogHeader>

<DialogTitle className="text-center text-2xl font-bold text-[#e91e63]">
User Login
</DialogTitle>

</DialogHeader>

<form onSubmit={handleLogin} className="space-y-4 mt-4">

<div>

<Label>Email</Label>

<Input
name="email"
type="email"
placeholder="Enter email"
required
/>

</div>

<div>

<Label>Password</Label>

<Input
name="password"
type="password"
placeholder="Enter password"
required
/>

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
Logging in...
</>
) : (
"Login"
)}

</Button>

<div className="flex items-center gap-3 my-4">

<div className="flex-1 h-px bg-gray-300"></div>

<span className="text-sm text-gray-500">
OR Login with
</span>

<div className="flex-1 h-px bg-gray-300"></div>

</div>

<Button
type="button"
variant="outline"
className="w-full flex gap-2"
onClick={googleLogin}
>

<img
src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
className="w-4"
/>

Sign in with Google

</Button>

<p className="text-center text-sm text-gray-600 mt-4">

New user?{" "}

<RegisterModal
trigger={
<span className="text-[#e91e63] font-semibold hover:underline cursor-pointer">
Register here
</span>
}
/>

</p>

</form>

</motion.div>

</DialogContent>

</Dialog>

)

}