// server/middleware/upload.js
const multer = require('multer');

// Храним файлы в памяти (не на диск)
const storage = multer.memoryStorage();

// Ограничиваем: только изображения, макс. 5 МБ, до 10 файлов
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Только изображения разрешены'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter
});

module.exports = upload;