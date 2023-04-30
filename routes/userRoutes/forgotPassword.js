const express = require("express");
const app = express();
const { body, validationResult } = require("express-validator");
const Registeration = require("../../models/Registration");
const otpGenerator = require("otp-generator");

const bcryptjs = require("bcryptjs");
app.post(
  "/",
  [
    body("userid", "Enter valied email").isEmail(),
    body("newPassword", "Enter Valid Password").isLength({ min: 5 }),
    body("confirmPassword", "password do not match").isLength({ min: 5 }),
  ],

  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
      }
      let user = await Registeration.findOne({
        userid: req.body.userid,
      }).select("+fpOTP verified");
      if (!user) {
        return res.status(400).json({ message: "user was not found" });
      }
      if (!user.verified) {
        return res.status(401).json({ message: "user is not verified" });
      }
      if (!user.fpOTP) {
        return res.status(401).json({ message: "generate otp first" });
      }
      const { otp, newPassword, confirmPassword } = req.body;
      if (!otp) {
        return res.status(401).json({ message: "OTP is required" });
      }
      if (newPassword !== confirmPassword) {
        return res.status(401).json({ message: "password do not match" });
      }
      const otpCompare = await bcryptjs.compare(otp, user.fpOTP);
      if (!otpCompare) {
        return res.status(401).json({ message: "wrong otp try again" });
      }
      console.log("here");
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(req.body.newPassword, salt);
      user.password = hashedPassword;
      user.fpOTP = null;
      await user.save();
      res.status(200).json({ message: "Your new password has been set" });
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  }
);

app.post(
  "/regenrateOTP",
  [body("userid", "Enter valied email").isEmail()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ message: errors.array() });
      }
      const { userid } = req.body;
      if (!userid) {
        return res.status(401).json({ message: "userid required" });
      }
      const user = await Registeration.findOne({
        userid,
      });
      if (!user) {
        return res.status(401).json({ message: "user was not found" });
      }
      if (user && !user.verified) {
        const { hashedOTP, otp } = await genOTP();
        // send verification otp to user
        user.otp = hashedOTP;
        await user.save();
        return res.status(409).json({
          message: "user is not verified! verify the user first!",
          redirectToVerification: true,
          otp,
        });
      }
      const { hashedOTP, otp } = await genOTP();
      user.fpOTP = hashedOTP;
      await user.save();
      res.status(200).json({
        message: "We have sent you otp in your mail, verify to continue",
        otp,
      });
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  }
);

const genOTP = async () => {
  const salt = await bcryptjs.genSalt(10);
  const otp = otpGenerator.generate(6, {
    upperCase: true,
    specialChars: false,
  });
  const hashedOTP = await bcryptjs.hash(otp, salt);
  return { hashedOTP, otp };
};

module.exports = app;
