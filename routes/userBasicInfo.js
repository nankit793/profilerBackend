const express = require("express");
const app = express();
const userBasicInfo = require("../models/BasicUserInfo");
const { requestVerification } = require("../tokens/requestVerification");
const deletions = (arr, user) => {
  // delete keys
  return user;
};
app.get("/", async (req, res) => {
  const { userid, requirement, safeMode } = req.headers;
  if (!userid) {
    return res
      .status(401)
      .json({ message: "need userid or username", registered: false });
  }
  try {
    const user = await userBasicInfo.findOne({ userid: userid });
    if (!user) {
      return res
        .status(401)
        .json({ message: "user not found", registered: false });
    }
    if (requirement) {
      // requirement.forEach(element => {
      //   const requiredData = user[element];
      //   newData.element = requiredData
      // });
      return res.status(200).json({ newData: { userid: user["userid"], name: user["name"], newData: user[requirement] } });
    }
    //
    if (safeMode) {
      const newData = deletions(["_id", "id", "jobProfile"], user);
      return res.status(200).json({ message: "safe mode on", newData });
    }
    const newData = deletions(["_id", "id"], user);
    return res
      .status(200)
      .json({ message: "user has been found", registered: true, newData });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: error.message });
  }
});

//on req.body userid, refreToken, accessToken
app.patch("/", async (req, res) => {
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
  // const { _id, id, username } = req.body.headers.data;
  // if (_id || id || req.body.headers.data.userid || username) {
  //   return res.status(401).json({ message: "You cannot update this" });
  // }
  try {
    const { newAccessToken } = verifiedRequest || "";
    const { user } = verifiedRequest;
    const data = req.body.headers.data;
    delete data["_id"];
    delete data["userid"];
    delete data["id"];
    delete data["username"];
    delete data["jobProfile"];
    const saveUser = await userBasicInfo.findOneAndUpdate(
      { id: user.id },
      data
    );
    saveUser.save();
    res.json({
      newAccessToken,
      message: "Updated user",
    });
  } catch (error) {
    res.status(401).json({ message: error });
  }
});

module.exports = app;
