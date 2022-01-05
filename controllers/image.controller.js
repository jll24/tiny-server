const cloudinary = require("../plugin/cloudinary");

/**
 * ImageController - this is a class that is used to upload/download files from Cloudinary
 * it consist of uploadImage and getImage functions
 */
class ImageController {
  /**
   * uploadImage - function to call if uploading an image file to Cloudinary
   * returns - response obj { success, error }
   * success - true if successfull in uploading the image from Cloudinary
   * success - false if failed in uploading the image from Cloudinary
   */
  async uploadImage(req, res) {
    try {
      // VALIDATION
      console.log(req.file);
      if (!req.file) {
        return res.status(500).json({
          success: false,
          message: "Please select an image",
        });
      }
      // UPLOADING
      const upload = await cloudinary.v2.uploader.upload(req.file.path);
      console.log(upload);

      if (!upload) {
        return res.status(500).json({
          success: false,
          message: "Error uploading image",
        });
      } else {
        console.log("success upload");
        console.log(upload.secure_url);
        console.log(upload.public_id);

        return res.status(200).json({
          success: true,
          message: "Success uploading image",
          data: {
            image_url: upload.secure_url,
            image_id: upload.public_id,
          },
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * getImage - function to call for downloading images from Cloudinary
   * returns - response obj { success, error }
   * success - true if successfull in getting the image from Cloudinary
   * success - false if failed in getting the image from Cloudinary
   */
  async getImage(req, res) {
    try {
      const publicId = req.params.publicId;

      cloudinary.v2.api.resource(publicId, function (error, result) {
        if (error) {
          return res.status(500).json({
            success: false,
            message: "Error getting image",
          });
        }

        return res.status(200).json({
          success: true,
          message: "Success getting image",
          data: result,
        });
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new ImageController();
