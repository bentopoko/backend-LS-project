var express = require("express");
var router = express.Router();

var userModel = require("../models/users");
var productModel = require("../models/products");
var orderModel = require("../models/orders");

var bcrypt = require("bcrypt");
var uid2 = require("uid2");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

// add products into the database
router.post("/products-insert", async function (req, res, next) {
  console.log("/products-insert", req.body);

  var result = false;

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

  if (saveProduct) {
    result = true;
  }

  res.json({ result, saveProduct });
});

// products list from db
router.get("/productsFindByCategory", async function (req, res, next) {
  console.log("/productsFindByCategory", req.query);

  var result = false;

  var productFind = await productModel.find({
    productCategory: req.query.productCategory,
  });
  console.log("productFind", productFind);

  if (productFind) {
    result = true;
  }

  res.json({ result, productFind });
});

// product from db by ID
router.get("/products/:id", async function (req, res, next) {
  console.log("/products/:id", req.params);

  var result = false;

  var productFindID = await productModel.findById(req.params.id);
  console.log("productFindID", productFindID);

  if (productFindID) {
    result = true;
  }

  res.json({ result, productFindID });
});

// sign-up
router.post("/users/actions/sign-up", async function (req, res, next) {
  let error = [];
  let result = false;
  let saveUser = null;
  let token = null;

  console.log("---req.body", req.body);

  const data = await userModel.findOne({ email: req.body.email });

  if (data != null) {
    error.push({ email: "email already registered" });
  }

  for (const property in req.body) {
    if (req.body[property] === "") {
      error.push({ [property]: "Missing field" });
    }
  }

  let mail_valide = (email) => {
    var regMail = new RegExp(
      "^[a-z0-9]+([_|.|-]{1}[a-z0-9]+)*@[a-z0-9]+([_|.|-]{1}[a-z0-9]+)*[.]{1}[a-z]{2,6}$",
      "i"
    );
    if (regMail.test(email)) {
      console.log("---Email Ok");
    } else {
      error.push({ email: "Invalid email address" });
    }
  };

  let mobile_valide = (mobile) => {
    var regMobile = new RegExp(/^(06|07)[0-9]{8}/gi);
    if (regMobile.test(mobile)) {
      console.log("---Mobile Ok");
    } else {
      error.push({ mobile: "Invalid mobile number" });
    }
  };

  mail_valide(req.body.email);
  mobile_valide(req.body.mobile);

  if (req.body.password.length < 8) {
    error.push({ password: "Password must be over 8 characters" });
  }

  console.log("---error=>", error);

  if (error.length == 0) {
    error = "No error detected";
    var hash = bcrypt.hashSync(req.body.password, 10);
    var newUser = new userModel({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      pseudo: req.body.pseudo,
      mobile: req.body.mobile,
      email: req.body.email,
      password: hash,
      token: uid2(32),
    });

    saveUser = await newUser.save();

    if (saveUser) {
      result = true;
      token = saveUser.token;

      res.json({
        result,
        userLoggedIn: {
          firstname: saveUser.firstname,
          lastname: saveUser.lastname,
          pseudo: saveUser.pseudo,
          mobile: saveUser.mobile,
          email: saveUser.email,
          token,
        },
        error,
      });
    }
  } else {
    res.json({
      result,
      error,
    });
  }
});

// sign-in
router.post("/users/actions/sign-in", function (req, res, next) {
  res.json({});
});

// order registration
router.post("/orders", async function (req, res, next) {
  console.log("/orders", req.body);

  var result = false;

  var userFind = await userModel.findOne({
    token: req.body.token,
  });
  console.log("userFind", userFind);

  var productFind = await productModel.find({
    productID: req.body.productID,
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

  if (saveOrder) {
    result = true;
  }

  res.json({ result, saveOrder });
});

// orders history by user ID
router.get("/orders/users/:id", async function (req, res, next) {
  console.log("/orders/users/:id", req.params);

  var result = false;

  var ordersFindID = await orderModel.findById(req.params.id);
  console.log("ordersFindID", ordersFindID);

  if (ordersFindID) {
    result = true;
  }

  res.json({ result, ordersFindID });
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
