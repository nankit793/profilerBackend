const mongoose = require("mongoose");
const BasicUserInfo = require("./BasicUserInfo");
const PortFolios = require("./PortFolios");
const { Schema } = mongoose;
const PortfolioActivities = new Schema({
  portfolio: {
    type: Schema.Types.ObjectId,
    ref: "PortFolios",
    unique: true,
    required: true,
  },
  views: { type: Number, default: 0 },
  numLikes: { type: Number, default: 0 },

  reviews: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "BasicUserInfo",
        required: true,
      },
      text: { type: String, maxLength: 1000, minlength: 5, required: true },
      createdAt: { type: Date, default: Date.now },
      pinned: { type: Boolean, default: false },
      edited: { type: Boolean, default: false },
      select: false,
    },
  ],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BasicUserInfo",
      required: true,
    },
  ],
});

PortfolioActivities.virtual("numReviews").get(function () {
  console.log("first");
  return (this.reviews && this.reviews.length) || 0;
});

// Override the `toJSON` method to include the virtual property
PortfolioActivities.set("toJSON", {
  getters: true,
  virtuals: true,
});

module.exports = mongoose.model("portfolioactivities", PortfolioActivities);
