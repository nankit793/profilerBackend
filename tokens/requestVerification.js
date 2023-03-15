const { verifyRefreshToken, verifyToken, generateToken } = require("./idToken");
const Registeration = require("../models/Registration");

async function requestVerification(accesstoken, refreshtoken, userid) {
  // const { accesstoken, refreshtoken, userid } = req.headers;
  // console.log(accesstoken, refreshtoken, userid, "jhihi");
  if (!accesstoken || !refreshtoken || !userid) {
    return { giveAccess: false, message: "Tokens not provided" };
  }
  let user = await Registeration.findOne({ userid: userid });
  if (!user) {
    return { giveAccess: false, message: "user could not be found" };
  }
  if (user && !user.verified) {
    return { giveAccess: false, message: "user is not verified" };
  }
  const verifiedRefreshToken = await verifyRefreshToken(refreshtoken);
  if (!verifiedRefreshToken.verified) {
    return { giveAccess: false, message: verifiedRefreshToken.message };
  }
  if (verifiedRefreshToken.verifyToken.id != user._id) {
    return { giveAccess: false, message: "Tokens not belong to same user" };
  }

  const verifiedAccessToken = await verifyToken(accesstoken);
  if (verifiedAccessToken.verified && verifiedAccessToken.generateNew) {
    const payload = {
      id: verifiedRefreshToken.verifyToken.id,
    };
    const newAccessToken = await generateToken(payload);
    return { giveAccess: true, newAccessToken, user };
  }
  if (verifiedAccessToken.verified && !verifiedAccessToken.generateNew) {
    if (
      verifiedAccessToken.verifyToken.id === verifiedRefreshToken.verifyToken.id
    ) {
      return { giveAccess: true, user };
    }
    return { giveAccess: false, message: "Tokens not belong to same user" };
  }
  return { giveAccess: false, message: "token invalid" };
}

async function userFromToken(refreshtoken) {
  const verifiedRefreshToken = await verifyRefreshToken(refreshtoken);
  if (!verifiedRefreshToken.verified) {
    return { showDetails: false, message: verifiedRefreshToken.message };
  }
  const user = Registeration.findById(verifiedRefreshToken.verifyToken.id);
  if (!user) {
    return { showDetails: false, message: "user was not found" };
  }
  return { showDetails: true, user };
}
module.exports = { requestVerification, userFromToken };
