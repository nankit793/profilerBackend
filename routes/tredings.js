const express = require("express");
const app = express();
const userData = require("../models/BasicUserInfo");
const BlogActivities = require("../models/BlogActivities");
const Registration = require("../models/Registration");
const TrendingBlogs = require("../models/TrendingBlogs");
app.get("/", async (req, res) => {
  try {
    let trendings = await TrendingBlogs.find().populate({
      path: "blog",
      select: ["-paragraphs", "-comments"],
      populate: { path: "author", select: ["username", "name", "userid"] },
      populate: { path: "author", select: ["username", "name", "userid"] },
      //   populate: { path: "activities", select: ["-blog"] },
    });
    //   .populate("blog.author");
    res
      .status(200)
      .json({ message: "trending blogs fetched", state: true, trendings });
  } catch (error) {
    res.status(401).json({ message: error.message, state: false });
  }
});
module.exports = app;
