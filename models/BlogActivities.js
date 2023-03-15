const BlogsData = require("./BlogsData");
const mongoose = require("mongoose");
const { Schema } = mongoose;
const BlogActivities = new Schema({
  blog: {
    type: Schema.Types.ObjectId,
    ref: "BlogsData",
    unique: true,
    required: true,
  },
  views: { type: Number, default: 0 },
  blogUpload: { type: Date, default: Date.now },
  blogUpdated: { type: Date, default: null },
  numComments: { type: Number, default: 0 },
  numLikes: { type: Number, default: 0 },
});

module.exports = mongoose.model("blogactivities", BlogActivities);
