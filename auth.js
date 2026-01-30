import mongoose from "mongoose";

const userschema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  about: { type: String },
  tags: { type: [String] },
  joinDate: { type: Date, default: Date.now },

  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  lastPostDate: Date,
  postCountToday: { type: Number, default: 0 }
});



export default mongoose.model("user", userschema);
