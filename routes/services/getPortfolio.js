const express = require("express");
const BasicUserInfo = require("../../models/BasicUserInfo");
const PortfolioActivities = require("../../models/PortfolioActivities");
const PortFolios = require("../../models/PortFolios");
const app = express();
app.get("/", async (req, res) => {
  try {
    const { pid } = req.query;
    const { userid } = req.headers;
    const user = await BasicUserInfo.findOne({ userid });
    const portfolio = await PortFolios.findById(pid).populate("user");
    if (!portfolio) {
      return res.status(401).json({ message: "portfolio was not found" });
    }
    let portfolioAtActivities = await PortfolioActivities.findOne({
      portfolio: pid,
    });
    if (!portfolioAtActivities) {
      portfolioAtActivities = await PortfolioActivities({ portfolio: pid });
    }
    let isLiked = false;
    if (
      user &&
      portfolioAtActivities &&
      portfolioAtActivities.likes &&
      portfolioAtActivities.likes.includes(user._id)
    ) {
      isLiked = true;
    }
    portfolioAtActivities.views++;

    await portfolioAtActivities.save();
    res.status(200).json({
      message: "portfolio fecthed",
      portfolio,
      portfolioAtActivities,
      isLiked,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});
module.exports = app;
