const BasicUserInfo = require("../../models/BasicUserInfo");

async function saveOnDB(req, payload) {
  const BasicInfo = await BasicUserInfo.findOne({ userid: req.body.userid });
  if (!BasicInfo) {
    const userOnBasic = await BasicUserInfo({
      id: payload.id,
      userid: req.body.userid,
    });
    userOnBasic.save();
  }
}

module.exports = { saveOnDB };
