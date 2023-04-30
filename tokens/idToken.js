const { body } = require("express-validator");
const jwt = require("jsonwebtoken");

const UserRefToken = require("../models/UserRefToken");
async function generateToken(payload) {
  try {
    const options = {
      expiresIn: `1h`,
    };
    const authToken = await jwt.sign(
      payload,
      process.env.JWT_ACCESS_TOKEN_SECRET,
      options
    );
    return authToken;
  } catch (error) {
    return res.status(500).json({ message: error });
  }
}

async function verifyToken(accessToken) {
  try {
    const verifyToken = await jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_TOKEN_SECRET
    );
    return { verified: true, verifyToken, generateNew: false };
  } catch (error) {
    if (error.message === "jwt expired") {
      return { verified: true, generateNew: true };
    }
    return { verified: false, generateNew: false };
  }
}

async function generateRefreshToken(payload) {
  let saveUserRefToken = await UserRefToken.findOne({ id: payload.id });
  if (!saveUserRefToken) {
    saveUserRefToken = await UserRefToken({ id: payload.id });
  }
  try {
    const options = {
      expiresIn: `10 days`,
    };
    const refreshToken = await jwt.sign(
      payload,
      process.env.JWT_REFRESH_TOKEN_SECRET,
      options
    );
    saveUserRefToken.refToken = refreshToken;
    saveUserRefToken.save();
    return refreshToken;
  } catch (error) {
    return res.status(500).json({ message: error });
  }
}

async function verifyRefreshToken(refreshToken) {
  try {
    const verifyToken = await jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN_SECRET
    );
    const savedToken = await UserRefToken.findOne({ id: verifyToken.id });

    if (refreshToken === savedToken.refToken) {
      return { verified: true, verifyToken };
    }
    return {
      verified: false,
      message: "token does not match with previous token",
    };
  } catch (error) {
    return { verified: false, message: "invalid token" };
  }
}
module.exports = {
  generateToken,
  verifyToken,
  generateRefreshToken,
  verifyRefreshToken,
};
