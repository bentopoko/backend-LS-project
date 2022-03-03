var express = require("express");
var router = express.Router();

var userModel = require("../models/users");
var productModel = require("../models/products");
var orderModel = require("../models/orders");

var bcrypt = require("bcrypt");
var uid2 = require("uid2");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.json();
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
    res.json({ result, saveProduct });
  } else {
    res.json({ result });
  }
});

// products list from db
router.get("/products-find-by-category", async function (req, res, next) {
  console.log("/products-find-by-category", req.query);

  var result = false;

  var productFindPlatJour = await productModel.find({
    "category.name": "PLAT ET DESSERT DU JOUR",
  });
  console.log("productFindPlatJour", productFindPlatJour);

  var productFindSandwichs = await productModel.find({
    "category.name": "SANDWICHS",
  });
  console.log("productFindSandwichs", productFindSandwichs);

  var productFindDesserts = await productModel.find({
    "category.name": "DESSERTS",
  });
  console.log("productFindDesserts", productFindDesserts);

  var data = [
    {
      category: "PLAT ET DESSERT DU JOUR",
      products: productFindPlatJour,
    },
    {
      category: "SANDWICHS",
      products: productFindSandwichs,
    },
    {
      category: "DESSERTS",
      products: productFindDesserts,
    },
  ];
  console.log("data", data);

  if (data) {
    result = true;
    res.json({ result, data });
  } else {
    res.json({ result });
  }
});

// product from db by ID
router.get("/products/:id", async function (req, res, next) {
  console.log("/products/:id", req.params);

  var result = false;

  var productFindID = await productModel.findById(req.params.id);
  console.log("productFindID", productFindID);

  if (productFindID) {
    result = true;
    res.json({ result, productFindID });
  } else {
    res.json({ result });
  }
});

// sign-up
router.post("/users/actions/sign-up", async function (req, res, next) {
  let error = {};
  let result = false;
  let saveUser = null;
  let token = null;

  console.log("---req.body", req.body);

  const data = await userModel.findOne({ email: req.body.email });

  if (data != null) {
    error.email = "Email already registered";
  }

  for (const property in req.body) {
    if (req.body[property] === "") {
      error[property] = "Missing field";
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
      error.email = "Invalid email address";
    }
  };

  let mobile_valide = (mobile) => {
    var regMobile = new RegExp(/^(06|07)[0-9]{8}/gi);
    if (regMobile.test(mobile)) {
      console.log("---Mobile Ok");
    } else {
      error.mobile = "Invalid mobile number";
    }
  };

  mail_valide(req.body.email);
  mobile_valide(req.body.mobile);

  if (req.body.password.length < 8) {
    error.password = "Password must be over 8 characters";
  }

  console.log("---error=>", error);

  if (Object.keys(error).length === 0) {
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

      res.json({
        result,
        userLoggedIn: {
          firstname: saveUser.firstname,
          lastname: saveUser.lastname,
          pseudo: saveUser.pseudo,
          mobile: saveUser.mobile,
          email: saveUser.email,
          token: saveUser.token,
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
router.post("/users/actions/sign-in", async function (req, res, next) {
  console.log("---in route sign, req.body =>", req.body);
  let result = false;
  let user = null;
  let error = {};

  for (const property in req.body) {
    if (req.body[property] === "") {
      error[property] = "Missing field";
    }
  }

  if (Object.keys(error).length === 0) {
    user = await userModel.findOne({ email: req.body.email });
    console.log("---user in sign in =>", user);

    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        error = "No error detected";
        result = true;
        token = user.token;
        user = {
          firstname: user.firstname,
          lastname: user.lastname,
          pseudo: user.pseudo,
          mobile: user.mobile,
          email: user.email,
          token: user.token,
        };
      } else {
        result = false;
        user = null;
        error.password = "Incorrect Password";
      }
    } else {
      error.email = "Email not registered";
    }
  }

  console.log("---error in sign in=>", error);

  res.json({
    result,
    error,
    userLoggedIn: user,
  });
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
    res.json({ result, saveOrder });
  } else {
    res.json({ result });
  }
});

// orders history by user ID
router.get("/orders/users/:id", async function (req, res, next) {
  console.log("/orders/users/:id", req.params);

  var result = false;

  var ordersFindID = await orderModel.findById(req.params.id);
  console.log("ordersFindID", ordersFindID);

  if (ordersFindID) {
    result = true;
    res.json({ result, ordersFindID });
  } else {
    res.json({ result });
  }
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
