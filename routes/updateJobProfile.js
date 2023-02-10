const express = require("express");
const app = express();

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const userBasicInfo = require("../models/BasicUserInfo");
const MediaData = require("../models/MediaData");
const { requestVerification } = require("../tokens/requestVerification");

app.patch("/", async (req, res) => {
  try {
    const { accesstoken, refreshtoken, userid } = req.body.headers;
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
    const jobProfile = req.body.jobProfile;
    const saveUser = await userBasicInfo.findOne({ id: user.id });
    if (saveUser.jobProfile.generated) {
      jobProfile.generated = true;
      saveUser.jobProfile = jobProfile;
      saveUser.save();
      return res.status(200).json({
        newAccessToken,
        message: "user has been updated",
      });
    }
    return res
      .status(200)
      .json({ message: "user has not created job profile", newAccessToken });
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: error.message });
  }
});

app.patch("/resume", upload.single("resume"), async (req, res) => {
  try {
    const {
      accesstoken,
      refreshtoken,
      userid,
      change,
      removeresume,
      autoResume,
    } = req.headers;
    console.log(req.headers);
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
    let saveUser = await MediaData.findOne({ id: user.id });
    if (!saveUser) {
      saveUser = MediaData({ id: user.id });
    }
    if (removeresume && removeresume === "true") {
      saveUser.autoResume = false;
      saveUser.resume = null;
    } else {
      // console.log(req.file, req.file.buffer);
      if (autoResume && autoResume === "true") {
        saveUser.autoResume = true;
        saveUser.resume = null;
      } else if (change === "resume" && req.file.buffer) {
        saveUser.resume = req.file.buffer;
        saveUser.autoResume = false;
      }
    }
    saveUser.save();
    res.status(200).json({ message: "resume updated", newAccessToken });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

module.exports = app;
