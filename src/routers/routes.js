const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// get anything defined on module.exports in app.js
const upload = require('../js/upload');
console.log(upload);
//const arrayUpload = upload.array('files');

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/gallery', (req, res) => {
  // because I am in deaf-fire-art/src/routers/, the path here is different than locally
  const image_dir = path.join(__dirname, '../../public/uploads');
  
  var gallery_images = [];
  fs.readdir(image_dir, (err, images) => {
      if (err) {
          return console.log("Unable to scan directory" + err);
      }
      images.forEach(function (image) {
          gallery_images.push("/uploads/" + image);
          // console.log(gallery_images); 
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
      if (err==null) {
          console.log("upload successful");
      } else {
          console.log(err);
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