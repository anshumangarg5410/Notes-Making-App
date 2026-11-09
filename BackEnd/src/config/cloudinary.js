const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
  secure: true
});

const isCloudinaryConfigured = () => {
  const name = process.env.CLOUDINARY_CLOUD_NAME;
  const key = process.env.CLOUDINARY_API_KEY;
  const secret = process.env.CLOUDINARY_API_SECRET;

  return Boolean(
    name &&
    key &&
    secret &&
    name.trim() !== '' &&
    key.trim() !== '' &&
    secret.trim() !== '' &&
    !key.includes('your_')
  );
};

// Uploads a file (filepath, buffer, or base64 data URI) to Cloudinary
const uploadToCloudinary = async (fileSource, options = {}) => {
  if (!isCloudinaryConfigured()) {
    return null;
  }

  const defaultOptions = {
    folder: 'notenest/avatars',
    resource_type: 'image',
    transformation: [
      { width: 400, height: 400, crop: 'fill', gravity: 'face' },
      { quality: 'auto', fetch_format: 'auto' }
    ]
  };

  return await cloudinary.uploader.upload(fileSource, {
    ...defaultOptions,
    ...options
  });
};

// Delete an asset from Cloudinary by public ID
const deleteFromCloudinary = async (publicId) => {
  if (!isCloudinaryConfigured() || !publicId) return null;
  return await cloudinary.uploader.destroy(publicId);
};

module.exports = {
  cloudinary,
  isCloudinaryConfigured,
  uploadToCloudinary,
  deleteFromCloudinary
};

