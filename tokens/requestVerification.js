const { verifyRefreshToken, verifyToken, generateToken } = require("./idToken");
const Registeration = require("../models/Registration");

async function requestVerification(req) {
  const { accessToken, refreshToken, userid } = req.body;
  if (!accessToken || !refreshToken || !userid) {
    return { giveAccess: false, message: "Tokens not provided" };
  }
  let user = await Registeration.findOne({ userid: userid });
  if (!user) {
    return { giveAccess: false, message: "user could not be found" };
  }
  const verifiedRefreshToken = await verifyRefreshToken(refreshToken);
  if (!verifiedRefreshToken.verified) {
    return { giveAccess: false, message: verifiedRefreshToken.message };
  }
  if (verifiedRefreshToken.verifyToken.id != user._id) {
    return { giveAccess: false, message: "Tokens not belong to same user" };
  }

  const verifiedAccessToken = await verifyToken(accessToken);
  // console.log(verifiedRefreshToken, verifiedAccessToken);
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
module.exports = { requestVerification };
