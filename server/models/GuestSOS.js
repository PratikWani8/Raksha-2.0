import mongoose from "mongoose"

const guestSOSSchema = new mongoose.Schema({

sosId:Number,

location:String,

latitude:Number,

longitude:Number,

message:String,

active:{
type:Boolean,
default:true
}

},{timestamps:true})

export default mongoose.model("GuestSOS",guestSOSSchema)