const mongoose = require("mongoose");

const StorySchema = mongoose.Schema({
  userid: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
  photo: { type: String },
  title: { type: String },
  content: { type: String },
  claps: { type: Number },
});

StorySchema.set("timestamps", true);

module.exports = mongoose.model("Story", StorySchema);
