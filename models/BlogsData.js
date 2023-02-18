const mongoose = require("mongoose");
// const Registration = require("./Registration");
const { Schema } = mongoose;
const BasicUserInfo = require("./BasicUserInfo");
// Registration

const BlogsData = new Schema({
  // id: { type: String, required: true, immutable: true },
  heading: {
    type: String,
    default: "",
    required: true,
    maxLength: 60,
    immutable: true,
  },
  views: { type: Number, default: 0 },
  redirectURL: { type: String, default: "", maxLength: 2048 },
  uploadDate: { type: Date, default: new Date() },
  imageURL: { type: String, default: "", maxLength: 2048 },
  author: {
    type: Schema.Types.ObjectId,
    ref: BasicUserInfo,
    required: true,
    select: "userid name",
  },
  // authorEmail: { type: String, default: "", maxLength: 320, immutable: true},
  // authorName: { type: String, default: "", maxLength: 50 },
  tags: {
    type: String,
    enum: [
      "food",
      "travel",
      "healthFitness",
      "lifestyle",
      "fashionBeauty",
      "photography",
      "personal",
      "diyCraft",
      "parenting",
      "music",
      "business",
      "artDesign",
      "bookWriting",
      "personalFinance",
      "Sports",
      "News",
      "Movies",
      "Religion",
      "Political",
      "sports",
      "entertainment",
      "news",
      "general",
      "technology",
      "market",
    ],
    default: "general",
  },
  paragraphs: {
    type: [{ type: String, maxLength: 1000 }],
    validate: [arrayLimit, " exceeds the limit of 4"],
  },
});

function arrayLimit(val) {
  return val.length <= 4;
}

module.exports = mongoose.model("BlogsData", BlogsData);
