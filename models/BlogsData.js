const mongoose = require("mongoose");
const { Schema } = mongoose;
const BasicUserInfo = require("./BasicUserInfo");
const BlogActivities = require("./BlogActivities");

const CommentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "BasicUserInfo",
    required: true,
  },
  text: { type: String, maxLength: 500, minlength: 5, required: true },
  createdAt: { type: Date, default: Date.now },
  pinned: { type: Boolean, default: false },
  edited: { type: Boolean, default: false },
});

const BlogsData = new Schema({
  heading: {
    type: String,
    default: "",
    required: true,
    maxLength: 60,
  },
  redirectURL: { type: String, default: "", maxLength: 2048 },
  selectedRedirection: {
    type: String,
    enum: ["website", "youtube"],
    default: "website",
  },
  imageURL: { type: String, default: "", maxLength: 2048, immutable: true },
  author: {
    type: Schema.Types.ObjectId,
    ref: "BasicUserInfo",
    required: true,
    immutable: true,
  },
  comments: [CommentSchema],
  activities: {
    type: Schema.Types.ObjectId,
    ref: BlogActivities,
    required: true,
  },
  tag: {
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
      "sharemarket",
    ],
    default: "general",
  },
  paragraphs: {
    type: [
      {
        paragraph: { type: String, maxLength: 1000 },
        subHead: { type: String, maxLength: 60 },
        imageURL: {
          type: String,
          default: "",
          maxLength: 2048,
          immutable: true,
        },
      },
    ],
    validate: [arrayLimit, " exceeds the limit of 4"],
  },
  summary: {
    type: String,
    default: "",
    maxLength: 1000,
  },
});

function arrayLimit(val) {
  return val.length <= 4;
}

BlogsData.index({ author: -1, heading: -1 });

module.exports = mongoose.model("BlogsData", BlogsData);
