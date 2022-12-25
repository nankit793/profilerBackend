const mongoose = require("mongoose");
const { Schema } = mongoose;

const BasicUserInfo = new Schema({
  id: { type: String, required: true },
  userid: { type: String, required: true, lowercase: true, unique: true },
  name: { type: String, default: "" },
  phone: { type: Array, default: "" },
  profileImage: {
    image: { data: Buffer, contentType: String },
    name: { type: String, default: "profile image" },
  },
  username: { type: String, default: "" },
  slogan: { type: String, default: "" },
  bio: { type: String, default: "" },
  facebook: { type: String, default: "" },
  instagram: { type: String, default: "" },
  linkdn: { type: String, default: "" },
  github: { type: String, default: "" },
  youtube: { type: String, default: "" },
  zodiac: { type: String, default: "" },
  height: { type: Number, default: "" },
  weight: { type: Number, default: "" },
  currentLocation: { type: String, default: "" },
  jobTitle: { type: String, default: "" },
  dob: { type: Date, default: "" },
  joiningDate: { type: Date, default: new Date() },
  gender: { type: String, enum: ["m", "f", "tg", ""], default: "" },
  nationality: { type: String, default: "" },
  jobProfile: {
    generated: { type: Boolean, default: false },
    location: { type: String, default: "" },
    designation: { type: String, default: "" },
    education: { type: Array, default: [] },
    experience: { type: Array, default: [] },
    skills: { type: Array, default: [] },
    mail: { type: String, default: "" },
    hobbies: { type: Array, default: [] },
    certificates: { type: Array, default: [] },
    achievements: { type: Array, default: [] },
    projects: { type: Array, default: [] },
  },
});

module.exports = mongoose.model("BasicUserInfo", BasicUserInfo);
