// services/cloudinaryService.js

require("dotenv").config();
const cloudinary = require("cloudinary").v2;

let { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
  process.env;

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});
const uploadProfilePicture = async (filePath) => {
  try {
    if (!filePath) {
      throw new Error("No file path provided");
    }

    const result = await cloudinary.uploader.upload(filePath, {
      folder: "public",
    });

    // console.log("Uploaded image result: ", result);  

    return result.secure_url;
  } catch (error) {
    throw new Error("Error uploading profile picture: " + error.message);
  }
};

module.exports = { uploadProfilePicture };
