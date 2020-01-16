const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
// apparently not needed?
const ejs = require('ejs');

// set storage object
const storage = multer.diskStorage({
    destination: './public/uploads/',
    // parameter names from multer docs
    filename: function(req,file,cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// const upload = multer({
//     storage: storage
// }).single();

const upload = multer({storage: storage, limits:{fileSize: 10000000}
})

// get express application
const app = express();
// use port 3000 on local machine; process.env.PORT on heroku
const port = process.env.PORT || 3000;

// res.render implicitly searches for matching file with ejs extension
app.set('view engine', 'ejs');
// serve the public directory (mount this directory)
app.use(express.static(path.join(__dirname, '../public')))
app.use("/dist", express.static(path.join(__dirname, '../dist')))


// mount views folder (by default express will serve <approot>/views)
    // changed to mount default folder
//app.set('views', path.join(__dirname, '../templates/views'));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/gallery', (req, res) => {
    // because I am in deaf-fire-art/src (due to app.use), the path here is different than locally
    const image_dir = path.join(__dirname, '../public/uploads');
    var gallery_images = [];
    fs.readdir(image_dir, (err, images) => {
        if (err) {
            return console.log("Unable to scan directory" + err);
        }
        images.forEach(function (image) {
            gallery_images.push("/uploads/" + image);
            //console.log(gallery_images); 
        });
        res.render('gallery', {gallery_images: gallery_images});
    });
    // console.log("test"); 
    // console.log(gallery_images)
    // // first parameter is the ejs file to be rendered - 2nd one is data being passed in (RHS) and what it's being named (LHS)
    // res.render('gallery', {gallery_images: gallery_images});
});

// following REST guidelines - since we are updating the gallery, we should post to '/gallery'
// for some reason rendering the default express error handler to the browser won't work
    // the reason is that redirects are only meant for traditional HTML form submissions
    // Uppy is using AJAX, so it doesn't work correctly.
app.post('/gallery', upload.array('files'), (req, res, next) => {
    console.log(req.files);
    console.log(req.body);
    res.redirect('/gallery');
});

app.get('/gallery/new', (req, res) => {
    res.render('new')
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: "Jeremy Morrison"
    });
});

app.get('/admin', (req, res) => {
    res.render('admin');
})

app.get('*', (req, res) => {
    res.render('404', {
        page: '404 page',
        title: '404',
        name: "Jeremy Morrison"
    });
})

app.listen(port, () => {
    console.log("app listening on port", port);
});