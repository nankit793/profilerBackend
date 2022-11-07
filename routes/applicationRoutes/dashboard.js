const express = require("express");
const { requestVerification } = require("../../tokens/requestVerification");
const app = express();

app.get("/", async (req, res) => {
  try {
    const verifiedRequest = await requestVerification(req);
    if (!verifiedRequest.giveAccess) {
      return res.status(401).json({
        giveAccess: verifiedRequest.giveAccess,
        message: verifiedRequest.message,
      });
    }
    const { newAccessToken } = verifiedRequest || "";
    res.json({
      newAccessToken,
      message: verifiedRequest.message,
      giveAccess: verifiedRequest.giveAccess,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("Server Error");
  }
});

module.exports = app;
