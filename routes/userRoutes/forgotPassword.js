const express = require("express");
const app = express();
const { body, validationResult } = require("express-validator");
const Registeration = require("../../models/Registration");
const bcryptjs = require("bcryptjs");
app.post(
  "/",
  [
    body("userid", "Enter valied email").isEmail(),
    body("newPassword", "Enter Valid Password").isLength({ min: 5 }),
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    let user = await Registeration.findOne({ userid: req.body.userid });
    if (!user) {
      return res.status(400).json({ message: "Invalid username" });
    }
    try {
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(req.body.newPassword, salt);
      user.password = hashedPassword;
      user.save();
      res.status(200).json({ message: "Your new password has been set" });
    } catch (error) {
      res.status(401).json({ message: error });
    }
  }
);

module.exports = app;
