const express = require("express");
const BasicUserInfo = require("../../models/BasicUserInfo");
const BlogActivities = require("../../models/BlogActivities");
const BlogsData = require("../../models/BlogsData");
// CommentSchema;
const { requestVerification } = require("../../tokens/requestVerification");
const app = express();
app.post("/", async (req, res) => {
  try {
    const { accesstoken, refreshtoken, userid } = req.headers;
    const { blogId } = req.query;
    const { comment } = req.body;
    if (!blogId) {
      return res.status(401).json({ message: "blog ID is required" });
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

    let BasicInfo = await BasicUserInfo.find({ id: user.id });
    const basicUserId = BasicInfo[0]._id;
    const blog = await BlogsData.findById(blogId);
    if (!blog) {
      return res.status(401).json({ message: "blog was not found" });
    }

    await blog.updateOne({
      $push: {
        comments: {
          user: basicUserId,
          text: comment,
        },
      },
    });

    const blogAtActivity = await BlogActivities.findById(blog.activities);
    blogAtActivity.numComments++;
    await blogAtActivity.save();
    res
      .status(200)
      .json({ message: "comment added", state: true, newAccessToken });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

module.exports = app;
