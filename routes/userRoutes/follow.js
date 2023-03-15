const BasicUserInfo = require("../../models/BasicUserInfo");
const express = require("express");
const FollowersData = require("../../models/FollowersData");
const { requestVerification } = require("../../tokens/requestVerification");
const app = express();
const Registration = require("../../models/Registration");
ObjectId = require("mongodb").ObjectID;

app.post("/", async (req, res) => {
  try {
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
    const followedUser = await BasicUserInfo.findById(ObjectId(id));

    if (!currentUser || !followedUser) {
      return res
        .status(401)
        .json({ message: "cound not find user", state: false, newAccessToken });
    }
    if (currentUser._id.toString() === id) {
      return res.status(401).json({
        message: "self follow is not allowed",
        state: false,
        newAccessToken,
      });
    }

    let userWhoIsFollowing = await FollowersData.findOne({
      user: currentUser._id,
    });
    let userWhoIsFollowed = await FollowersData.findOne({ user: ObjectId(id) });
    // if user do not exist in collectoion then add
    if (!userWhoIsFollowing) {
      userWhoIsFollowing = await FollowersData({ user: currentUser._id });
      await userWhoIsFollowing.save();
    }
    if (!userWhoIsFollowed) {
      userWhoIsFollowed = await FollowersData({ user: ObjectId(id) });
      await userWhoIsFollowed.save();
    }
    // console.log(userWhoIsFollowing);
    if (userWhoIsFollowing.following.includes(id)) {
      return res
        .status(401)
        .json({ message: "already following", state: false, newAccessToken });
    }

    await userWhoIsFollowing.updateOne({
      $push: { following: id },
      $inc: { followingCount: 1 },
    });
    await userWhoIsFollowed.updateOne({
      $push: { followers: currentUser._id },
      $inc: { followersCount: 1 },
    });
    res.status(200).json({ message: "followed", state: true, newAccessToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = app;
