var express = require("express");
var router = express.Router();

var userModel = require("../models/users");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
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
router.post("/orders", function (req, res, next) {
  res.json({});
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
