const BlogsData = require("./BlogsData");
const mongoose = require("mongoose");
const { Schema } = mongoose;
const trendingBlogs = new Schema({
  blog: {
    type: Schema.Types.ObjectId,
    ref: "BlogsData",
    unique: true,
    required: true,
  },
});

module.exports = mongoose.model("trendingblogs", trendingBlogs);
