const express = require("express");
const { generateToken, verifyRefreshToken } = require("../../tokens/idToken");
const { generateRefreshToken } = require("../../tokens/idToken");

const app = express();

app.post("/", async (req, res) => {
  // let recievedRefreshToken = req.headers["refreshToken"];
  try {
    const verifiedToken = await verifyRefreshToken(req, res);
    if (verifiedToken instanceof Error) {
      return res.status(401).json({ message: verifiedToken });
    }

    const payload = {
      id: verifiedToken.id,
    };

    const authToken = await generateToken(payload);
    res.json({ accessToken: authToken });
  } catch (error) {
    res.status(401).send(error);
  }
});

module.exports = app;
