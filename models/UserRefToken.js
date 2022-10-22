const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserRefToken = new Schema({
  id: { type: String, required: true },
  refToken: { type: String, default: "" },
});

module.exports = mongoose.model("userRefTokens", UserRefToken);
