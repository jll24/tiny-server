const mongoose = require("mongoose");

const CommentSchema = mongoose.Schema({
  userid: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
  storyid: { type: mongoose.SchemaTypes.ObjectId, ref: "Story" },
  date: { type: String },
  content: { type: String },
});

module.exports = mongoose.model("Comment", CommentSchema);
