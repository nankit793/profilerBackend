const express = require("express");
const MediaData = require("../models/MediaData");
const Registration = require("../models/Registration");
const app = express();

app.get("/", async (req, res) => {
  try {
    const { pid } = req.query;
    if (!pid) {
      res.status(401).json({ message: "portfolio not provided" });
      return;
    }

    const media = await MediaData.findOne({ pid: pid });
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
