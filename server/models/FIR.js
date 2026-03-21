import mongoose from "mongoose"

const firSchema = new mongoose.Schema({

firSrNo:{
type:Number,
unique:true
},

userNo:{
type:String,
required:true
},

name:String,
phone:String,
location:String,

crimeType:String,
ipc:String,

description:String,
fir:String,

evidence:String,

date:{
type:Date,
default:Date.now
}

})

const FIR = mongoose.model("FIR",firSchema)

export default FIR