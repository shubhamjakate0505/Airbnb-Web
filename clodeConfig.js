const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRETE
}
);
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust_DEV',
      allowerdFormats:["pnj","jpg","jpej"]
    
    },
  });

  module.exports={
    cloudinary,
    storage,
  }