const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  products: [
    {
      productID: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
      qty: Number,
    },
  ],
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  date_insert: Date,
  status_payment: Boolean,
  date_payment: Date,
  time_picker: Date,
  status_delivery: Boolean,
  status_preparation: Boolean,
});

const orderModel = mongoose.model("orders", orderSchema);

module.exports = orderModel;
