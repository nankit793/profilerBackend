const express = require("express");
const app = express();
const BasicUserInfo = require("../../models/BasicUserInfo");
const { requestVerification } = require("../../tokens/requestVerification");
const PortFolios = require("../../models/PortFolios");
const PortfolioActivities = require("../../models/PortfolioActivities");
app.post("/", async (req, res) => {
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

    let BasicInfo = await BasicUserInfo.findOne({ id: user.id });

    if (BasicInfo && BasicInfo.portfolios && BasicInfo.portfolios.length >= 2) {
      return res
        .status(401)
        .json({ message: "portfolio generating limit reached" });
    }
    const basicUserId = BasicInfo._id;
    const savePortfolio = await PortFolios({ user: basicUserId });
    const portfolioAtActivities = await PortfolioActivities({
      portfolio: savePortfolio._id,
    });
    await BasicInfo.updateOne({
      $push: { portfolios: savePortfolio._id },
      $set: { portfolioGenerated: true },
      upsert: true,
    });

    await portfolioAtActivities.save();
    await savePortfolio.save();
    res.status(200).json({
      message: "portfolio has been generated",
      portfolioID: savePortfolio._id,
      state: true,
      newAccessToken,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});
module.exports = app;
