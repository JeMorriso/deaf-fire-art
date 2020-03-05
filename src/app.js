const express = require('express'),
      path = require('path'),
      Admin = require('./js/admin'),
      passport = require('passport');
      
const LocalStrategy = require('passport-local').Strategy; 
      
// use port 3000 on local machine; process.env.PORT on heroku
const port = process.env.PORT || 3000

// get express application
const app = express();

const routes = require('./routers/routes');

app.use(require('express-session')({
    secret: "pyro kid",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// res.render implicitly searches for matching file with ejs extension
app.set('view engine', 'ejs');

// attach form data to request body
    // form data comes as urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// serve the public directory (mount this directory)
app.use(express.static(path.join(__dirname, '../public')));
app.use("/dist", express.static(path.join(__dirname, '../dist')))

app.use('/', routes);

// attach form data to request body
    // form data comes as urlencoded
app.use(express.urlencoded({ extended: true }));

// we're creating a new local password strategy, where Admin.authenticate is given to us from 
    // passport-local-mongoose
passport.use(new LocalStrategy(Admin.authenticate()));
// using methods from passport-local-mongoose as functions for serializing and deserializing
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());

app.listen(port, () => {
    console.log("app listening on port", port);
});