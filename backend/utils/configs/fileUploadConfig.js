const dotenv = require("dotenv");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const ErrorRespose = require("../ErrorResponse");

// Loading environment values
dotenv.config();

// Config cloudinary
cloudinary.config({
  cloud_name: process.env.FILE_UPLOAD_CLOUD_NAME,
  api_key: process.env.FILE_UPLOAD_API_KEY,
  api_secret: process.env.FILE_UPLOAD_API_SECRET,
});

// Config Uploader
const uploader = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/gif"
    ) {
      cb(null, true);
    } else {
      cb(
        new ErrorRespose(
          "Please upload an image in type (.jpg|.jpeg|.png|.gif)",
          400
        ),
        false
      );
    }
  },
  limits: {
    fileSize: parseInt(process.env.FILE_UPLOAD_LIMIT_SIZE),
  },
});

module.exports = { uploader, cloudinary };
