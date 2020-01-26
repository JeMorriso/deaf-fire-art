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
  db.query("SELECT file_name, item_description, item_price FROM images", (err, results, fields) => {
    if (err) {
      return console.log(err);
    }
    console.log(results)
    var gallery_images = [];
    results.forEach((row) => {
      // console.log(row.file_name);
      console.log(row.item_description)
      gallery_images.push({image_url: process.env.BUCKET_URL + row.file_name, item_description: row.item_description, item_price: row.item_price});
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
      //console.log(req.files);
      // console.log(req.body);
      if (err) {
          console.log(err);
      } else {
          // there is a bit of magic happening here that I am unsure of. 
            // Basically, a new req.body is passed in for each file. 
            // then I am able to use that unique req.body for each of the images. 
            // req.files is an array. 
            // due to closure, it works out, and the correct metadata is attached to the correct file
          req.files.forEach((image) => {
            // because req.body has null prototype here, we need to use this syntax in order to call object.prototype, which DOES have hasOwnProperty, while req.body does not
            // var item_description = Object.prototype.hasOwnProperty.call(req.body, 'item-description') ? req.body['item-description'] : 'NULL';
            // var item_price = Object.prototype.hasOwnProperty.call(req.body, 'item-price') ? req.body['item-price'] : 'NULL'
            const item_description = req.body['item-description'];
            const item_price = req.body['item-price'];
            db.query({
              sql: `INSERT INTO images SET file_name=?, item_description=?, item_price=?`,
              values:  [image.key,item_description,item_price]}, (err, results, fields) => {
                if (err) {
                  console.log(err);
                }
              }); 
          })
        // res.sendStatus(200);
        }
  });
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