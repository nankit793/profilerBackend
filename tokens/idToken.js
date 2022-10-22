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
      expiresIn: `1h`,
    };
    const authToken = await jwt.sign(payload, JWT_SECRET, options);
    return authToken;
  } catch (error) {
    return res.status(500).json({ message: error });
  }
}

async function verifyToken(req, res, next) {
  try {
    const token = req.headers["authorization"];
    if (!token) {
      return res.status(401).json({ message: "Authorization header empty" });
    }
    const bearerToken = token.split(" ")[1];
    const verifyToken = await jwt.verify(bearerToken, JWT_SECRET);
    req.payload = verifyToken;
    next();
  } catch (error) {
    return res.status(401).json({ message: error });
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

async function verifyRefreshToken(req, res, next) {
  try {
    let { refreshToken } = req.body;
    const verifyToken = await jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const savedToken = await UserRefToken.findOne({ id: verifyToken.id });

    if (refreshToken === savedToken.refToken) {
      return verifyToken;
    }
  } catch (error) {
    return error;
  }
}
module.exports = {
  generateToken,
  verifyToken,
  generateRefreshToken,
  verifyRefreshToken,
};
