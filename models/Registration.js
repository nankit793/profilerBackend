const mongoose = require("mongoose");
const { Schema } = mongoose;

const Register = new Schema({
  userid: { type: String, required: true, lowercase: true, unique: true },
  password: { type: String, required: true },
  username: { type: String },
});

module.exports = mongoose.model("users", Register);
