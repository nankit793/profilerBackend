const express = require("express");
const app = express();

const multer = require("multer");
const BasicUserInfo = require("../../models/BasicUserInfo");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const MediaData = require("../../models/MediaData");
const PortfolioActivities = require("../../models/PortfolioActivities");
const PortFolios = require("../../models/PortFolios");
const { requestVerification } = require("../../tokens/requestVerification");

app.patch("/", async (req, res) => {
  try {
    const { accesstoken, refreshtoken, userid, pid } = req.headers;
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
    let BasicInfo = await BasicUserInfo.findOne({ id: user.id });
    const basicUserId = BasicInfo._id;
    const jobProfile = req.body;
    console.log(jobProfile);
    await PortFolios.findOneAndUpdate(
      { _id: pid, user: basicUserId },
      jobProfile,
      { $set: { lastEdited: Date.now() } }
      // { multi: true }
    );
    return res
      .status(200)
      .json({ message: "portfolio has been updated", newAccessToken });
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
      pid,
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
    let BasicInfo = await BasicUserInfo.findOne({
      id: user.id,
    });
    if (
      BasicInfo &&
      BasicInfo.portfolios &&
      BasicInfo.portfolios.includes(pid)
    ) {
      let saveUser = await MediaData.findOne({ pid: pid });
      if (!saveUser) {
        saveUser = MediaData({ pid: pid });
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
          console.log("first to reach here");
          saveUser.resume = req.file.buffer;
          saveUser.autoResume = false;
        }
      }
      saveUser.save();
      return res
        .status(200)
        .json({ message: "resume updated", newAccessToken, state: true });
    }
    res.status(401).json({
      message:
        "either portfolio does not exist or you are authorized to change it",
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

module.exports = app;
