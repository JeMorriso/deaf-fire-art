const express = require('express');
const path = require('path');
const multer = require('multer');
// apparently not needed?
const ejs = require('ejs');

// get express application
const app = express();
// use port 3000 on local machine; process.env.PORT on heroku
const port = process.env.PORT || 3000;

// res.render implicitly searches for matching file with ejs extension
app.set('view engine', 'ejs');
// serve the public directory (mount this directory)
app.use(express.static(path.join(__dirname, '../public')))
app.use(express.static(path.join(__dirname, '../dist')))


// mount views folder (by default express will serve <approot>/views)
    // changed to mount default folder
//app.set('views', path.join(__dirname, '../templates/views'));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/gallery', (req, res) => {
    var gallery_images = [
        '/img/aaron-burden-Qy-CBKUg_X8-unsplash.jpg'
    ]
    // first parameter is the ejs file to be rendered - 2nd one is data being passed in (RHS) and what it's being named (LHS)
    res.render('gallery', {gallery_images: gallery_images});
});

// following REST guidelines - since we are updating the gallery, we should post to '/gallery'
app.post('/gallery', (req, res) => {
    res.send('POST ROUTE G');
});

app.get('/gallery/new', (req, res) => {
    res.render('new.ejs')
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