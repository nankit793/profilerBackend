const PortfolioActivities = require("../../../models/PortfolioActivities");
const express = require("express");
const app = express();

app.get("/", async (req, res) => {
  try {
    const { pid } = req.query;
    if (!pid) {
      return res.status(401).json({ message: "portfolio is required" });
    }
    const portfolio = await PortfolioActivities.findOne({ portfolio: pid })
      .select("reviews")
      .populate("reviews.user", ["userid", "name"]);
    if (!portfolio) {
      return res.status(401).json({ message: "no portfolio was found" });
    }
    res.status(200).json({ message: "reviews retrieved", reviews: portfolio });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

module.exports = app;
