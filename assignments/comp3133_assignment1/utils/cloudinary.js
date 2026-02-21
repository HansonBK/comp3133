const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


async function uploadToCloudinary(file) {
  
  const base64 = file.buffer.toString("base64");
  const dataUri = `data:${file.mimetype};base64,${base64}`;

  return cloudinary.uploader.upload(dataUri, {
    folder: "comp3133_assignment1_employees",
    resource_type: "image",
  });
}

module.exports = { uploadToCloudinary };