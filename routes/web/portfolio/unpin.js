const express = require("express");
const PortfolioActivities = require("../../../models/PortfolioActivities");
const BasicUserInfo = require("../../../models/BasicUserInfo");
const { requestVerification } = require("../../../tokens/requestVerification");
const PortFolios = require("../../../models/PortFolios");
const app = express();

app.put("/", async (req, res) => {
  try {
    const { accesstoken, refreshtoken, userid } = req.headers;
    const { pid, rid } = req.query;
    if (!pid || !rid) {
      return res
        .status(401)
        .json({ message: "portfolio and review are required" });
    }
    const { text } = req.body;

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

    let BasicInfo = await BasicUserInfo.findOne({ id: user.id });
    const basicUserId = BasicInfo._id;

    const portfolio = await PortFolios.findById(pid).select("user");
    if (portfolio.user.toString() === basicUserId.toString()) {
      const updatedReview = await PortfolioActivities.findOneAndUpdate(
        {
          portfolio: pid,
          reviews: { $elemMatch: { _id: rid } },
        },
        { $set: { "reviews.$.pinned": false } },
        { new: true }
      );
      if (updatedReview !== null) {
        return res
          .status(200)
          .json({ message: "unpinned review", state: true });
      }
      res.status(403).json({
        message: "not authorized to unpin this review",
        state: false,
        newAccessToken,
      });
    }
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

module.exports = app;
