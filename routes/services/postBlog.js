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

app.post("/", upload.single("image"), async (req, res) => {
  try {
    //  id is basicUserInfo's id of that user
    const { accesstoken, refreshtoken, userid } = req.headers;
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

    const blogStructure = JSON.parse(req.body.data);
    const blogUpload = await BlogsData({
      author: basicUserId,
      ...blogStructure,
    });

    // function randomDate(start, end) {
    //   return new Date(
    //     start.getTime() + Math.random() * (end.getTime() - start.getTime())
    //   );
    // }
    const blogAtActivity = await BlogActivities({
      blog: blogUpload._id,
      // views: Math.random() * 100000,
      // blogUpload: randomDate(new Date(2012, 0, 1), new Date()),
    });
    if (req.file && req.file.buffer) {
      const imageUpload = await BlogsImages({
        blog: blogUpload._id,
        image: req.file.buffer,
        tag: blogStructure.tag,
      });
      blogUpload.imageURL = imageUpload._id;
      await imageUpload.save();
    }
    blogUpload.activities = blogAtActivity._id;
    await blogAtActivity.save();
    await blogUpload.save();
    res.status(200).json({ message: "blog has been uploaded", newAccessToken });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

app.get("/author/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const blogUpload = await BlogsData.find({ author: id })
      .select("heading paragraphs imageURL tag _id  ")
      .populate("activities", [
        "numLikes",
        "numComments",
        "views",
        "blogUpload",
      ]);
    res
      .status(200)
      .json({ message: "Author related blogs have been fetched", blogUpload });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

app.get("/get/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { userid } = req.headers;
    const user = await BasicUserInfo.findOne({ userid });
    if (!id) {
      return res.status(401).json({ message: "id is required" });
    }
    let blog = await BlogsData.findById(id)
      .select("-comments")
      .populate("activities", [
        "numLikes",
        "numComments",
        "views",
        "blogUpload",
        "blogUpdated",
      ])
      .populate("author", [
        "name",
        "userid",
        "username",
        "facebook",
        "instagram",
        "linkdn",
        "github",
        "youtube",
      ]);

    let liked = false;
    let LikingOfBlog;
    LikingOfBlog = await LikesSchema.findOne({ blog: blog._id });
    if (userid && user) {
      if (
        LikingOfBlog &&
        LikingOfBlog.likes &&
        LikingOfBlog.likes.includes(user._id)
      ) {
        liked = true;
      }
    }
    if (blog) {
      const blogAtActivity = await BlogActivities.findById(blog.activities);
      blogAtActivity.views++;
      await blogAtActivity.save();
      res.status(200).json({ message: "success", blog, liked });
      return;
    }
    return res.status(401).json({ message: "blog was not found" });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

app.get("/image/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(401).json({ message: "id is required" });
    }
    const blogImage = await BlogsImages.findById(id);
    // const base64 = Buffer.from(blogImage.image).toString("base64");
    // res.contentType("jpeg");
    res.status(200).send(blogImage.image);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

module.exports = app;
