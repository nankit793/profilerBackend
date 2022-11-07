const { verifyRefreshToken, verifyToken, generateToken } = require("./idToken");

async function requestVerification(req) {
  const { accessToken, refreshToken } = req.body;
  if (!accessToken || !refreshToken) {
    return { giveAccess: false, message: "Tokens not provided" };
  }

  const verifiedRefreshToken = await verifyRefreshToken(refreshToken);
  if (!verifiedRefreshToken.verified) {
    return { giveAccess: false, message: verifiedRefreshToken.message };
  }

  const verifiedAccessToken = await verifyToken(accessToken);
  console.log(verifiedRefreshToken, verifiedAccessToken);
  if (verifiedAccessToken.verified && verifiedAccessToken.generateNew) {
    const payload = {
      id: verifiedRefreshToken.id,
    };

    const newAccessToken = await generateToken(payload);
    return { giveAccess: true, newAccessToken };
  }
  if (verifiedAccessToken.verified && !verifiedAccessToken.generateNew) {
    if (
      verifiedAccessToken.verifyToken.id === verifiedRefreshToken.verifyToken.id
    ) {
      return { giveAccess: true };
    }
    return { giveAccess: false, message: "Tokens not belong to same user" };
  }
  return { giveAccess: false, message: "token invalid" };
}
module.exports = { requestVerification };
