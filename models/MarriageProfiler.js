const mongoose = require("mongoose");
const { Schema } = mongoose;

const MarriageProfiler = new Schema({
  // id: { type: String, required: true },
  userid: { type: String, required: true, lowercase: true, unique: true },
  // name: { type: String, default: "" },
  // phone: { type: Array, default: "" },
  // bio: { type: String, default: "" },
  // facebook: { type: String, default: "" },
  // instagram: { type: String, default: "" },
  // linkdn: { type: String, default: "" },
  // github: { type: String, default: "" },
  // youtube: { type: String, default: "" },
  // currentLocation: { type: String, default: "" },
  // jobTitle: { type: String, default: "" },
  // joiningDate: { type: Date, default: new Date() },
  // jobLocation: { typr: String, default: "" },
});

module.exports = mongoose.model("MarriageProfiler", MarriageProfiler);
