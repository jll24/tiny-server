// Functionalities for Login and Register
const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

const { check, validationResult } = require("express-validator");

const UserModel = require("../models/user");

//router.use(bodyParser.json());

// Route that will search for a unique userid
router.get("/profile/:id", (req, res) => {
  UserModel.findOne({ userid: req.params.id })
    .select("-__v -resetlink -password")
    .populate(["followers", "following"])
    .then((response) => {
      res.status(200).json({ data: response });
    })
    .catch((err) => {
      res.status(404).json({ error: err.message });
    });
});

const selectedField = "-__v -resetlink -password -createdAt -updatedAt";
const populateField = ["followers", "following"];

const forgotpasswordValidate = [
  check("email", "Must Be an Email Address")
    .notEmpty()
    .isEmail()
    .trim()
    .escape()
    .normalizeEmail(),
];

const resetpasswordValidate = [
  check("resetlink", "Must Be an Email Address")
    .notEmpty()
    .isLength({ min: 3 })
    .trim()
    .escape(),
  check("newpassword", "Password must not be blank")
    .notEmpty()
    .isLength({ min: 3 })
    .trim()
    .escape(),
];

const loginValidate = [
  check("email", "Must Be an Email Address")
    .notEmpty()
    .isEmail()
    .trim()
    .escape()
    .normalizeEmail(),
  check("password", "Password Must Be at Least 3 Characters")
    .notEmpty()
    .isLength({ min: 3 })
    .trim()
    .escape(),
];

const registerValidate = [
  check("firstname", "Must be First name").notEmpty().trim().escape(),
  check("lastname", "Must be Last name").notEmpty().trim().escape(),
  check("username", "Must be User name").notEmpty().trim().escape(),
  check("email", "Must Be an Email Address")
    .notEmpty()
    .trim()
    .escape()
    .normalizeEmail(),
  check("password", "Password Must Be at Least 3 Characters")
    .notEmpty()
    .isLength({ min: 3 })
    .trim()
    .escape(),
];

const getUserFiltered = (response) => {
  const {
    _id,
    firstname,
    lastname,
    email,
    username,
    photo,
    aboutme,
    followers,
    googleId,
  } = response;
  return {
    _id,
    firstname,
    lastname,
    username,
    photo,
    aboutme,
    email,
    followers,
    googleId,
  };
};

// Route that will search for a unique userid
router.get("/profile/:id", (req, res) => {
  UserModel.findOne({ username: req.params.id })
    .select(selectedField)
    .populate(populateField)
    .then((response) => {
      if (response === null) {
        return res
          .status(404)
          .json({ error: "User with that username not found!" });
      }

      res.status(200).json({ data: response });
    })
    .catch((err) => {
      res.status(404).json({ error: err.message });
    });
});

// Route that will check if an email exist
router.post("/email-exists", (req, res) => {
  UserModel.findOne({ email: req.body.email })
    .then((response) => {
      // res.data == true ( existing), false ( not existing )
      if (response) {
        res.send(true);
      } else {
        res.send(false);
      }
    })
    .catch((err) => {
      res.status(404).json({ error: err.message });
    });
});

// Route that will register users
router.post("/register", registerValidate, async (req, res) => {
  const errors = validationResult(req);

  if (errors.isEmpty() !== true) {
    return res.status(422).json({ errors: errors.array() });
  }

  let hashedPassword = await bcrypt.hash(req.body.password, 10);

  let newUser = new UserModel({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    username: req.body.username,
    photo: "https://www.gravatar.com/avatar/1",
    email: req.body.email,
    password: hashedPassword,
    aboutme: "",
    resetlink: "",
    googleId: req.body.googleId,
  });

  newUser
    .save()
    .then((response) => {
      return getUserFiltered(response);
    })
    .then((data) => {
      res.status(200).json({ data });
    })
    .catch((err) => {
      res.status(404).json({ error: err.message });
    });
});

