const BasicUserInfo = require("../../../models/BasicUserInfo");
const express = require("express");

const BlogsData = require("../../../models/BlogsData");
const BlogActivities = require("../../../models/BlogActivities");
const {
  requestVerification,
  userFromToken,
} = require("../../../tokens/requestVerification");
const PortFolios = require("../../../models/PortFolios");
const app = express();
app.post("/", async (req, res) => {
  try {
    const { accesstoken, refreshtoken, userid } = req.headers;
    const { pid } = req.query;
    if (!pid) {
      return res.status(401).json({ message: "portfolio is required" });
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
    let portfolio = await PortFolios.findById(pid);
    if (!portfolio) {
      return res.status(401).json({ message: "portfolio was not found" });
    }
    const BasicInfo = await BasicUserInfo.findOne({ id: user.id }).select(
      "portfolioBookmarks"
    );
    if (
      BasicInfo &&
      BasicInfo.portfolioBookmarks &&
      BasicInfo.portfolioBookmarks.includes(pid)
    ) {
      return res
        .status(401)
        .json({ message: "already bookmarked", state: false, newAccessToken });
    }
    await BasicInfo.updateOne({
      $push: {
        portfolioBookmarks: pid,
      },
    });

    res.status(200).json({
      message: "portfolio added in bookmarks",
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
      .select("+portfolioBookmarks")
      .populate({
        path: "portfolioBookmarks",
        populate: {
          path: "user",
          model: "BasicUserInfo",
          select: ["userid", "username", "name"],
        },
        select: ["title", "skills", "about"],
        // populate: { path: "activities" },
      });
    // .populate("bookMarks.author", ["userid"]);
    res.status(200).json({
      message: "blogs fetched",
      state: true,
      bookmarks: BasicInfo.portfolioBookmarks,
      newAccessToken,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

app.delete("/", async (req, res) => {
  try {
    const { accesstoken, refreshtoken, userid } = req.headers;
    const { pid } = req.query;
    if (!pid) {
      return res.status(401).json({ message: "portfolio is required" });
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
    let portfolio = await PortFolios.findById(pid);
    if (!portfolio) {
      return res.status(401).json({ message: "portfolio was not found" });
    }
    const BasicInfo = await BasicUserInfo.findOne({ id: user.id });

    await BasicInfo.updateOne({
      $pull: {
        portfolioBookmarks: pid,
      },
    });

    res.status(200).json({
      message: "portfolio removed from bookmarks",
      state: true,
      newAccessToken,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

module.exports = app;
