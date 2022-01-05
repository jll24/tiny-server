# Project Tiny

## Backend

This express application is the backend of the Project Tiny.
This includes the following functions

- upload an image file (for the story) to cloudinary
- send an email in forgot password
- resets (or change) the password in reset password
- write a story
- claps a story
- follows a user
- unfollows a user
- gets a profile
- gets followers/following based on profile name
- etc.

Created by: Florentino Tuason and Jaypee Hindang

Technologies used: Node.JS, Mongodb (Mongoose)

Packages used:
- bcrypt (for encrypting/decrypting passwords)
- body-parser (used for reading the body (html) for fields)
- cloudinary (library for cloudinary related functions (just used upload/download image functions))
- cors (allow cors functions)
- dotenv (enable to get environment variables from .env file)
- express (express framework)
- express-validator (to validate input coming from body)
- jsonwebtoken (used in forgot password to encrypt email message)
- lodash (used in forgot password to select fields from object)
- multer (used in image file upload, verify if correct mime type and restrict filesize of image)
- nodemailer (used to send email messages)
