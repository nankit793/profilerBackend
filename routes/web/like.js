const express = require("express");
const BasicUserInfo = require("../../models/BasicUserInfo");
const BlogActivities = require("../../models/BlogActivities");
const BlogsData = require("../../models/BlogsData");
const LikesSchema = require("../../models/LikesSchema");
const { requestVerification } = require("../../tokens/requestVerification");
const app = express();
app.post("/", async (req, res) => {
  try {
    const { accesstoken, refreshtoken, userid } = req.headers;
    const { blogId } = req.query;
    if (!blogId) {
      return res.status(401).json({ message: "blog ID is required" });
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

    let BasicInfo = await BasicUserInfo.find({ id: user.id });
    const basicUserId = BasicInfo[0]._id;

    const blog = await BlogsData.findById(blogId);
    if (!blog) {
      return res.status(401).json({ message: "blog was not found" });
    }

    let blogLikes = await LikesSchema.findOne({ blog: blogId });
    if (!blogLikes) {
      blogLikes = await LikesSchema({ blog: blogId });
      await blogLikes.save();
    }
    if (blogLikes && blogLikes.likes && blogLikes.likes.includes(basicUserId)) {
      return res
        .status(401)
        .json({ message: "already liked", state: false, newAccessToken });
    }
    await blogLikes.updateOne({
      $push: { likes: basicUserId },
    });
    const blogAtActivity = await BlogActivities.findById(blog.activities);
    blogAtActivity.numLikes++;
    await blogAtActivity.save();
    res.status(200).json({ message: "liked", state: true, newAccessToken });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

module.exports = app;
