const BasicUserInfo = require("./BlogsData");
const mongoose = require("mongoose");
const PortfolioActivities = require("./PortfolioActivities");
const { Schema } = mongoose;

const Portfolio = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "BasicUserInfo",
    requred: true,
  },
  activites: {
    type: Schema.Types.ObjectId,
    ref: "PortfolioActivitiess",
    requred: true,
  },
  title: { type: String, default: "", maxLength: 60, default: "portfolio" },
  lastEdited: { type: Date, default: null },
  education: {
    type: [
      {
        institution: { type: String, default: "", maxLength: 200 },
        education: { type: String, default: "", maxLength: 100 },
        course: { type: String, default: "", maxLength: 200 },
        attending: { type: Boolean, default: false },
        from: { type: Date, default: "" },
        to: { type: Date, default: "" },
      },
    ],
  },
  experience: {
    type: [
      {
        designation: { type: String, default: "", maxLength: 60 },
        working: { type: Boolean, default: false },
        employementType: {
          type: String,
          enum: ["fullTime", "partTime", "contract", "internship"],
          default: "fullTime",
        },
        from: { type: Date, default: "" },
        to: { type: Date, default: "" },
        company: { type: String, default: "", maxLength: 60 },
        description: { type: String, default: "", maxLength: 1000 },
      },
    ],
    validate: [arrayLimit, " exceeds the limit of 10"],
  },
  skills: {
    type: [
      {
        skill: { type: String, default: "", maxLength: 60 },
        level: {
          type: String,
          enum: ["beginner", "intermediate", "expert"],
          default: "beginner",
        },
        month: {
          type: String,
          enum: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
          default: "1",
          maxLength: 2,
        },
        year: {
          type: String,
          maxLength: 4,
          default: "",
        },
      },
    ],
    validate: [arrayLimit, " exceeds the limit of 10"],
  },
  mail: { type: String, default: "", maxLength: 60 },
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
  projects: {
    type: [
      {
        title: { type: String, default: "", maxLength: 100 },
        url: { type: String, default: "", maxLength: 1000 },
        desc: { type: String, default: "", maxLength: 300 },
        from: { type: Date, default: "" },
        to: { type: Date, default: "" },
        working: { type: Boolean, default: false },
      },
    ],
  },
  about: { type: String, default: "", maxLength: 1000 },
});

function arrayLimit(val) {
  return val.length <= 10;
}
module.exports = mongoose.model("portfolio", Portfolio);
