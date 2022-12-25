const express = require("express");
const app = express();

app.use("/register", require("./userRoutes/register"));
app.use("/login", require("./userRoutes/login"));
app.use("/refresh-token", require("./userRoutes/refreshToken"));
app.use("/forgotPassword", require("./userRoutes/forgotPassword"));
app.use("/isUserRegistered", require("./userRoutes/isUserRegistered"));
app.use("/profilerList", require("./profilerList"));

module.exports = app;
