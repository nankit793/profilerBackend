const mongoose = require("mongoose");
require("dotenv").config();

try {
  mongoose.connect(process.env.DATABASE_URI, () => {
    console.log("Connection to the database successfully made");
  });
} catch (error) {
  console.log(error);
}

// create saperate collection for top trending blogs

// const Blogs = mongoose.model('blogsdatas');

// // Define the pre-aggregation pipeline
// const pipeline = [
//   {
//     $addFields: {
//       ageInDays: { $divide: [{ $subtract: [new Date(), "$uploadDate"] }, 86400000] },
//       score: { $divide: [ "$views", { $add: [1, { $divide: [{ $subtract: [new Date(), "$createdAt"] }, 86400000] }] } ] }
//     }
//   },
//   { $sort: { score: -1 } },
//   { $limit: 100 },
//   { $out: "TopPosts" }
// ];

// // Define a function to run the pre-aggregation pipeline
// async function runPreAggregation() {
//   try {
//     // Run the pipeline and wait for it to finish
//     await Blogs.aggregate(pipeline).exec();
//     console.log('Pre-aggregation complete');
//   } catch (err) {
//     console.error(err);
//   } finally {
//     // Close the database connection when finished
//     mongoose.connection.close();
//   }
// }

// Schedule the pre-aggregation to run every day at midnight
// const now = new Date();
// const millisUntilMidnight =
//   new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0) -
//   now;
// setTimeout(() => {
//   runPreAggregation();
//   setInterval(runPreAggregation, 24 * 60 * 60 * 1000); // Repeat every 24 hours
// }, millisUntilMidnight);
