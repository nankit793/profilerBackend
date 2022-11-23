const express = require("express");
const { requestVerification } = require("../../tokens/requestVerification");
const app = express();

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
