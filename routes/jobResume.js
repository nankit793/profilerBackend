const express = require("express");
const MediaData = require("../models/MediaData");
const Registration = require("../models/Registration");
const app = express();

app.get("/", async (req, res) => {
  try {
    const { userid } = req.headers;
    if (!userid) {
      res.status(401).json({ message: "user id not provided" });
      return;
    }
    const user = await Registration.findOne({ userid: userid });
    if (!user) {
      res.status(401).json({ message: "user do not exist" });
      return;
    }
    const media = await MediaData.findOne({ id: user._id });
    if (!media) {
      res.status(401).json({ message: "media not available" });
      return;
    }
    res.status(200).json({ media });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

module.exports = app;
