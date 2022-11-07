const { body } = require("express-validator");
const jwt = require("jsonWebToken");
const JWT_SECRET =
  "480379f7af5696d7b0707640263189c63e1f61a4fad01d1b60b30822ffc01047";

JWT_REFRESH_SECRET =
  "08885372da268ae27276ad09562e8c62b3e193d351f6580c3f6546b6890abb2c";
const UserRefToken = require("../models/UserRefToken");
async function generateToken(payload) {
  try {
    const options = {
      expiresIn: `10s`,
    };
    const authToken = await jwt.sign(payload, JWT_SECRET, options);
    return authToken;
  } catch (error) {
    return res.status(500).json({ message: error });
  }
}

async function verifyToken(accessToken) {
  try {
    const verifyToken = await jwt.verify(accessToken, JWT_SECRET);
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
    const refreshToken = await jwt.sign(payload, JWT_REFRESH_SECRET, options);
    saveUserRefToken.refToken = refreshToken;
    saveUserRefToken.save();
    return refreshToken;
  } catch (error) {
    return res.status(500).json({ message: error });
  }
}

async function verifyRefreshToken(refreshToken) {
  try {
    const verifyToken = await jwt.verify(refreshToken, JWT_REFRESH_SECRET);
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
