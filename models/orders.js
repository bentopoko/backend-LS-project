const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  products: [
    {
      productID: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
      qty: Number,
    },
  ],
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  dateInsert: Date,
  statusPayment: Boolean,
  datePayment: Date,
  timePicker: Date,
  statusDelivery: Boolean,
  statusPreparation: Boolean,
});

const orderModel = mongoose.model("orders", orderSchema);

module.exports = orderModel;
