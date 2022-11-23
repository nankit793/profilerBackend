const express = require("express");
const app = express();
const postJobProfiler = require("../models/JobProfiler");
const Registration = require("../models/Registration");

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
  let jobProfile = true;
  const userOnPost = await postJobProfiler.findOne({ userid: userid });
  if (!userOnPost) {
    jobProfile = false;
  }
  res.status(200).json({ message: "success", jobProfile });
});
module.exports = app;
