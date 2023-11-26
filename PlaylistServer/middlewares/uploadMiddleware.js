const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();

router.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads');
  },
  filename: function (req, file, cb) {
    cb(null, "/uploads-" + file.originalname + '-' + Date.now());
  }
});

const upload = multer({ storage: storage });


module.exports = {
  upload,
  router
};
