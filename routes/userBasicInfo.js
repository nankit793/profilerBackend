const express = require("express");
const app = express();
const userBasicInfo = require("../models/BasicUserInfo");
const { requestVerification } = require("../tokens/requestVerification");
app.get("/", async (req, res) => {
  const { userid } = req.headers;
  console.log(userid)
  if (!userid) {
    return res.status(401).json({ message: "need userid or username" });
  }
  const user = await userBasicInfo.findOne({ userid: userid });
  if (!user) {
    return res.status(401).json({ message: "user not found" });
  }
  try {
    // delete id, _id from user and return
    return res.status(200).json({ message: "user has been found", user });
  } catch (error) {
    return res.status(401).json({ message: error });
  }
});

//on req.body userid, refreToken, accessToken
app.patch("/", async (req, res) => {
  const verifiedRequest = await requestVerification(req);
  if (!verifiedRequest.giveAccess) {
    return res.status(401).json({
      giveAccess: verifiedRequest.giveAccess,
      message: verifiedRequest.message,
    });
  }
  try {
    const { newAccessToken } = verifiedRequest || "";
    const { user } = verifiedRequest;
    const saveUser = await userBasicInfo.findOneAndUpdate(
      { _d: user.id },
      req.body.data
    );
    saveUser.save();
    res.json({
      newAccessToken,
      message: "Updated user",
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: error });
  }
});

module.exports = app;
