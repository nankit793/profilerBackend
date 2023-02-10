require("./db");
require("./tokens/redis");
var bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const port = process.env.PORT || 5000;
const app = express();
require("dotenv").config({
  path: "./dev.env",
});
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
// routes to handle
app.use("/", require("./routes/application"));
app.use("/user", require("./routes/user"));
app.use("/getbasic", require("./routes/userBasicInfo"));
app.use("/updateJobProfile", require("./routes/updateJobProfile"));
app.use("/jobResume", require("./routes/jobResume"));
app.use("/searchUser", require("./routes/searchUser"));
app.use("/profilePhoto", require("./routes/profilePhoto"));

// unhandled routes
app.use("*", (req, res) => {
  res.status(404).json({ message: "page not found" });
});

app.listen(port, () => {
  console.log(`Listening at Port: ${port}`);
});
