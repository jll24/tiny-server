// ALL CRUD functionalities related to Story
const router = require("express").Router();
const StoryModel = require("../models/story");
const user = require("../models/user");

const { check, validationResult } = require("express-validator");

const selectedField = "-__v";
const populateField = "userid";

let storyValidate = [
  check("userid", "Must be First name").notEmpty().trim().escape(),
  check("title", "Must be First name").notEmpty().trim().escape(),
  check("content", "Must be Last name").notEmpty().trim().escape(),
  check("photo", "Must be User name").notEmpty().trim(),
];

const getStoryFiltered2 = (response) => {
  const { _id, userid, photo, title, content, claps, createdAt, updatedAt } =
    response;
  return {
    _id,
    userid,
    photo,
    title,
    content,
    claps,
    createdAt,
    updatedAt,
  };
};

const getStoryFiltered = (response) => {
  const { _id, userid, photo, title, content, claps, createdAt, updatedAt } =
    response;
  return {
    _id,
    photo,
    title,
    content,
    claps,
    createdAt,
    updatedAt,
    user: {
      _id: userid._id,
      firstname: userid.firstname,
      lastname: userid.lastname,
      username: userid.username,
      email: userid.email,
      photo: userid.photo,
      aboutme: userid.aboutme,
      followers: userid.followers,
    },
  };
};

// GET ALL
router.get("/", (req, res) => {
  StoryModel.find()
    .select(selectedField)
    .populate(populateField)
    .then((response) => {
      let modifiedStories = response.map(getStoryFiltered);
      res.status(200).json({ data: modifiedStories });
    })
    .catch((err) => {
      res.status(404).json({ error: err.message });
    });
});

// GET single item
router.get("/:id", (req, res) => {
  StoryModel.findOne({ _id: req.params.id })
    .select(selectedField)
    .populate(populateField)
    .then((response) => {
      if (response === null) {
        res.status(404).json({ error: "Story not found" });
        return;
      }

      return getStoryFiltered(response);
    })
    .then((data) => {
      if (data !== undefined) {
        res.status(200).json({ data });
      }
    })
    .catch((err) => {
      res.status(404).json({ error: err.message });
    });
});

// POST
router.post("/", storyValidate, (req, res) => {
  const errors = validationResult(req);

  if (errors.isEmpty() !== true) {
    return res.status(422).json({ errors: errors.array() });
  }

  let newData = new StoryModel({
    userid: req.body.userid,
    photo: req.body.photo,
    title: req.body.title,
    content: req.body.content,
    claps: 0,
  });

  newData
    .save()
    .then((response) => {
      return getStoryFiltered2(response);
    })
    .then((data) => {
      res.status(200).json({ data });
    })
    .catch((err) => {
      res.status(404).json({ error: err.message });
    });
});

// PUT update item
router.put("/:id", storyValidate, (req, res) => {
  const errors = validationResult(req);

  if (errors.isEmpty() !== true) {
    return res.status(422).json({ errors: errors.array() });
  }

  StoryModel.findByIdAndUpdate(req.params.id, req.body)
    .select(selectedField)
    .populate(populateField)
    .then((response) => {
      return getStoryFiltered(response);
    })
    .then((data) => {
      res.status(200).json({ data });
    })
    .catch((err) => {
      res.status(404).json({ error: err.message });
    });
});

// DELETE
router.delete("/:id", (req, res) => {
  StoryModel.findByIdAndRemove(req.params.id)
    .select(selectedField)
    .populate(populateField)
    .then((response) => {
      res.status(200).json({ message: "ok delete!" });
    })
    .catch((err) => {
      res.status(404).json({ error: err.message });
    });
});

// GET all stories by userid
router.get("/byuser/:id", (req, res) => {
  StoryModel.find({ userid: req.params.id })
    .select(selectedField)
    .populate(populateField)
    .then((response) => {
      let modifiedStories = response.map(getStoryFiltered);
      res.status(200).json({ data: modifiedStories });
    })
    .catch((err) => {
      res.status(404).json({ error: err.message });
    });
});

// Route to clap!
router.post("/:id/claps", (req, res) => {
  StoryModel.findByIdAndUpdate(
    req.params.id,
    { $inc: { claps: 1 } },
    { new: true }
  )
    .then((response) => {
      res.status(200).json({ claps: response.claps });
    })
    .catch((err) => {
      res.status(404).json({ error: err.message });
    });
});

module.exports = router;
