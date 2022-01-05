const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 8000;

const userModel = require("./models/user");
const storyModel = require("./models/story");

// Use body-parser
app.use(bodyParser.json());

// Use cors
app.use(cors());

mongoose.connect(
  "mongodb+srv://projecttiny:hellohellohello@cluster0.jrz7x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Import routers into system
const userRouter = require("./routes/user");
const storyRouter = require("./routes/story");
const registerRouter = require("./routes/register");
const uploadRouter = require("./routes/upload");
const followRouter = require("./routes/follow");
const story = require("./models/story");

// Define default endpoints for routers
app.use("/users", userRouter);
app.use("/stories", storyRouter);

// Route for follow/unfollow
app.use("/", followRouter);

// Route for follow/unfollow
app.use("/", followRouter);

// Route for Registration, Login, email-exist
app.use("/", registerRouter);

// Route for Upload
app.use("/", uploadRouter);

// Define a default route for root
app.get("/", (req, res) => {
  // Define our response to the client
  res.send("Welcome to our express server");
});

// Default route for search
app.post("/search", async (req, res) => {
  const { findwhat } = req.body;

  try {
    let result = await storyModel
      .find({ title: { $regex: new RegExp("^" + findwhat + ".*", "i") } })
      .exec();

    res.status(200).json({ data: result });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// Define a catch all route
app.get("*", (req, res, next) => {
  res.status(500).send("Invalid Route");
});

// Start our express server
app.listen(process.env.PORT || port, "0.0.0.0", () => {
  console.log(`Express server running on port ${port}`);
});
