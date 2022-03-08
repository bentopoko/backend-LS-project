var express = require("express");
var router = express.Router();

const dateFormat = function (date) {
  if (date) {
    return `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()} at ${date.getHours()}h ${date.getMinutes()}mn`;
  }
};

var userModel = require("../models/users");
var productModel = require("../models/products");
var orderModel = require("../models/orders");

var cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "dybetiefg",
  api_key: "791592437235491",
  api_secret: "4WEmESs6sIbX2YPVHSMC-vmlS3w",
});

var fs = require("fs");
var uniqid = require("uniqid");

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
      uri: "https://res.cloudinary.com/ds8shlqh0/image/upload/v1646644747/blankpp_vaslek.jpg",
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
          uri: saveUser.uri,
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
    console.log("---user =>", user);

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
          uri: user.uri,
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

router.post("/users/uploadpp", async function (req, res, next) {
  // console.log("---/upload route, req.files =>", req.files);
  // console.log("---/upload route, req.body =>", req.body);

  var imagePath = `./tmp/user_avatar_${uniqid()}.jpg`;

  var resultCopy = await req.files.avatar.mv(imagePath);

  var resultCloudinary = await cloudinary.uploader.upload(imagePath);
  console.log("---resultCloudinary =>", resultCloudinary);

  fs.unlinkSync(imagePath);

  await userModel.updateOne(
    { token: req.body.token },
    { uri: resultCloudinary.secure_url }
  );

  let userUpdated = await userModel.findOne({ token: req.body.token });
  console.log("---userUpdated =>", userUpdated);

  if (!resultCopy) {
    res.json({
      result: true,
      message: "File Uploaded",
      userUpdated: userUpdated,
    });
  } else {
    res.json({ result: false, message: resultCopy });
  }
});

// order registration
router.post("/orders", async function (req, res, next) {
  console.log("---/orders, req.body =>", req.body);

  var result = false;

  var user = await userModel.findOne({
    token: req.body.token,
  });
  console.log("---user =>", user);

  // let productsList = [];
  // for (let i = 0; i < req.body.products.length; i++) {
  //   productsList.push();
  // }
  // console.log("---productsList =>", productsList);

  var newOrder = new orderModel({
    products: req.body.products,
    userID: user._id,
    date_insert: req.body.date_insert,
    status_payment: req.body.status_payment,
    date_payment: req.body.date_payment,
    time_picker: req.body.time_picker,
    status_delivery: req.body.status_delivery,
    status_preparation: req.body.status_preparation,
  });

  var saveOrder = await newOrder.save();
  // console.log("saveOrder", saveOrder);

  if (saveOrder) {
    result = true;
    res.json({ result, saveOrder });
  } else {
    res.json({ result });
  }
});

// orders history by user ID
router.get("/orders/user/:token", async function (req, res, next) {
  console.log("---/orders/users/:token =>", req.params.token);

  var result = false;

  var user = await userModel.findOne({ token: req.params.token });
  console.log("---user =>", user);

  var ordersFromDB = await orderModel
    .find({ userID: user._id })
    .populate("products.productID")
    .exec();

  console.log("---ordersFromDB", ordersFromDB);

  let orders = [];
  if (ordersFromDB) {
    for (let i = 0; i < ordersFromDB.length; i++) {
      const order = ordersFromDB[i].toObject();
      order.date_insert = dateFormat(order.date_insert);
      order.time_picker = dateFormat(order.time_picker);
      orders.push(order);
    }
  }
  console.log("---orders =>", orders);

  if (ordersFromDB) {
    result = true;
    res.json({ result, orders });
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
