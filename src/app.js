const express = require('express');
const path = require('path');
// const ejs = require('ejs');

// get express application
const app = express();
// use port 3000 on local machine; process.env.PORT on heroku
const port = process.env.PORT || 3000;

// res.render implicitly searches for matching file with ejs extension
app.set('view engine', 'ejs');
// serve the public directory (mount this directory)
app.use(express.static(path.join(__dirname, '../public')))

// mount views folder (by default express will serve <approot>/views)
    // changed to mount default folder
//app.set('views', path.join(__dirname, '../templates/views'));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/gallery', (req, res) => {
    res.render('the gallery');

})
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