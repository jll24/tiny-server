// ALL CRUD functionalities related to Story
const router = require("express").Router();
const StoryModel = require("../models/story");
const UserModel = require("../models/user");

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
      following: userid.following,
    },
  };
};

/**
 * Route to get ALL stories
 * parameters - none
 * this will filter the results so that the populated field user, will not display passwords
 * return - success (array of records), error
 */
router.get("/", (req, res) => {
  StoryModel.find()
    .select(selectedField)
    .populate(populateField)
    .sort({ _id: -1 })
    .then((response) => {
      let modifiedStories = response.map(getStoryFiltered);
      res.status(200).json({ data: modifiedStories });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

/**
 * Route to get a SINGLE story
 * parameters - id (id of a single story)
 * this will return a single result then filter the populated field user, will not display passwords
 * return - success (a single story), error
 */
router.get("/:id", (req, res) => {
  StoryModel.findOne({ _id: req.params.id })
    .select(selectedField)
    .populate(populateField)
    .then((response) => {
      if (response === null) {
        res.status(500).json({ error: "Story not found" });
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
      res.status(500).json({ error: err.message });
    });
});

/**
 * Route to post a story
 * parameters - userid, photo, title, content
 * this will add the story to the collection
 * return - success (a single story), error
 */
router.post("/", storyValidate, (req, res) => {
  const errors = validationResult(req);

  if (errors.isEmpty() !== true) {
    return res.status(500).json({ errors: errors.array() });
  }

  UserModel.findOne({ _id: req.body.userid })
    .then((response) => {
      if (response === undefined || response === null) {
        return res.status(500).json({ error: "User not found!" });
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
          res.status(500).json({ error: err.message });
        });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

/**
 * Route to put a SINGLE story
 * parameters - id (id of a single story)
 * parameters - userid, photo, title, content
 * this will update the story with id
 * return - success (a single filtered updated story), error
 */
router.put("/:id", storyValidate, (req, res) => {
  const errors = validationResult(req);

  if (errors.isEmpty() !== true) {
    return res.status(500).json({ errors: errors.array() });
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
      res.status(500).json({ error: err.message });
    });
});

/**
 * Route to delete a SINGLE story
 * parameters - id (id of a single story)
 * this will remove the story with user id
 * return - success (ok delete!), error
 */
router.delete("/:id", (req, res) => {
  StoryModel.findByIdAndRemove(req.params.id)
    .select(selectedField)
    .populate(populateField)
    .then((response) => {
      res.status(200).json({ message: "ok delete!" });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

/**
 * Route to get ALL stories by a single userid
 * parameters - id (id of a user)
 * this will get All stories by a single user
 * return - success (array of records, filtered afterwards to remove sensitive fields), error
 */
router.get("/byuser/:id", (req, res) => {
  StoryModel.find({ userid: req.params.id })
    .select(selectedField)
    .populate(populateField)
    .sort({ _id: -1 })
    .then((response) => {
      let modifiedStories = response.map(getStoryFiltered);
      res.status(200).json({ data: modifiedStories });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

/**
 * Route to clap a single story
 * parameters - id (id of a story)
 * this will increment the claps of a story with id
 * return - success (returns the current clap count), error
 */
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
      res.status(500).json({ error: err.message });
    });
});

module.exports = router;
