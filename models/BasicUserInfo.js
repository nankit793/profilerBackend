const mongoose = require("mongoose");
const { Schema } = mongoose;

const BasicUserInfo = new Schema({
  id: { type: String, required: true },
  userid: { type: String, required: true, lowercase: true, unique: true },
  name: { type: String, default: "" },
  phone: { type: String, default: "" },
  profileImage: {
    image: { data: Buffer, contentType: String },
  },
  username: { type: String, default: "", unique: true },
  facebook: { type: String, default: "" },
  instagram: { type: String, default: "" },
  linkdn: { type: String, default: "" },
  github: { type: String, default: "" },
  youtube: { type: String, default: "" },
  dob: { type: Date, default: "" },
  joiningDate: { type: Date, default: new Date() },
  gender: { type: String, enum: ["m", "f", "tg", ""], default: "" },
  nationality: { type: String, default: "" },
  jobProfile: {
    generated: { type: Boolean, default: false },
    education: {
      type: [
        {
          institution: { type: String, default: "" },
          education: { type: String, default: "" },
          course: { type: String, default: "" },
          attending: { type: Boolean, default: false },
          from: { type: Date, default: "" },
          to: { type: Date, default: "" },
        },
      ],
    },
    experience: {
      type: [
        {
          designation: { type: String, default: "" },
          working: { type: Boolean, default: false },
          from: { type: Date, default: "" },
          to: { type: Date, default: "" },
          company: { type: String, default: "" },
          description: { type: String, default: "" },
        },
      ],
      validate: [arrayLimit, " exceeds the limit of 10"],
    },
    skills: {
      type: [{ type: String }],
      validate: [arrayLimit, " exceeds the limit of 10"],
    },
    mail: { type: String, default: "" },
    hobbies: {
      type: [{ type: String }],
      validate: [arrayLimit, " exceeds the limit of 10"],
    },
    certificates: {
      type: [
        {
          title: { type: String, default: "" },
          organization: { type: String, default: "" },
          recievedOn: { type: Date, default: "" },
          attending: { type: Boolean, default: false },
          image: { type: String, default: "" },
        },
      ],
    },
    // achievements: [
    //   {
    //     title: { type: String, default: "" },
    //     image: { type: String, default: "" },
    //   },
    // ],
    projects: {
      type: [
        {
          title: { type: String, default: "" },
          url: { type: String, default: "" },
          desc: { type: String, default: "" },
          from: { type: Date, default: "" },
          to: { type: Date, default: "" },
          working: { type: Boolean, default: false },
        },
      ],
    },
    about: { type: String, default: "" },
  },
});
function arrayLimit(val) {
  return val.length <= 10;
}
module.exports = mongoose.model("BasicUserInfo", BasicUserInfo);
