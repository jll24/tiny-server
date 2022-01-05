// ALL CRUD functionalities related to User
const router = require("express").Router();
const UserModel = require("../models/user");
const { check, validationResult } = require("express-validator");

const selectedField = "-__v -resetlink -password -createdAt -updatedAt";

/**
 * Route to get ALL users
 * parameters - nothing
 * this will get all users
 * return - success (array of users, filtered, so that sensitive fields will not show), error
 */
router.get("/", (req, res) => {
  UserModel.find()
    .select(selectedField)
    .then((response) => {
      res.status(200).json({ data: response });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

/**
 * Route to get a SINGLE user
 * parameters - id (id of user)
 * this will get the user with id
 * return - success (a SINGLE user), error
 */
router.get("/:id", (req, res) => {
  UserModel.findOne({ _id: req.params.id })
    .select(selectedField)
    .then((response) => {
      if (response === null) {
        return res.status(500).json({ error: "No user with that id!" });
      }

      res.status(200).json({ data: response });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

// POST - commented this out because /register is the creation of new users
//router.post("/", (req, res) => {
//  let newData = new UserModel(req.body);
//
//  newData
//    .save()
//    .then((response) => {
//      res.status(200).json({ data: response });
//    })
//    .catch((err) => {
//      res.status(500).json({ error: err.message });
//    });
//});

// PUT update item
//router.put("/:id", (req, res) => {
//  UserModel.findByIdAndUpdate(req.params.id, req.body)
//    .select(selectedField)
//    .populate(populateField)
//    .then((response) => {
//      res.status(200).json({ data: response });
//    })
//    .catch((err) => {
//      res.status(500).json({ error: err.message });
//    });
//});

/**
 * Route to remove a SINGLE user
 * parameters - id (id of user)
 * this will remove a single user
 * return - success (delete ok!), error
 */
router.delete("/:id", (req, res) => {
  UserModel.findByIdAndRemove(req.params.id)
    .select(selectedField)
    .then((response) => {
      res.status(200).json({ message: "delete ok!" });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

/**
 * Route to patch the photo
 * parameters - id (id of user)
 * this will update the photo of the user
 * return - success (photo ok!), error
 */
router.patch(
  "/:id/photo",
  [check("photo", "Photo must have a value").notEmpty().trim()],
  (req, res) => {
    UserModel.findByIdAndUpdate(req.params.id, { photo: req.body.photo })
      .select(selectedField)
      .then((response) => {
        res.status(200).json({ message: "photo ok!" });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  }
);

/**
 * Route to patch the aboutme field
 * parameters - id (id of user)
 * this will update the aboutme field of the user
 * return - success (aboutme ok!), error
 */
router.patch(
  "/:id/aboutme",
  [check("aboutme", "Aboutme must have a value").notEmpty().trim().escape()],
  (req, res) => {
    UserModel.findByIdAndUpdate(req.params.id, { aboutme: req.body.aboutme })
      .select(selectedField)
      .then((response) => {
        res.status(200).json({ message: "aboutme ok!" });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  }
);

module.exports = router;
