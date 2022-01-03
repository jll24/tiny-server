// ALL CRUD functionalities related to User
const router = require("express").Router();
const UserModel = require("../models/user");

const selectedField = "-__v -resetlink -password -createdAt -updatedAt";
const populateField = ["followers", "following"];

// GET ALL
router.get("/", (req, res) => {
  UserModel.find()
    .select(selectedField)
    .populate(populateField)
    .then((response) => {
      res.status(200).json({ data: response });
    })
    .catch((err) => {
      res.status(404).json({ error: err.message });
    });
});

// GET single item
router.get("/:id", (req, res) => {
  UserModel.findOne({ _id: req.params.id })
    .select(selectedField)
    .populate(populateField)
    .then((response) => {
      res.status(200).json({ data: response });
    })
    .catch((err) => {
      res.status(404).json({ error: err.message });
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
//      res.status(404).json({ error: err.message });
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
//      res.status(404).json({ error: err.message });
//    });
//});

// DELETE
router.delete("/:id", (req, res) => {
  UserModel.findByIdAndRemove(req.params.id)
    .select(selectedField)
    .populate(populateField)
    .then((response) => {
      res.status(200).json({ message: "delete ok!" });
    })
    .catch((err) => {
      res.status(404).json({ error: err.message });
    });
});

module.exports = router;
