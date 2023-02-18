const mongoose = require("mongoose");
const { Schema } = mongoose;
const { BasicUserInfo } = require("./BasicUserInfo");
const Register = new Schema({
  userid: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    immutable: true,
  },
  otp: {
    type: String,
    // required: true,
    select: false,
  },
  fpOTP: {
    type: String,
    // required: true,
    select: false,
  },
  verified: { type: Boolean, default: false },
  password: { type: String, required: true, select: false },
  username: { type: String, unique: true, unique: true },
});

module.exports = mongoose.model("users", Register);
