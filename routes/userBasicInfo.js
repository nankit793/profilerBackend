const express = require("express");
const app = express();
const userBasicInfo = require("../models/BasicUserInfo");
const BlogsData = require("../models/BlogsData");
const FollowersData = require("../models/FollowersData");
const { requestVerification } = require("../tokens/requestVerification");

app.get("/", async (req, res) => {
  const { userid, requirement } = req.headers;
  if (!userid) {
    return res
      .status(401)
      .json({ message: "need userid or username", registered: false });
  }
  try {
    const user = await userBasicInfo
      .findOne({ userid: userid })
      .populate("portfolios", ["skills", "about"]);
    if (!user) {
      return res
        .status(401)
        .json({ message: "user not found", registered: false });
    }
    if (requirement) {
      return res.status(200).json({
        newData: {
          userid: user["userid"],
          name: user["name"],
          newData: user[requirement],
        },
      });
    }

    const followData = await FollowersData.findOne({ user: user._id });
    const blogUpload = await BlogsData.find({ author: user._id });
    return res.status(200).json({
      message: "user has been found",
      registered: true,
      newData: user,
      followingCount: (followData && followData.followingCount) || 0,
      followersCount: (followData && followData.followersCount) || 0,
      blogsCount: (blogUpload && blogUpload.length) || 0,
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: error.message });
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
    delete data["portfolioGenerated"];
    delete data["portfolios"];
    const saveUser = await userBasicInfo.findOneAndUpdate(
      { id: user.id },
      data
    );
    saveUser.save();
    res.json({
      newAccessToken,
      state: true,
      message: "Updated has been user",
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

module.exports = app;
