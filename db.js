const mongoose = require("mongoose");

try {
  mongoose.connect(
    "mongodb+srv://nankit793:Qwerty123@cluster0.lxezn87.mongodb.net/?retryWrites=true&w=majority",
    () => {
      console.log("Connection to the database successfully made");
    }
  );
} catch (error) {
  console.log(error);
}
