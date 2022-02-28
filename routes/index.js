var express = require("express");
var router = express.Router();

var userModel = require("../models/users");
var orderModel = require("../models/orders");
var productModel = require("../models/products");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

// add products into the database
router.post("/products", async function (req, res, next) {
  console.log("/products", req.body);

  var newProduct = new productModel({
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    img: req.body.img,
    stock: req.body.stock,
    category: req.body.category,
  });
  console.log("newProduct", newProduct);

  var saveProduct = await newProduct.save();
  console.log("saveProduct", saveProduct);

  res.json({ saveProduct });
});

// products list from db
router.get("/products", function (req, res, next) {
  res.json({});
});

// product from db by ID
router.get("/products/:id", function (req, res, next) {
  res.json({});
});

// sign-up
router.post("/users/actions/sign-up", function (req, res, next) {
  res.json({});
});

// sign-in
router.post("/users/actions/sign-in", function (req, res, next) {
  res.json({});
});

// order registration
router.post("/orders", async function (req, res, next) {
  console.log("/orders", req.body);

  var userFind = await userModel.findOne({
    token: req.body.token,
  });
  console.log("userFind", userFind);

  var productFind = await productModel.find({
    userToken: userFind.token,
  });
  console.log("userFind", userFind);

  var newOrder = new orderModel({
    product: [
      {
        productID: productFind._id,
        qty: req.body.qty,
      },
    ],
    clientToken: userFind.token,
    dateInsert: req.body.date_insert,
    statusPayment: req.body.status_payment,
    datePayment: req.body.date_payment,
    timePicker: req.body.time_picker,
    statusDelivery: req.body.status_delivery,
    statusPreparation: req.body.status_preparation,
  });

  var saveOrder = await newOrder.save();
  console.log("saveOrder", saveOrder);

  res.json({ saveOrder });
});

// orders history by user ID
router.get("/orders/users/:id", function (req, res, next) {
  res.json({});
});

// profile by user Id (slide 15)
router.get("/users/:id", function (req, res, next) {
  res.json({});
});

// profile update
router.put("/users/update/:token", function (req, res, next) {
  res.json({});
});

// profile delete by user Id (slide 15)
router.delete("/users/delete/:token", function (req, res, next) {
  res.json({});
});

module.exports = router;
