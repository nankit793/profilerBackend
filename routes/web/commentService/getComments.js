const BlogsData = require("../../../models/BlogsData");
const express = require("express");
const app = express();

app.get("/", async (req, res) => {
  try {
    const { blogId } = req.query;
    if (!blogId) {
      return res.status(401).json({ message: "Blog is required" });
    }
    const blog = await BlogsData.findById(blogId)
      .select("comments")
      .populate("comments.user", ["userid", "name"]);
    if (!blog) {
      return res.status(401).json({ message: "no blog was found" });
    }
    res
      .status(200)
      .json({ message: "comments retrieved", comments: blog.comments });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

module.exports = app;
