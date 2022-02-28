const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstname: String,
  lastname: String,
  pseudo: String,
  mobile: String,
  email: String,
  password: String,
  token: String,
});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
