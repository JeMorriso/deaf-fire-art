// see aws-sdk docs
const path = require('path');
const multer = require('multer');
const aws = require('aws-sdk');

require('dotenv').config();

aws.config.update({
  secretAccessKey: process.env.SECRETACCESSKEY,
  accessKeyId: process.env.ACCESSKEYID,
  region: process.env.REGION,
});
const s3 = new aws.S3();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(__dirname, '../../tmp/uploads'));
  },
  filename(req, file, cb) {
    cb(null, `path.parse(file.originalname).name${Date.now().toString()}.jpg`);
  },
});

const upload = multer({ storage });

module.exports = { upload, s3 };
