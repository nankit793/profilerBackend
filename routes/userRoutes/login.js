const express = require("express");
const app = express();
const { body, validationResult } = require("express-validator");
const Registeration = require("../../models/Registration");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateToken, generateRefreshToken } = require("../../tokens/idToken");
const UserRefToken = require("../../models/UserRefToken");
const otpGenerator = require("otp-generator");
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
        return res.status(400).json({ error: errors });
      }
      let user = await Registeration.findOne({
        userid: req.body.userid,
      }).select("+password verified");
      if (!user) {
        return res.status(400).json({ message: "Invalid username/password" });
      }
      if (!user.verified) {
        let otp = genOTP();
        user.otp = otp;
        await user.save();
        return res
          .status(401)
          .json({ message: "user is not verified", verification: false, otp });
      }
      const passwordCompare = await bcryptjs.compare(
        req.body.password,
        user.password
      );
      if (!passwordCompare) {
        return res.status(400).json({ message: "Invalid username/password" });
      }

      const payload = {
        id: user.id,
      };

      const authToken = await generateToken(payload);
      const refreshToken = await generateRefreshToken(payload);
      saveOnDB(req, payload);
      res
        .status(200)
        .json({ accessToken: authToken, refreshToken: refreshToken });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

const genOTP = () => {
  const otp = otpGenerator.generate(6, {
    upperCase: true,
    specialChars: false,
  });
  return otp;
};

module.exports = app;
