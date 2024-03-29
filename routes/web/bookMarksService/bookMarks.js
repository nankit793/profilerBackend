const BasicUserInfo = require("../../../models/BasicUserInfo");
const express = require("express");
const BlogsData = require("../../../models/BlogsData");
const BlogActivities = require("../../../models/BlogActivities");
const {
  requestVerification,
  userFromToken,
} = require("../../../tokens/requestVerification");
const app = express();
app.post("/", async (req, res) => {
  try {
    const { accesstoken, refreshtoken, userid } = req.headers;
    const { blogId } = req.query;
    if (!blogId) {
      return res.status(401).json({ message: "blog is required" });
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
    let blog = await BlogsData.findById(blogId);
    if (!blog) {
      return res.status(401).json({ message: "blog was not found" });
    }
    const BasicInfo = await BasicUserInfo.findOne({ id: user.id }).select(
      "portfolioBookmarks"
    );
    if (
      BasicInfo &&
      BasicInfo.bookMarks &&
      BasicInfo.bookMarks.includes(blogId)
    ) {
      return res
        .status(401)
        .json({ message: "already bookmarked", state: false, newAccessToken });
    }
    await BasicInfo.updateOne({
      $push: {
        bookMarks: blogId,
      },
    });

    res.status(200).json({
      message: "blog added in bookmarks",
      state: true,
      newAccessToken,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

app.get("/", async (req, res) => {
  try {
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

    let BasicInfo = await BasicUserInfo.findOne({ id: user.id })
      .select("+bookMarks ")
      .populate({
        path: "bookMarks",
        populate: {
          path: "author",
          model: "BasicUserInfo",
          select: ["userid", "username", "name"],
        },
        // populate: { path: "activities" },
      });
    // .populate("bookMarks.author", ["userid"]);
    res.status(200).json({
      message: "blogs fetched",
      state: true,
      bookmarks: BasicInfo.bookMarks,
      newAccessToken,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

module.exports = app;
