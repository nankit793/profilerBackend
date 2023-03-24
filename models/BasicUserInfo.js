const mongoose = require("mongoose");
const PortFolios = require("./PortFolios");
const { Schema } = mongoose;

const BasicUserInfo = new Schema({
  id: { type: String, required: true, unique: true, immutable: true },
  userid: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    immutable: true,
  },
  name: { type: String, default: "", maxLength: 30 },
  bookMarks: [
    {
      // bookmark: {
      type: Schema.Types.ObjectId,
      ref: "BlogsData",
      required: true,
      select: false,
      // },
    },
  ],
  phone: { type: String, default: "", maxLength: 30 },
  username: { type: String, default: "", unique: true, sparse: true },
  facebook: { type: String, default: "" },
  instagram: { type: String, default: "" },
  linkdn: { type: String, default: "" },
  github: { type: String, default: "" },
  youtube: { type: String, default: "" },
  dob: { type: Date, default: "" },
  joiningDate: { type: Date, default: new Date() },
  gender: { type: String, enum: ["m", "f", "tg", ""], default: "" },
  nationality: { type: String, default: "" },
  portfolioGenerated: { type: Boolean, default: false },
  portfolios: [
    {
      type: Schema.Types.ObjectId,
      ref: PortFolios,
      required: true,
    },
  ],
});
function arrayLimit(val) {
  return val.length <= 10;
}
module.exports = mongoose.model("BasicUserInfo", BasicUserInfo);
