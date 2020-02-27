const express = require('express'),
      path = require('path');

// use port 3000 on local machine; process.env.PORT on heroku
const port = process.env.PORT || 3000

// get express application
const app = express();

const routes = require('./routers/routes');

// res.render implicitly searches for matching file with ejs extension
app.set('view engine', 'ejs');


// serve the public directory (mount this directory)
app.use(express.static(path.join(__dirname, '../public')));
app.use("/dist", express.static(path.join(__dirname, '../dist')))

app.use('/', routes);

app.listen(port, () => {
    console.log("app listening on port", port);
});