const express = require('express');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const passport = require('passport');
const nodemailer = require('nodemailer');

const mongoose = require('mongoose');
// these lines are needed to avoid deprecation warnings
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/tester');

require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const Admin = require('../js/admin');

const router = express.Router();

// get anything defined on module.exports in app.js
const upload = require('../js/upload');
const db = require('../js/db');

// Middleware function
function isLoggedIn(req, res, next) {
  // this method is from Passport
  if (req.isAuthenticated()) {
    // pass data to next function in middleware chain using res.locals
    res.locals.isLoggedIn = true;
    // next assumes parameters are errors, so we can't pass in data as a parameter
    return next();
  }
  res.locals.isLoggedIn = false;
  return next();
}

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/gallery', isLoggedIn, (req, res) => {
  if (res.locals.isLoggedIn === true) {
    console.log('logged in!');
  }

  db.query(
    'SELECT id, file_prefix, item_description, item_price FROM images',
    (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      const galleryImages = [];
      results.forEach((row) => {
        galleryImages.push({
          image_url_prefix: process.env.BUCKET_URL + row.file_prefix,
          id: row.id,
          item_description: row.item_description,
          item_price: row.item_price,
          file_prefix: row.file_prefix,
        });
      });
      // // first parameter is the ejs file to be rendered - 2nd one is data being passed in (RHS) and what it's being named (LHS)
      res.render('gallery', {
        gallery_images: galleryImages,
        isLoggedIn: res.locals.isLoggedIn,
      });
    },
  );
});

// following REST guidelines - since we are updating the gallery, we should post to '/gallery'
// for some reason rendering the default express error handler to the browser won't work
// the reason is that redirects are only meant for traditional HTML form submissions
// Uppy is using AJAX, so it doesn't work correctly.
router.post('/gallery', isLoggedIn, (req, res, next) => {
  upload.upload.array('files')(req, res, (err) => {
    console.log(req.files);
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
        const filePrefix = path.parse(image.filename).name;
        const smallFname = `${path.parse(image.filename).name}-small.jpg`;
        const bigFname = `${path.parse(image.filename).name}-big.jpg`;

        sharp(image.path)
          .resize({
            width: 400,
            height: 300,
          })
          .toFile(
            path.join(__dirname, `../../tmp/processed_uploads/${smallFname}`),
          )
          .then(() => {
            const fileContent = fs.readFileSync(
              path.join(__dirname, `../../tmp/processed_uploads/${smallFname}`),
            );
            const params = {
              Bucket: process.env.BUCKET_NAME,
              Key: smallFname,
              Body: fileContent,
              // this is needed once I switched from using multer-S3 to AWS SDK directly even though permissions on the bucket allow public access
              // ACL = Access Control List
              ACL: 'public-read',
            };
            upload.s3.upload(params, (err) => {
              if (err) {
                console.log(err);
              } else {
                // data.Key must be equal to small_fname
                const itemDescription = req.body['item-description'];
                const itemPrice = req.body['item-price'];
                db.query(
                  {
                    sql: `INSERT INTO images SET file_prefix=?, item_description=?, item_price=?`,
                    values: [filePrefix, itemDescription, itemPrice],
                  },
                  (err, results, fields) => {
                    if (err) {
                      console.log(err);
                    }
                  },
                );
              }
            });
          });

        sharp(image.path)
          .resize({
            height: 900,
          })
          .toFile(
            path.join(__dirname, `../../tmp/processed_uploads/${bigFname}`),
          )
          .then(() => {
            const fileContent = fs.readFileSync(
              path.join(__dirname, `../../tmp/processed_uploads/${bigFname}`),
            );
            const params = {
              Bucket: process.env.BUCKET_NAME,
              Key: bigFname,
              Body: fileContent,
              ACL: 'public-read',
            };
            upload.s3.upload(params, (err, data) => {
              if (err) {
                console.log(err);
              }
            });
          });
      });
      // FIX THIS - for some reason heroku not getting a response back even when files are successfully uploaded to mysql.
      // It works on localhost and using `heroku local`, but not on heroku
      // this statement allows uppy to recognize that the upload is complete
      res.sendStatus(200);
    }
  });
});

router.get('/gallery/new', (req, res) => {
  res.render('new');
});

router.get('/gallery/:id/edit', (req, res) => {
  db.query(
    'SELECT file_prefix, item_description, item_price FROM images where id = ?',
    req.params.id,
    (err, results) => {
      if (err) {
        console.log(err);
      }
      let image;
      if (results.length) {
        image = {
          image_url_prefix: process.env.BUCKET_URL + results[0].file_prefix,
          id: req.params.id,
          item_description: results[0].item_description,
          item_price: results[0].item_price,
          file_prefix: results[0].file_prefix,
        };
      }
      res.render('edit', {
        image,
      });
    },
  );
});

router.post('/gallery/delete', (req, res) => {
  console.log(req.body);

  // delete image passed in on req.body from database
  req.body.forEach((file) => {
    db.query(
      {
        sql: 'delete from images where file_prefix = ?',
        values: [file],
      },
      (err, results, fields) => {
        if (err) {
          console.log(err);
        }
      },
    );
  });
});

router.post('/email', (req, res) => {
  const mailOptions = {
    from: req.body.email,
    to: process.env.EMAIL,
    subject: req.body.subject,
    // gmail does not allow nodemailer to edit sender
    text: `email from: ${req.body.email}\n\n${req.body.body}`,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log(`Email sent: ${info.response}`);
    }
  });
  res.redirect('/gallery');
});

router.get('/about', (req, res) => {
  res.render('about', {
    title: 'About Me',
    name: 'Jeremy Morrison',
  });
});

router.get('/login', (req, res) => {
  res.render('login');
});

// here we're using passport.authenticate as middleware so that a successful login
// redirects to gallery page
// passport automatically pulls username and password from form and matches it against the hash
// stored in the db
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/gallery',
    failureRedirect: '/login',
  }),
  (req, res) => {
    console.log(req.body.username);
    console.log(req.body.password);
  },
);

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', (req, res) => {
  // this method will hash the password
  // if it worked, the new user is returned as the second argument to the callback function
  Admin.register(
    new Admin({ username: req.body.username }),
    req.body.password,
    (err, user) => {
      if (err) {
        console.log(err);
        // go back to the register page
        return res.render('register');
      }
      // runs the serializeUser() method using the local strategy
      passport.authenticate('local')(req, res, () => {
        return res.redirect('gallery');
      });
      return null;
    },
  );
});

// note here we don't even need to set up a view, since it just redirects straightaway
router.get('/logout', (req, res) => {
  // passport gives us access to this method
  req.logout();
  res.redirect('/');
});

router.get('*', (req, res) => {
  res.render('404', {
    page: '404 page',
    title: '404',
    name: 'Jeremy Morrison',
  });
});

module.exports = router;
