const express = require("express");
const BasicUserInfo = require("../../models/BasicUserInfo");
const BlogsData = require("../../models/BlogsData");
const app = express();

// const Registration = require("../../models/Registration");
const { requestVerification } = require("../../tokens/requestVerification");
app.post("/", async (req, res) => {
  try {
    //  id is basicUserInfo's id of that user
    const { accesstoken, refreshtoken, userid, id } = req.headers;
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
    // for (let index = 0; index < 100; index++) {
      console.log("first");
      const blogUpload = await BlogsData({ author: basicUserId });
      blogUpload.heading = req.body.heading;
      await blogUpload.save();
    // }
    res.status(200).json({ message: "blog has been uploaded", newAccessToken });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

app.get("/author/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const blogUpload = await BlogsData.find({ author: id })
      .populate("author")
      .select("userid");
    // console.log(blogUpload[(0, 10)]);
    const length = blogUpload.length;
    res.status(200).json({ message: "blog has been uploaded", length });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

app.get("/get/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await BlogsData.findById(id);
    if (blog) {
      blog.views++;
      blog.save();
      res.status(200).json({ message: "success", blog });
      return;
    }
    return res.status(401).json({ message: "blog was not found" });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

module.exports = app;
