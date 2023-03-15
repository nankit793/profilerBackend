const express = require("express");
const app = express();

app.use("/getComments", require("./getComments"));
app.use("/pinComment", require("./pinComment"));
app.use("/unpinComment", require("./unpinComment"));

module.exports = app;
