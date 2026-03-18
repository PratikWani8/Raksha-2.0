import mongoose from "mongoose"
import Counter from "./Counter.js"

const userSchema = new mongoose.Schema({

  userSrNo: {
    type: Number,
    unique: true
  },

  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  phone: {
    type: String
  },

  password: {
    type: String,
    default: ""
  }

}, { timestamps: true })


// AUTO INCREMENT USER SR NO
userSchema.pre("save", async function () {

  if (!this.isNew) return

  const counter = await Counter.findOneAndUpdate(
    { id: "userSrNo" },
    { $inc: { seq: 1 } },
    { returnDocument: "after", upsert: true }
  )

  this.userSrNo = counter.seq

})

export default mongoose.model("User", userSchema)