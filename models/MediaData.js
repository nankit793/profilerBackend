const mongoose = require("mongoose");
const { Schema } = mongoose;

const MediaDetails = new Schema({
  id: { type: String, required: true, immutable: true, unique: true },
  resume: { type: Buffer },
  autoResume: { type: Boolean, default: false },
  contentType: {
    type: String,
    // required: true,
  },
  image: {
    type: Buffer,
    required: true,
  },
  imageName: {
    type: String,
    // required: true,
  },
});

module.exports = mongoose.model("MediaDetails", MediaDetails);
