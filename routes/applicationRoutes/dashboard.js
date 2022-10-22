const express = require("express");
const { verifyToken } = require("../../tokens/idToken");
const app = express();

app.get("/", verifyToken, (req, res) => {
  res.send("hello there from dashboard");
});

module.exports = app;
