const express = require("express");
const app = express();

app.use("/getJobProfiler", require("./getJobProfiler"));
app.use("/postJobProfiler", require("./postJobProfiler"));
module.exports = app;
