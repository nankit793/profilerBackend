const BasicUserInfo = require("../../models/BasicUserInfo");
const BlogsData = require("../../models/BlogsData");
const BlogsImages = require("../../models/BlogsImages");
const LikesSchema = require("../../models/LikesSchema");
const BlogActivities = require("../../models/BlogActivities");
const express = require("express");
const app = express();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const {
  requestVerification,
  userFromToken,
} = require("../../tokens/requestVerification");

app.patch(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "p1", maxCount: 1 },
    { name: "p2", maxCount: 1 },
    { name: "p3", maxCount: 1 },
    { name: "p4", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      //  id is basicUserInfo's id of that user
      const { accesstoken, refreshtoken, userid, bid, change } = req.headers;
      if (!bid) {
        return res.status(401).json({ message: "blog is required" });
      }
      const verifiedRequest = await requestVerification(
        accesstoken,
        refreshtoken,
        userid,
        bid
      );
      const blog = req.body;
      if (!verifiedRequest.giveAccess) {
        return res.status(401).json({
          giveAccess: verifiedRequest.giveAccess,
          message: verifiedRequest.message,
        });
      }
      const { newAccessToken } = verifiedRequest || "";
      const { user } = verifiedRequest;

      let BasicInfo = await BasicUserInfo.findOne({ id: user.id });
      const basicUserId = BasicInfo._id;
      const blogStructure = JSON.parse(req.body.data);
      const updatedBlog = await BlogsData.findOneAndUpdate(
        {
          _id: bid,
          author: basicUserId,
        },
        blogStructure
      );
      if (updatedBlog !== null) {
        const blogAtActivity = await BlogActivities.findOne({ blog: bid });
        blogAtActivity.blogUpdated = Date.now();
        if (
          req.files["image"] &&
          req.files["image"][0] &&
          req.files["image"][0].buffer &&
          change === "true"
        ) {
          await BlogsImages.findOneAndUpdate(
            {
              _id: updatedBlog && updatedBlog.imageURL,
              blog: bid,
            },
            { image: req.files["image"][0].buffer }
          );
        }

        await blogAtActivity.save();
        return res
          .status(200)
          .json({ message: "updated the blog", state: true });
      }
      res.status(401).json({
        message: "you are not authorized to edit this blog",
        state: false,
      });
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  }
);

module.exports = app;
