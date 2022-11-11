const Registeration = require("../../models/Registration");
const express = require("express");
const app = express();
const { body, validationResult } = require("express-validator");

app.post("/", async (req, res) => {
  const { userRegistration, isOTP, userid } = req.body;
  if (!userid) {
    return res.status(401).json({ mesage: "empty headers" });
  }

  const user = await Registeration.findOne({ userid: userid });
  if ((user && userRegistration) || (!user && !userRegistration)) {
    if (isOTP) {
      let otp;
      otp = Math.floor(100000 + Math.random() * 900000);
      return res
        .status(200)
        .json({ message: "OTP Generated Successfully", otp: otp });
    } else {
      return res.status(200).json({ message: "success" });
    }
  }
  if (user && !userRegistration) {
    return res.status(403).json({ message: "User already existing" });
  }
  if (!user && userRegistration) {
    return res.status(401).json({ message: "user does not exist" });
  }
  //   return res.status(401).json({ message: "error occurred" });
});

module.exports = app;
