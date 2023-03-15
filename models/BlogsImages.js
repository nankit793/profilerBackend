const mongoose = require("mongoose");
const { Schema } = mongoose;

const BlogsImages = new Schema({
  blog: { type: String, required: true },
  // id: { type: String, required: true, immutable: true, unique: true },
  image: {
    type: Buffer,
  },
  tag: { type: String, default: "general" },
});

module.exports = mongoose.model("BlogsImages", BlogsImages);
