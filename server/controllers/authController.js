import User from "../models/User.js"
import axios from "axios"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"


// REGISTER 
export const register = async (req, res) => {

try {

const { name, email, phone, password, token } = req.body

if (!token) {
return res.json({ error: "Please verify you are human" })
}

const verify = await axios.post(
"https://challenges.cloudflare.com/turnstile/v0/siteverify",
new URLSearchParams({
secret: process.env.TURNSTILE_SECRET,
response: token
})
)

if (!verify.data.success) {
return res.json({ error: "Human verification failed" })
}

const existingUser = await User.findOne({ email })

if (existingUser) {
return res.json({ error: "Email already registered" })
}

const hashedPassword = await bcrypt.hash(password, 10)

const user = await User.create({
name,
email,
phone,
password: hashedPassword
})

const tokenJWT = jwt.sign(
{ id: user._id },
process.env.JWT_SECRET,
{ expiresIn: "7d" }
)

res.json({
message: "User registered",
token: tokenJWT,
userId: user._id,
name: user.name
})

} catch (error) {

console.error(error)

res.status(500).json({
error: "Server error"
})

}

}


// LOGIN 
export const login = async (req, res) => {

try {

const { email, password, token } = req.body

if (!token) {
return res.json({ error: "Please verify you are human" })
}

const verify = await axios.post(
"https://challenges.cloudflare.com/turnstile/v0/siteverify",
new URLSearchParams({
secret: process.env.TURNSTILE_SECRET,
response: token
})
)

if (!verify.data.success) {
return res.json({ error: "Human verification failed" })
}

const user = await User.findOne({ email })

if (!user) {
return res.json({ error: "Email not registered" })
}

const match = await bcrypt.compare(password, user.password)

if (!match) {
return res.json({ error: "Invalid password" })
}

const tokenJWT = jwt.sign(
{ id: user._id },
process.env.JWT_SECRET,
{ expiresIn: "7d" }
)

res.json({
message: "Login successful",
token: tokenJWT,
userId: user._id,
name: user.name
})

} catch (error) {

console.error(error)

res.status(500).json({
error: "Server error"
})

}

}


// GOOGLE LOGIN 
export const googleRegister = async (req, res) => {

try {

const { name, email, token } = req.body

if (!token) {
return res.json({ error: "Please verify you are human" })
}

const verify = await axios.post(
"https://challenges.cloudflare.com/turnstile/v0/siteverify",
new URLSearchParams({
secret: process.env.TURNSTILE_SECRET,
response: token
})
)

if (!verify.data.success) {
return res.json({ error: "Human verification failed" })
}

let user = await User.findOne({ email })

if (!user) {

user = await User.create({
name,
email,
password: ""
})

}

const tokenJWT = jwt.sign(
{ id: user._id },
process.env.JWT_SECRET,
{ expiresIn: "7d" }
)

res.json({
message: "User logged in",
token: tokenJWT,
userId: user._id,
name: user.name
})

} catch (error) {

console.error(error)

res.status(500).json({
error: "Server error"
})

}

}