const mongoose = require("mongoose");
const BasicUserInfo = require("./BasicUserInfo");
const BlogsData = require("./BlogsData");
const { Schema } = mongoose;
const likes = new Schema({
  // id: { type: String, required: true, immutable: true, unique: true },
  blog: {
    type: Schema.Types.ObjectId,
    ref: BlogsData,
    unique: true,
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: BasicUserInfo,
      required: true,
    },
  ],
  totalLikes: { type: Number, default: 0 },
});

likes.index({ likes: -1 });

module.exports = mongoose.model("likes", likes);
