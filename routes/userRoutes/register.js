const express = require("express");
const app = express();
const { body, validationResult } = require("express-validator");
const Registeration = require("../../models/Registration");
const bcryptjs = require("bcryptjs");
const UserRefToken = require("../../models/UserRefToken");
const { generateToken, generateRefreshToken } = require("../../tokens/idToken");

app.post(
  "/",
  [
    body("userid", "Enter valied email").isEmail(),
    body("password", "Enter Valid Password").isLength({ min: 5 }),
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const user = await Registeration.findOne({ userid: req.body.userid });
    if (user) {
      return res.status(409).json({ message: "Useralready exists" });
    }
    try {
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(req.body.password, salt);
      req.body.password = hashedPassword;

      const saveUser = await Registeration(req.body);

      const payload = {
        id: saveUser.id,
      };
      const authToken = await generateToken(payload);
      const refreshToken = await generateRefreshToken(payload);

      saveUser.save();

      res.json({
        message: "User has been created",
        accessToken: authToken,
        refreshToken,
      });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
);

module.exports = app;
