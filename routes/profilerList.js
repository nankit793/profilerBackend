const express = require("express");
const app = express();
const userData = require("../models/BasicUserInfo");
const Registration = require("../models/Registration");

app.get("/", async (req, res) => {
  const { userid } = req.headers;
  if (!userid) {
    return res.status(401).json({ message: "need userid or username" });
  }

  res.status(200).json({ message: "success", jobProfile: false });
});
module.exports = app;
