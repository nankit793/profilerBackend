const express = require("express");
const app = express();
const userBasicInfo = require("../models/BasicUserInfo");
const { requestVerification } = require("../tokens/requestVerification");
app.get("/", async (req, res) => {
  const { userid } = req.headers;
  if (!userid) {
    return res.status(401).json({ message: "need userid or username" });
  }
  try {
    const user = await userBasicInfo.findOne({ userid: userid });
    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }
    // delete id, _id from user and return
    return res.status(200).json({ message: "user has been found", user });
  } catch (error) {
    return res.status(401).json({ message: error });
  }
});

//on req.body userid, refreToken, accessToken
app.patch("/", async (req, res) => {
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
  // const { _id, id, username } = req.body.headers.data;
  // if (_id || id || req.body.headers.data.userid || username) {
  //   return res.status(401).json({ message: "You cannot update this" });
  // }
  try {
    const { newAccessToken } = verifiedRequest || "";
    const { user } = verifiedRequest;
    const data = req.body.headers.data;
    delete data["_id"];
    delete data["userid"];
    delete data["id"];
    delete data["username"];
    const saveUser = await userBasicInfo.findOneAndUpdate(
      { id: user.id },
      data
    );
    saveUser.save();
    res.json({
      newAccessToken,
      message: "Updated user",
    });
  } catch (error) {
    res.status(401).json({ message: error });
  }
});

module.exports = app;
