// Functionalities for Upload and Get Image
const router = require("express").Router();
const ImageUploader = require("../middleware/multer");
const ImageController = require("../controllers/image.controller");

router.post(
  "/upload",
  ImageUploader.single("file"),
  ImageController.uploadImage
);
router.get("/image/:publicId", ImageController.getImage);

module.exports = router;
