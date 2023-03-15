const express = require("express");
const BasicUserInfo = require("../../models/BasicUserInfo");
const BlogActivities = require("../../models/BlogActivities");
const BlogsData = require("../../models/BlogsData");
const { requestVerification } = require("../../tokens/requestVerification");
const app = express();

app.put("/", async (req, res) => {
  try {
    const { accesstoken, refreshtoken, userid } = req.headers;
    const { blogId, cid } = req.query;
    const { comment } = req.body;

    if (!blogId || !cid) {
      return res
        .status(401)
        .json({ message: "blog  and comment are required" });
    }

    if (!comment || comment.length < 5) {
      return res
        .status(401)
        .json({ message: "at least 5 characters are required for comment" });
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

    // const filter = {
    //   _id: blogId,
    //   "comments._id": cid,
    //   "comments.user": basicUserId,
    // };
    // const update = {};
    // const options = { new: true };

    const updatedComment = await BlogsData.findOneAndUpdate(
      {
        _id: blogId,
        comments: { $elemMatch: { _id: cid, user: basicUserId } },
      },
      { $set: { "comments.$.text": comment, "comments.$.edited": true } },
      { new: true }
    );
    console.log(updatedComment);
    if (updatedComment !== null) {
      return res.status(200).json({ message: "updated comment", state: true });
    }
    res.status(403).json({
      message: "not authorized to update this comment",
      state: false,
      newAccessToken,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

app.delete("/", async (req, res) => {
  try {
    const { accesstoken, refreshtoken, userid } = req.headers;
    const { blogId, cid } = req.query;

    if (!blogId || !cid) {
      return res
        .status(401)
        .json({ message: "blog  and comment are required" });
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
    const blogAuthor = await BlogsData.findById(blogId).select("author");

    let updatedComment;
    console.log(
      blogAuthor.author.toString() === basicUserId.toString(),
      blogAuthor,
      basicUserId
    );
    if (blogAuthor.author.toString() === basicUserId.toString()) {
      updatedComment = await BlogsData.findOneAndUpdate(
        {
          _id: blogId,
          comments: { $elemMatch: { _id: cid } },
        },
        { $pull: { comments: { _id: cid } } },
        { new: true }
      );
    } else {
      updatedComment = await BlogsData.findOneAndUpdate(
        {
          _id: blogId,
          comments: { $elemMatch: { _id: cid, user: basicUserId } },
        },
        { $pull: { comments: { _id: cid } } },
        { new: true }
      );
    }
    if (updatedComment !== null) {
      const blogAtActivity = await BlogActivities.findOne({ blog: blogId });
      blogAtActivity.numComments--;
      await blogAtActivity.save();
      return res.status(200).json({ message: "deleted comment", state: true });
    }
    res.status(403).json({
      message:
        "comment does not exist or not authorized to delete this comment",
      state: false,
    });
  } catch (error) {
    res.status(401).json({ message: error.message, state: false });
  }
});

module.exports = app;
