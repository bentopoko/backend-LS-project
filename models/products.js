const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  img: String,
  stock: Number,
  category: [
    {
      name: String,
    },
  ],
});

const productModel = mongoose.model("products", productSchema);

module.exports = productModel;
