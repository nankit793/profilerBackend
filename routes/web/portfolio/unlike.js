const express = require("express");
const PortfolioActivities = require("../../../models/PortfolioActivities");
const BasicUserInfo = require("../../../models/BasicUserInfo");
const { requestVerification } = require("../../../tokens/requestVerification");
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

    let BasicInfo = await BasicUserInfo.findOne({ id: user.id });
    const basicUserId = BasicInfo._id;

    const portfolio = await PortfolioActivities.findOne({ portfolio: pid });
    if (!portfolio) {
      return res.status(401).json({ message: "portfolio does not exist" });
    }
    if (
      portfolio &&
      portfolio.likes &&
      !portfolio.likes.includes(basicUserId)
    ) {
      return res
        .status(401)
        .json({ message: "already not liked", state: false, newAccessToken });
    }
    await portfolio.updateOne({
      $pull: { likes: basicUserId },
      $set: { numLikes: portfolio.numLikes - 1 },
    });

    res.status(200).json({ message: "unliked", state: true, newAccessToken });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

module.exports = app;
