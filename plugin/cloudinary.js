const cloudinary = require("cloudinary");
//require('dotenv').config()

cloudinary.config({
  //cloud_name: process.env.CLOUDINARY_NAME,
  //api_key: process.env.CLOUDINARY_KEY,
  //api_secret: process.env.CLOUDINARY_SECRET
  cloud_name: "jllacson",
  api_key: "971727196395534",
  api_secret: "AHi3d7tH67YsO9hefDUK3Ts3mfA",
  secure: true,
});

module.exports = cloudinary;
