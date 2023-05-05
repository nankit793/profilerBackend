const Blogs = require("./models/BlogsData");
const BlogActivities = require("./models/BlogActivities");
const TrendingBlogs = require("./models/TrendingBlogs");

// Find the top 10 posts based on likes, comments, views, upload date, and edited date
const callerFunciton = async () => {
  try {
    const trends = await BlogActivities.aggregate([
      {
        $addFields: {
          trending_score: {
            $add: [
              { $multiply: ["$numLikes", 0.4] },
              { $multiply: ["$numComments", 0.3] },
              { $multiply: ["$views", 0.2] },
              {
                $multiply: [
                  {
                    $divide: [
                      1,
                      { $subtract: [new Date(), new Date("$blogUpload")] },
                    ],
                  },
                  0.1,
                ],
              },
            ],
          },
        },
      },
      {
        $sort: { trending_score: -1 }, // Sort by score in descending order
      },
      {
        $limit: 10, // add a limit of 10 posts
      },
    ]);
    // Clear the existing trending posts
    await TrendingBlogs.deleteMany({});
    // Create new trending post documents
    const newTrendingPosts = trends.map((blog) => {
      return {
        blog: blog.blog._id,
      };
    });
    // Insert the new trending posts into the collection
    await TrendingBlogs.insertMany(newTrendingPosts);
  } catch (error) {
    console.log(error);
  }
};
callerFunciton();
module.exports = callerFunciton;
