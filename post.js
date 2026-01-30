import mongoose from "mongoose";

const PostSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  mediaUrl: { type: String, required: true },
  mediaType: { type: String, required: true }, // 'image' or 'video'
  caption: { type: String },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  comments: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Post", PostSchema);
