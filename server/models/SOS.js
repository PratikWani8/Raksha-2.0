import mongoose from "mongoose"

const sosSchema = new mongoose.Schema({

sosId:Number,

username:{
type:String,
required:true
},

location:{
type:String,
required:true
},

latitude:Number,
longitude:Number,

message:String,

active:{
type:Boolean,
default:true
}

},{timestamps:true})

export default mongoose.model("SOS",sosSchema)