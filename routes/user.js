const express = require("express");
const app = express();

app.use("/register", require("./userRoutes/register"));
app.use("/login", require("./userRoutes/login"));
app.use("/refresh-token", require("./userRoutes/refreshToken"));

module.exports = app;
