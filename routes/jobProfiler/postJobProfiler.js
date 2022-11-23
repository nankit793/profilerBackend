const express = require("express");
const postJobProfiler = require("../../models/JobProfiler");
const { requestVerification } = require("../../tokens/requestVerification");
const userBasicData = require("../../models/BasicUserInfo");
const app = express();

app.post("/", async (req, res) => {
  const { userid, accesstoken, refreshtoken } = req.body.headers;
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
  let userOnPost = await postJobProfiler.findOne({ userid: userid });
  if (!userOnPost) {
    userOnPost = await postJobProfiler({ userid: userid });
  }
  try {
    const { newAccessToken } = verifiedRequest || "";
    await postJobProfiler.findOneAndUpdate(
      { userid: userid },
      req.body.headers.data
    );

    userOnPost.save();
    res.json({
      newAccessToken,
      message: verifiedRequest.message,
      giveAccess: verifiedRequest.giveAccess,
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: error });
  }
});
module.exports = app;
