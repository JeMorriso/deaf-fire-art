const express = require('express'),
      path = require('path'),
      fs = require('fs'),
      multer = require('multer'),
      multerS3 = require('multer-s3'),
      aws = require('aws-sdk'),
      mysql = require('mysql');

require('dotenv').config()

// use port 3000 on local machine; process.env.PORT on heroku
const port = process.env.PORT || 3000

// get express application
const app = express();

const routes = require('./routers/routes');

// res.render implicitly searches for matching file with ejs extension
app.set('view engine', 'ejs');

// serve the public directory (mount this directory)
app.use(express.static(path.join(__dirname, '../public')));
console.log(express.static(path.join(__dirname, '../public')))
app.use("/dist", express.static(path.join(__dirname, '../dist')))

// see aws-sdk docs
aws.config.update({
    secretAccessKey: process.env.SECRETACCESSKEY,
    accessKeyId: process.env.ACCESSKEYID, 
    region: process.env.REGION
});
const s3 = new aws.S3();

// see multers3 docs
const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: process.env.BUCKET_NAME,
      acl: 'public-read',
      metadata: function (req, file, cb) {
        cb(null, {fieldName: 'testing metadata'});
      },
      key: function (req, file, cb) {
        cb(null, path.parse(file.originalname).name + Date.now().toString() + '.jpg')
      }
    })
});
const arrayUpload = upload.array('files');

app.use('/', routes);

app.listen(port, () => {
    console.log("app listening on port", port);
});