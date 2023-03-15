const express = require("express");
const BasicUserInfo = require("../../../models/BasicUserInfo");
const BlogsData = require("../../../models/BlogsData");
const { requestVerification } = require("../../../tokens/requestVerification");
const app = express();

app.put("/", async (req, res) => {
  try {
    const { accesstoken, refreshtoken, userid } = req.headers;
    const { blogId, cid } = req.query;
    if (!blogId || !cid) {
      return res.status(401).json({ message: "blog and comment are required" });
    }
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
    let BasicInfo = await BasicUserInfo.find({
      id: user.id,
    });
    const basicUserId = BasicInfo[0]._id;

    const updatedComment = await BlogsData.findOneAndUpdate(
      {
        _id: blogId,
        author: basicUserId,
        comments: { $elemMatch: { _id: cid } },
      },
      { $set: { "comments.$.pinned": true } },
      { new: true }
    );
    console.log(updatedComment);
    if (updatedComment !== null) {
      return res.status(200).json({ message: "pinned comment", state: true });
    }
    res.status(403).json({
      message: "not authorized to pin this comment",
      state: false,
      newAccessToken,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

module.exports = app;
