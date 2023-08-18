const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/files/reclamations');
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split('/')[1];
    cb(null, `${file.originalname}-${Date.now()}.${ext}`);
  },
});

module.exports = multer({
  storage: storage,
});
