// ALL CRUD functionalities related to User
const router = require("express").Router();
const UserModel = require("../models/user");

const selectedField = "-__v -resetlink -password -createdAt -updatedAt";
const populateField = ["followers", "following"];

const followfilter = (response) => {
  const { _id, firstname, lastname, photo, username } = response;
  return { _id, firstname, lastname, photo, username };
};

/**
 * Route to follow a user - this route wil follow user2 (with user1 as the loggined user)
 * return - if success (Follow ok!) else error
 */
router.put("/follow/:user1/:user2", (req, res) => {
  const { user1, user2 } = req.params;

  if (user1 === user2 || user1 === "" || user2 === "") {
    return res.status(500).json({
      error: "user1, user2 MUST NOT be blank, user1 MUST NOT be equal to user2",
    });
  }

  UserModel.count({
    _id: user1,
    following: { $in: user2 },
  })
    .then((data) => {
      if (data === 1) {
        return res
          .status(500)
          .json({ error: "User 2 is already in following" });
      }

      UserModel.findByIdAndUpdate(
        user1,
        {
          $push: { following: user2 },
        },
        { new: true }
      )
        .then((response) => {
          UserModel.findByIdAndUpdate(
            user2,
            {
              $push: { followers: user1 },
            },
            { new: true }
          )
            .then((response) => {
              return res.status(200).json({ message: "Follow Ok" });
            })
            .catch((err) => {
              return res.status(500).json({ error: err });
            });
        })
        .catch((err) => {
          return res.status(500).json({ error: err.message });
        });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

/**
 * Route to unfollow a user - this route wil unfollow user2 (with user1 as the loggined user)
 * return - if success (Unfollow ok!) else error
 */
router.put("/unfollow/:user1/:user2", (req, res) => {
  const { user1, user2 } = req.params;

  if (user1 === user2 || user1 === "" || user2 === "") {
    return res.status(500).json({
      error: "user1, user2 MUST NOT be blank, user1 MUST NOT be equal to user2",
    });
  }

  UserModel.count({
    _id: user1,
    following: { $in: user2 },
  })
    .then((data) => {
      if (data === 0) {
        return res.status(500).json({ error: "User 2 is NOT in following" });
      }

      UserModel.findByIdAndUpdate(
        user1,
        {
          $pull: { following: user2 },
        },
        { new: true }
      )
        .then((response) => {
          UserModel.findByIdAndUpdate(
            user2,
            {
              $pull: { followers: user1 },
            },
            { new: true }
          )
            .then((response) => {
              return res.status(200).json({ message: "Unfollow Ok" });
            })
            .catch((err) => {
              return res.status(500).json({ error: err });
            });
        })
        .catch((err) => {
          return res.status(500).json({ error: err.message });
        });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

/**
 * Route to know if user2 is in the following of user1
 * this route wil test if user2 is following user1
 */
router.get("/isfollow/:user1/:user2", (req, res) => {
  const { user1, user2 } = req.params;

  UserModel.count({
    _id: user1,
    following: { $in: user2 },
  })
    .then((data) => {
      if (data === 1) {
        res.send(true);
      } else {
        res.send(false);
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

/**
 * Route to show followers/following of a single username
 */
router.get("/:id/follow", (req, res) => {
  UserModel.findOne({ username: req.params.id })
    .select(selectedField)
    .populate(populateField)
    .then((response) => {
      if (response === undefined || response === null) {
        return res
          .status(500)
          .json({ error: "User with that username not found!" });
      }

      const { followers, following } = response;
      const fw1 = followers.map(followfilter);
      const fw2 = following.map(followfilter);
      res.status(200).json({ data: { followers: fw1, following: fw2 } });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

module.exports = router;
