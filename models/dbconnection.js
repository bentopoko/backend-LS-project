var mongoose = require("mongoose");

var options = {
  connectTimeoutMS: 5000,
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

mongoose.connect(
  "mongodb+srv://pokopano:DeveloperCoolJazzFest33!@cluster0.zdnv4.mongodb.net/LS-database?retryWrites=true&w=majority",
  options,
  function (err) {
    if (err) {
      console.log("ups... something went wrong... please try again");
      return;
    }
    console.log("Oh yeahhh, congratulations... you are connected...");
  }
);

module.exports = mongoose;
