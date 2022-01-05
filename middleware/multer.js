const multer = require("multer");

/**
 * multer = middleware package for use in uploading files
 * exports to - this will just export to multer specifiying
 * image extensions to approve for uploading, set limits (filesize) on upload
 */
const imageFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const imageStorage = multer.diskStorage({});

module.exports = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 500000 },
});
