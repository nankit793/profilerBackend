const mongoose = require("mongoose");
const { Schema } = mongoose;

const MediaDetails = new Schema({
  pid: { type: String, immutable: true, unique: true, sparse: true },
  uid: { type: String, immutable: true, unique: true, sparse: true },
  resume: { type: Buffer },
  autoResume: { type: Boolean, default: false },
  contentType: {
    type: String,
  },
  image: {
    type: Buffer,
  },
  imageName: {
    type: String,
  },
});

module.exports = mongoose.model("MediaDetails", MediaDetails);
