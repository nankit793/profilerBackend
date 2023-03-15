const BasicUserInfo = require("../../models/BasicUserInfo");
const BlogsData = require("../../models/BlogsData");
const BlogsImages = require("../../models/BlogsImages");
const LikesSchema = require("../../models/LikesSchema");
const BlogActivities = require("../../models/BlogActivities");
const express = require("express");
const app = express();
const { requestVerification } = require("../../tokens/requestVerification");

app.delete("/", async (req, res) => {
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

    const blogUpload = await BlogsData.findOneAndDelete({
      _id: blogId,
      author: basicUserId,
    });
    if (blogUpload) {
      await LikesSchema.findOneAndDelete({
        blog: blogId,
      });

      await BlogActivities.findOneAndDelete({
        blog: blogId,
      });

      await BlogsImages.findByIdAndDelete(blogUpload.imageURL);

      return res.status(200).json({
        message: "blog has been deleted",
        newAccessToken,
        state: true,
      });
    }
    res.status(401).json({
      message: "blog does not exist or not authorized to delete blog",
      newAccessToken,
      state: false,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

module.exports = app;
