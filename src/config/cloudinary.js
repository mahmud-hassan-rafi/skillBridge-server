import { v2 as cloudinary } from "cloudinary";

let isConnected = false;

const connectCloudinary = async () => {
  if (isConnected) return;

  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    isConnected = true;
  } catch (error) {
    console.log(error);
  }
};

export default connectCloudinary;
