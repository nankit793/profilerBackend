const mongoose = require("mongoose");
const { Schema } = mongoose;
const BasicUserInfo = require("./BasicUserInfo");
const Registration = require("./Registration");

const FollowSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: BasicUserInfo,
      required: true,
      unique: true,
      immutable: true,
    },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: BasicUserInfo,
        select: false,
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: BasicUserInfo,
        // select: false,
      },
    ],
    followersCount: {
      type: Number,
      default: 0,
    },
    followingCount: {
      type: Number,
      default: 0,
    },
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        delete ret.followers;
        // delete ret.following;
        delete ret._id;
      },
    },
  }
);

// FollowSchema.virtual("followersCount").get(function () {
//   return this.followers.length;
// });

// FollowSchema.virtual("followingCount").get(function () {
//   return this.following.length;
// });

// FollowSchema.pre("save", async function () {
//   if (this.isModified("followers")) {
//     this.followers.sort((a, b) => a.username.localeCompare(b.username));
//   }
//   if (this.isModified("following")) {
//     this.following.sort((a, b) => a.username.localeCompare(b.username));
//   }
// });

FollowSchema.pre("save", function (next) {
  // this.followers.sort();
  this.following.sort();
  next();
});

module.exports = mongoose.model("followdata", FollowSchema);
