const mongoose = require("mongoose");
const { Schema } = mongoose;

const BasicUserInfo = new Schema({
  id: { type: String, required: true },
  userid: { type: String, required: true, lowercase: true, unique: true },
  name: { type: String, default: "" },
  phone: { type: Array, default: "" },
  username: { type: String, default: "" },
  slogan: { type: String, default: "" },
  bio: { type: String, default: "" },
  facebook: { type: String, default: "" },
  instagram: { type: String, default: "" },
  linkdn: { type: String, default: "" },
  github: { type: String, default: "" },
  youtube: { type: String, default: "" },
  zodiac: { type: String, default: "" },
  height: { type: String, default: "" },
  weight: { type: String, default: "" },
  currentLocation: { type: String, default: "" },
  jobTitle: { type: String, default: "" },
  dob: { type: Date, default: "" },
  joiningDate: { type: Date, default: new Date() },
  gender: { type: String, enum: ["m", "f", "tg", ""], default: "" },
  nationality: { type: String, default: "" },
  // jobProfile: {
  //   generated: { type: Boolean, default: false },
  //   views: { type: String, default: "0" },
  // },
});

module.exports = mongoose.model("BasicUserInfo", BasicUserInfo);
