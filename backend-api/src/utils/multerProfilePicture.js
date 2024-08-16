import multer from 'multer';

const maxImageSize = 512000; /** 512 KB */
const allowedImageMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: maxImageSize },
  fileFilter: (req, file, cb) => {
    if (!allowedImageMimeTypes.includes(file.mimetype)) {
      return cb(new Error('Invalid file type'), false);
    }
    cb(null, true);
  }
});

export default upload;
