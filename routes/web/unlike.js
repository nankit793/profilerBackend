const express = require("express");
const BlogsData = require("../../models/BlogsData");
const LikesSchema = require("../../models/LikesSchema");
const app = express();
const { requestVerification } = require("../../tokens/requestVerification");
const BasicUserInfo = require("../../models/BasicUserInfo");
const BlogActivities = require("../../models/BlogActivities");

app.post("/", async (req, res) => {
  try {
    const { accesstoken, refreshtoken, userid } = req.headers;
    const { blogId } = req.query;
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

    let BasicInfo = await BasicUserInfo.find({ id: user.id });
    const basicUserId = BasicInfo[0]._id;

    const blog = await BlogsData.findById(blogId);
    if (!blog) {
      return res.status(401).json({ message: "blog was not found" });
    }

    let blogLikes = await LikesSchema.findOne({ blog: blogId });
    if (!blogLikes) {
      blogLikes = await LikesSchema({ blog: blog._id });
      await blogLikes.save();
    }
    console.log(
      !(blogLikes.likes && blogLikes.likes.includes(basicUserId)),
      blogLikes
    );
    if (!(blogLikes.likes && blogLikes.likes.includes(basicUserId))) {
      return res
        .status(401)
        .json({ message: "already not liked", state: false, newAccessToken });
    }

    await blogLikes.updateOne({
      $pull: { likes: basicUserId },
    });
    const blogAtActivity = await BlogActivities.findById(blog.activities);
    blogAtActivity.numLikes--;
    await blogAtActivity.save();
    res.status(200).json({ message: "unliked", state: true });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

module.exports = app;
