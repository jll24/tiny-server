const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  firstname: { type: String },
  lastname: { type: String },
  email: {
    type: String,
    require: true,
    trim: true,
    index: {
      unique: true,
      collation: { locale: "en", strength: 2 },
    },
  },
  username: { type: String, require: true, index: { unique: true } },
  password: { type: String, require: true, min: 3 },
  photo: { type: String },
  aboutme: { type: String },
  resetlink: {
    data: String,
    default: "",
  },
  followers: [{ type: mongoose.SchemaTypes.ObjectId, ref: "User" }],
  following: [{ type: mongoose.SchemaTypes.ObjectId, ref: "User" }],
  googleId: "",
});

UserSchema.set("timestamps", true);

module.exports = mongoose.model("User", UserSchema);
