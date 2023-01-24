const express = require("express");
const app = express();
const userBasicInfo = require("../models/BasicUserInfo");
const { requestVerification } = require("../tokens/requestVerification");

app.patch("/", async (req, res) => {
  try {
    const { accesstoken, refreshtoken, userid } = req.body.headers;
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
    const { jobProfile } = req.body;
    const saveUser = await userBasicInfo.findOne({ id: user.id });
    if (saveUser.jobProfile.generated) {
      jobProfile.generated = true;
      saveUser.jobProfile = jobProfile;
      saveUser.save();
      return res.status(200).json({
        newAccessToken,
        message: "Updated user",
      });
    }
    return res
      .status(400)
      .json({ message: "user has not created job profile" });
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: error.message });
  }
});

module.exports = app;
