// ALL CRUD functionalities related to User
const router = require("express").Router();
const UserModel = require("../models/user");

// Follow user2 (user which is not currently login)
// user1 is the user who is currently logged in
router.put("/follow/:user1/:user2", (req, res) => {
  const { user1, user2 } = req.params;

  if (user1 === user2 || user1 === "" || user2 === "") {
    return res.status(404).json({
      error: "user1, user2 MUST NOT be blank, user1 MUST NOT be equal to user2",
    });
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
          return res.status(404).json({ error: err });
        });
    })
    .catch((err) => {
      return res.status(404).json({ error: err.message });
    });
});

// Follow user2 (user which is not currently login)
// user1 is the user who is currently logged in
router.put("/unfollow/:user1/:user2", (req, res) => {
  const { user1, user2 } = req.params;

  if (user1 === user2 || user1 === "" || user2 === "") {
    return res.status(404).json({
      error: "user1, user2 MUST NOT be blank, user1 MUST NOT be equal to user2",
    });
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
          return res.status(200).json({ message: "Follow Ok" });
        })
        .catch((err) => {
          return res.status(404).json({ error: err });
        });
    })
    .catch((err) => {
      return res.status(404).json({ error: err.message });
    });
});

module.exports = router;
