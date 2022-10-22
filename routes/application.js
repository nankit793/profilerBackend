const express = require("express");
const app = express();

app.use("/", require("./applicationRoutes/dashboard"));
app.use("/dashboard", require("./applicationRoutes/dashboard"));

module.exports = app;
