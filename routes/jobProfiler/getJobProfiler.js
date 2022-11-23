const express = require("express");
const postJobProfiler = require("../../models/JobProfiler");
const Registration = require("../../models/Registration");
const app = express();

app.get("/", async (req, res) => {
  const { userid } = req.headers;
  if (!userid) {
    return res.status(401).json({ message: "need userid or username" });
  }
  const user = await Registration.findOne({ userid: userid });
  if (!user) {
    return res
      .status(401)
      .json({ message: "user not found", registered: false });
  }
  let userOnPost = await postJobProfiler.findOne({ userid: userid });
  if (!userOnPost) {
    res.status(401).json({
      message: "user does not have Job Profiler",
      registered: true,
      haveJobProfile: false,
    });
  }
  try {
    delete userOnPost["_id"];
    res.status(200).json({
      message: "user job profile has been found",
      registered: true,
      haveJobProfile: true,
      userOnPost,
    });
  } catch (error) {}
});
module.exports = app;
