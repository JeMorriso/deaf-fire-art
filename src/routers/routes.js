const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// get anything defined on module.exports in app.js
const upload = require('../js/upload');
const db = require('../js/db');

console.log(upload);
//const arrayUpload = upload.array('files');

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/gallery', (req, res) => {
  // because I am in deaf-fire-art/src/routers/, the path here is different than locally
  const image_dir = path.join(__dirname, '../../public/uploads');
  db.query("SELECT file_name FROM images", (err, results, fields) => {
    if (err) {
      return console.log(err);
    }
    console.log(results)
    var gallery_images = [];
    results.forEach((row) => {
      // console.log(row.file_name);
      gallery_images.push(process.env.BUCKET_URL + row.file_name);
    });
    // // first parameter is the ejs file to be rendered - 2nd one is data being passed in (RHS) and what it's being named (LHS)
    res.render('gallery', {gallery_images: gallery_images});
  });
});

// following REST guidelines - since we are updating the gallery, we should post to '/gallery'
// for some reason rendering the default express error handler to the browser won't work
  // the reason is that redirects are only meant for traditional HTML form submissions
  // Uppy is using AJAX, so it doesn't work correctly.
router.post('/gallery', (req, res, next) => {
  upload.array('files')(req, res, (err) => {
      console.log(req.files);
      console.log(req.body);
      if (err) {
          console.log(err);
      } else {
          console.log("upload successful");
          req.files.forEach((image) => {
            db.query("INSERT INTO images (file_name) VALUES (?)", [image.key], (err, results, fields) => {
              if (err) {
                console.log(err);
              }
            }); 
          });
          // const image_id = req.files[0]["key"];
          // console.log(image_id);

      }
  })
  res.redirect('/gallery');
});

router.get('/gallery/new', (req, res) => {
  res.render('new')
});

router.get('/about', (req, res) => {
  res.render('about', {
      title: 'About Me',
      name: "Jeremy Morrison"
  });
});

router.get('/admin', (req, res) => {
  res.render('admin');
});

router.get('*', (req, res) => {
  res.render('404', {
      page: '404 page',
      title: '404',
      name: "Jeremy Morrison"
  });
});

module.exports = router;