// Route for login
router.post("/login", loginValidate, (req, res) => {
  const errors = validationResult(req);

  if (errors.isEmpty() !== true) {
    return res.status(422).json({ errors: errors.array() });
  }

  let email = req.body.email;
  let password = req.body.password;

  UserModel.findOne({ email })
    .then(async (foundUser) => {
      if (foundUser) {
        let match = await bcrypt.compare(password, foundUser.password);
        if (match) {
          const user = getUserFiltered(foundUser);
          res.status(200).json({ message: "Authentication successful", user });
        } else {
          res.status(404).json({ error: "Authentication Failed" });
        }
      } else {
        res.status(404).json({ error: "Email not found!" });
      }
    })
    .catch((err) => {
      res.status(404).json({ error: err.message });
    });
});

// Route for forgot password
router.post("/forgotpassword", forgotpasswordValidate, (req, res) => {
  const errors = validationResult(req);

  if (errors.isEmpty() !== true) {
    return res.status(422).json({ errors: errors.array() });
  }

  let { email } = req.body;

  UserModel.findOne({ email })
    .then((user) => {
      if (user === undefined || user === null) {
        return res
          .status(404)
          .json({ error: "User with this email does not exist." });
      }

      const token = jwt.sign({ _id: user._id }, process.env.RESET_PASSWORD, {
        expiresIn: "1h",
      });

      const htmlmessage =
        "<h2>Please click on the given link to reset your password.</h2><p>" +
        `<a href='http://${process.env.CLIENT_URL}/resetpassword/${token}'>Reset Password</a>` +
        "</p><p>This link will expire in 1 hour.</p>";

      return user
        .updateOne({ resetlink: token })
        .then((response) => {
          // called this with no error handling
          sendemail(email, htmlmessage);

          return res.status(200).json({
            message: "Email has been sent. Kindly follow instructions.",
          });
        })
        .catch((err) => {
          return res.status(404).json({ error: "Reset password link error!" });
        });
    })
    .catch((err) => {
      return res.status(404).json({ error: err.message });
    });
});

// Route for reset password
router.post("/resetpassword", resetpasswordValidate, async (req, res) => {
  const errors = validationResult(req);

  if (errors.isEmpty() !== true) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { resetlink, newpassword } = req.body;

  let hashedPassword = await bcrypt.hash(newpassword, 10);

  if (resetlink === undefined || resetlink === null) {
    return res.status(401).json({ error: "Authentication error!" });
  }

  jwt.verify(resetlink, process.env.RESET_PASSWORD, (err, decoded) => {
    if (err) {
      return res.status(404).json({ error: err.message });
    }

    UserModel.findOne({ resetlink })
      .then((user) => {
        if (user === undefined || user === null) {
          return res
            .status(400)
            .json({ error: "User with this token does not exist!" });
        }

        if (user.resetlink === "") {
          return res.status(404).json({ error: "Reset Link error." });
        }

        const obj = {
          password: hashedPassword,
          resetlink: "",
        };

        user = _.extend(user, obj);

        user
          .save()
          .then((response) => {
            return res
              .status(200)
              .json({ message: "Your password has been changed!" });
          })
          .catch((err) => {
            return res.status(400).json({ error: "Saving Reset error!" });
          });
      })
      .catch((err) => {
        return res
          .status(400)
          .json({ error: "User with this token does not exist!" });
      });
  });
});

router.post("/login-gmail", (req, res) => {
  UserModel.findOne({ email: req.body.email })
    .then(async (foundUser) => {
      if (foundUser) {
        let match = await (req.body.googleId.trim() ===
          foundUser.googleId.trim());
        if (match) {
          res
            .status(200)
            .json({ message: "Authentication Successfull", user: foundUser });
        } else {
          res.status(404).json({ error: "Authentication Failed" });
        }
      } else {
        res.status(404).json({ error: "Email not found!" });
      }
    })
    .catch((err) => {
      res.status(404).json({ error: err.message });
    });
});


module.exports = router;
