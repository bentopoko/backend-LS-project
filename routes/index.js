var express = require("express");
var router = express.Router();

var userModel = require("../models/users");

var bcrypt = require("bcrypt");
var uid2 = require("uid2");

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
router.post("/users/actions/sign-up", async function (req, res, next) {
  let error = [];
  let result = false;
  let saveUser = null;
  let token = null;

  const data = await userModel.findOne({ email: req.body.email });

  if (data != null) {
    error.push("email already registered");
  }

  for (const property in req.body) {
    if (req.body[property] === "") {
      error.push(`${property}: Missing field`);
    }
  }

  let mail_valide = (email) => {
    var regMail = new RegExp(
      "^[a-z0-9]+([_|.|-]{1}[a-z0-9]+)*@[a-z0-9]+([_|.|-]{1}[a-z0-9]+)*[.]{1}[a-z]{2,6}$",
      "i"
    );
    if (regMail.test(email)) {
      console.log("---Mail Ok");
    } else {
      error.push("Invalid email address");
    }
  };

  let mobile_valide = (mobile) => {
    var regMobile = new RegExp(/^(06|07)[0-9]{8}/gi);
    if (regMobile.test(mobile)) {
      console.log("---Mobile Ok");
    } else {
      error.push("Invalid mobile number");
    }
  };

  mail_valide(req.body.email);
  mobile_valide(req.body.mobile);

  if (req.body.password.length < 8) {
    error.push("Password must be over 8 characters");
  }

  console.log(error);

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
      userLoggedIn: "none",
      error,
    });
  }
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
