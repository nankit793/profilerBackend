require("./db");
require("./tokens/redis");
const callerFunciton = require("./trendingBlogs");
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
setInterval(() => {
  callerFunciton();
}, 1000 * 60 * 60);
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

// routes to handle
app.use("/", require("./routes/application"));
app.use("/user", require("./routes/user"));
app.use("/getbasic", require("./routes/userBasicInfo"));
app.use("/searchUser", require("./routes/searchUser"));
app.use("/profilePhoto", require("./routes/profilePhoto"));
app.use("/follow", require("./routes/userRoutes/follow"));
app.use("/unfollow", require("./routes/userRoutes/unfollow"));
app.use("/followingList", require("./routes/followingList"));

// blog
app.use("/blogPost", require("./routes/services/postBlog"));
app.use("/deleteBlog", require("./routes/services/deleteBlog"));
app.use("/like", require("./routes/web/like"));
app.use("/unlike", require("./routes/web/unlike"));
app.use("/comment", require("./routes/web/comment"));
app.use("/editComment", require("./routes/web/editComment"));
app.use("/commentService", require("./routes/web/commentService/index"));
app.use("/bookMarks", require("./routes/web/bookMarksService/bookMarks"));
app.use(
  "/removeBookmark",
  require("./routes/web/bookMarksService/removeBookmark")
);
app.use("/editBlog", require("./routes/services/editBlog"));

//trending blogs
app.use("/trendingBlogs", require("./routes/tredings"));

// portfolio
app.use("/jobResume", require("./routes/jobResume"));
app.use("/portfolio/update", require("./routes/services/updateJobProfile"));
app.use("/portfolio/generate", require("./routes/services/generatePortfolio"));
app.use("/portfolio/get", require("./routes/services/getPortfolio"));
app.use("/portfolio/like", require("./routes/web/portfolio/like"));
app.use("/portfolio/unlike", require("./routes/web/portfolio/unlike"));
app.use("/portfolio/review", require("./routes/web/portfolio/reviews"));
app.use("/portfolio/review/edit", require("./routes/web/portfolio/editReview"));
app.use("/portfolio/getReviews", require("./routes/web/portfolio/getReviews"));
app.use("/portfolio/review/pin", require("./routes/web/portfolio/pin"));
app.use("/portfolio/review/unpin", require("./routes/web/portfolio/unpin"));
app.use("/portfolio/bookmarks", require("./routes/web/portfolio/bookmarks"));

// unhandled routes
app.use("*", (req, res) => {
  res.status(404).json({ message: "page not found" });
});

app.listen(port, () => {
  console.log(`Listening at Port: ${port}`);
});
