// see aws-sdk docs
const path = require("path"),
  multer = require("multer"),
  multerS3 = require("multer-s3"),
  aws = require("aws-sdk");

require("dotenv").config();

aws.config.update({
  secretAccessKey: process.env.SECRETACCESSKEY,
  accessKeyId: process.env.ACCESSKEYID,
  region: process.env.REGION,
});
const s3 = new aws.S3();

// see multers3 docs
// const upload = multer({
//   storage: multerS3({
//   s3: s3,
//   bucket: process.env.BUCKET_NAME,
//   acl: 'public-read',
//   metadata: function (req, file, cb) {
//     cb(null, {fieldName: 'testing metadata'});
//   },
//   key: function (req, file, cb) {
//     cb(null, path.parse(file.originalname).name + Date.now().toString() + '.jpg')
//   }
//   })
// });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    cb(
      null,
      path.parse(file.originalname).name + Date.now().toString() + ".jpg"
    );
  },
});

const upload = multer({ storage: storage });
// const upload = multer({
//   dest: '../../uploads',
//   filename: function (req, file, cb) {
//   cb(null, path.parse(file.originalname).name + Date.now().toString() + '.jpg')
//   }
// })

module.exports = { upload, s3 };
