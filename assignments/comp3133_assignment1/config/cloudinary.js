import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadEmployeePhoto = async (imageData) => {
  if (!imageData) return null;
  const result = await cloudinary.uploader.upload(imageData, {
    folder: 'comp3133_employees',
    resource_type: 'image'
  });
  return result.secure_url;
};

export { cloudinary, uploadEmployeePhoto };
