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
        message: "self unfollow is not allowed",
        state: false,
        newAccessToken,
      });
    }

    let userWhoIsUnFollowing = await FollowersData.findOne({
      user: currentUser._id,
    });
    let userWhoIsUnFollowed = await FollowersData.findOne({
      user: ObjectId(id),
    });
    // if user do not exist in collectoion then add
    if (!userWhoIsUnFollowing) {
      userWhoIsUnFollowing = await FollowersData({ user: currentUser._id });
      await userWhoIsUnFollowing.save();
    }
    if (!userWhoIsUnFollowed) {
      userWhoIsUnFollowed = await FollowersData({ user: ObjectId(id) });
      await userWhoIsUnFollowed.save();
    }
    if (
      !(
        userWhoIsUnFollowing.following &&
        userWhoIsUnFollowing.following.includes(id)
      )
    ) {
      return res.status(401).json({
        message: "You are not following user",
        state: false,
        newAccessToken,
      });
    }

    await userWhoIsUnFollowing.updateOne({
      $pull: { following: id },
      $inc: { followingCount: -1 },
    });
    await userWhoIsUnFollowed.updateOne({
      $pull: { followers: currentUser._id },
      $inc: { followersCount: -1 },
    });
    res
      .status(200)
      .json({ message: "unfollowed", state: true, newAccessToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = app;
