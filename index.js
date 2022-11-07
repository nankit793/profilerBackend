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

app.use(bodyParser.json());

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));
//form-urlencoded

app.use(cors());
// for json incoming data
app.use(express.json());

// for form data
app.use(express.urlencoded({ extended: true }));

// routes to handle
app.use("/", require("./routes/application"));
app.use("/user", require("./routes/user"));

// unhandled routes
app.use("*", (req, res) => {
  res.status(404).json({ message: "page not found" });
});

app.listen(port, () => {
  console.log(`Listening at Port: ${port}`);
});
