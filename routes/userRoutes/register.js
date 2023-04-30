const express = require("express");
const app = express();
const { body, validationResult } = require("express-validator");
const Registeration = require("../../models/Registration");
const bcryptjs = require("bcryptjs");

const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");

const UserRefToken = require("../../models/UserRefToken");
const { generateToken, generateRefreshToken } = require("../../tokens/idToken");
const { saveOnDB } = require("./saveOnDB");
app.post(
  "/",
  [
    body("userid", "Enter valied email").isEmail(),
    body("password", "Enter Valid Password").isLength({ min: 5 }),
  ],

  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ message: errors.array() });
      }
      const user = await Registeration.findOne({ userid: req.body.userid });
      if (user && user.verified) {
        return res.status(409).json({ message: "user already exists" });
      }
      let { hashedOTP, otp } = await genOTP();
      if (user && !user.verified) {
        // mail user their otp
        user.otp = hashedOTP;
        await user.save();
        return res.status(200).json({
          message: "user exists but not verified",
          redirectToVerify: true,
          otp,
        });
      }
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(req.body.password, salt);
      req.body.password = hashedPassword;

      const saveUser = await Registeration(req.body);
      const payload = {
        id: saveUser.id,
      };

      // const authToken = await generateToken(payload);
      // const refreshToken = await generateRefreshToken(payload);
      saveOnDB(req, payload);
      //mail user
      saveUser.otp = hashedOTP;
      await saveUser.save();
      res.json({
        message: "We have sent you otp in your mail, verify to continue",
        redirectToVerify: true,
        // accessToken: authToken,
        // refreshToken,
        otp,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
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
        return res.status(401).json({ message: "user not found" });
      }
      if (user && user.verified) {
        return res.status(409).json({ message: "user already verfied" });
      }
      const { hashedOTP, otp } = await genOTP();
      console.log(hashedOTP, otp);
      user.otp = hashedOTP;
      user.verified = false;
      // mail user
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

app.post(
  "/verifyUser",
  [body("userid", "Enter valied email").isEmail()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ message: errors.array() });
      }
      const { otp, userid } = req.body;
      if (!otp || !userid) {
        return res.status(401).json({ message: "params required" });
      }
      const user = await Registeration.findOne({
        userid,
      }).select("+password  verified otp");
      if (!user) {
        return res.status(401).json({ message: "user not found" });
      }
      if (user && user.verified) {
        return res.status(200).json({ message: "user already verfied" });
      }
      const otpCompare = await bcryptjs.compare(otp, user.otp);
      if (user.otp && otpCompare) {
        user.verified = true;
        user.otp = null;
        await user.save();
        return res
          .status(200)
          .json({ message: "user verified", verfied: true });
      } else if (user.otp && !otpCompare) {
        user.verified = false;
        user.save();
        return res.status(401).json({ message: "wrong otp! try again" });
      }
      res.status(401).json({
        message: "server error try agin later or contact our support team",
      });
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  }
);

const genOTP = async () => {
  const otp = otpGenerator.generate(6, {
    upperCase: true,
    specialChars: false,
  });
  const salt = await bcryptjs.genSalt(10);
  const hashedOTP = await bcryptjs.hash(otp, salt);
  return { hashedOTP, otp };
};

module.exports = app;
