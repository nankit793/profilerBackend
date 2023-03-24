const express = require("express");
const BasicUserInfo = require("../models/BasicUserInfo");
const FollowersData = require("../models/FollowersData");
const { requestVerification } = require("../tokens/requestVerification");
const app = express();

app.get("/", async (req, res) => {
  const { accesstoken, refreshtoken, userid } = req.headers;
  const { id } = req.query;
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
  const currentUser = await BasicUserInfo.findOne({ id: user.id });
  
  const followingOfCurrentUser = await FollowersData.findOne({
    user: currentUser._id,
  }).select("following");

  res.status(200).json({
    message: "following list sent",
    followingOfCurrentUser,
    newAccessToken,
  });
});

module.exports = app;
