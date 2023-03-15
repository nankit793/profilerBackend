const express = require("express");
const app = express();
const multer = require("multer");
const MediaData = require("../models/MediaData");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
// const upload = multer({ dest: "uploads/" });
const fs = require("fs");
const { requestVerification } = require("../tokens/requestVerification");
const Registration = require("../models/Registration");
app.get("/", async (req, res) => {
  try {
    if (req.query.userid) {
      const user = await Registration.findOne({ userid: req.query.userid });
      if (!user) {
        res.status(401).json({ message: "user was not found" });
        return;
      }
      if (!user.verified) {
        return res.status(401).json({ message: "user not verified" });
      }
      const media = await MediaData.findOne({ id: user.id });
      // const base64 = Buffer.from(media.image).toString("base64");
      res.contentType("jpeg");
      res.status(200).send(media.image);
      return;
    }
    res.status(401).json({ message: "userid not defined" });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

app.post("/uploads", upload.single("image"), async (req, res) => {
  try {
    const { accesstoken, refreshtoken, userid } = req.headers;
    const verifiedRequest = await requestVerification(
      accesstoken,
      refreshtoken,
      userid
    );
    if (!verifiedRequest.giveAccess) {
      return res.status(401).json({
        giveAccess: verifiedRequest.giveAccess,
        message: verifiedRequest.message,
      });
    }
    const { newAccessToken } = verifiedRequest || "";
    const { user } = verifiedRequest;
    const buffer = req.file.buffer;
    let saveUser = await MediaData.findOne({ id: user.id });
    if (!saveUser) {
      saveUser = MediaData({ id: user.id });
    }
    // saveUser.image = null;
    saveUser.image = buffer;
    saveUser.contentType = req.file.mimetype;
    saveUser.imageName = req.file.originalname;
    await saveUser.save();
    res.status(200).json({ message: "image uploaded", newAccessToken });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});
module.exports = app;
