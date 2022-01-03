// ALL CRUD functionalities related to Comment
const router = require("express").Router();
const CommentModel = require("../models/comment");

// GET ALL
router.get("/", (req, res) => {
  CommentModel.find()
    .select("-__v")
    .populate(["userid", "storyid"])
    .then((response) => {
      res.status(200).json({ data: response });
    })
    .catch((err) => {
      res.status(404).json({ error: err.message });
    });
});

// GET single item
router.get("/:id", (req, res) => {
  CommentModel.findOne({ _id: req.params.id })
    .select("-__v")
    .populate(["userid", "storyid"])
    .then((response) => {
      res.status(200).json({ data: response });
    })
    .catch((err) => {
      res.status(404).json({ error: err.message });
    });
});

// POST
router.post("/", (req, res) => {
  let newData = new CommentModel(req.body);
  newData
    .save()
    .then((response) => {
      res.status(200).json({ data: response });
    })
    .catch((err) => {
      res.status(404).json({ error: err.message });
    });
});

// PUT update item
router.put("/:id", (req, res) => {
  CommentModel.findByIdAndUpdate(req.params.id, req.body)
    .select("-__v")
    .populate(["userid", "storyid"])
    .then((response) => {
      res.status(200).json({ data: response });
    })
    .catch((err) => {
      res.status(404).json({ error: err.message });
    });
});

// DELETE
router.delete("/:id", (req, res) => {
  CommentModel.findByIdAndRemove(req.params.id)
    .select("-__v")
    .populate(["userid", "storyid"])
    .then((response) => {
      res.status(200).json({ data: response });
    })
    .catch((err) => {
      res.status(404).json({ error: err.message });
    });
});

// GET all comments by story
router.get("/bystory/:id", (req, res) => {
  CommentModel.find({ storyid: req.params.id })
    .select("-__v")
    .populate(["userid", "storyid"])
    .then((response) => {
      res.status(200).json({ data: response });
    })
    .catch((err) => {
      res.status(404).json({ error: err.message });
    });
});

// GET all comments by user
router.get("/byuser/:id", (req, res) => {
  CommentModel.find({ userid: req.params.id })
    .select("-__v")
    .populate(["userid", "storyid"])
    .then((response) => {
      res.status(200).json({ data: response });
    })
    .catch((err) => {
      res.status(404).json({ error: err.message });
    });
});

module.exports = router;
