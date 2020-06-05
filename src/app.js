const express = require('express');
const path = require('path');
const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const redis = require('redis');
const RedisStore = require('connect-redis')(session);

const redisClient = redis.createClient();

const Admin = require('./js/admin');

// use port 3000 on local machine; process.env.PORT on heroku
const port = process.env.PORT || 3000;

// get express application
const app = express();

const routes = require('./routers/routes');

app.use(
  session({
    store: new RedisStore({ client: redisClient, url: process.env.REDIS_URL }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000, secure: false },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

// res.render implicitly searches for matching file with ejs extension
app.set('view engine', 'ejs');

// attach form data to request body
// form data comes as urlencoded
app.use(express.urlencoded({ extended: true }));
// attach json data to request body
app.use(express.json());

// serve the public directory (mount this directory)
app.use(express.static(path.join(__dirname, '../public')));
app.use('/dist', express.static(path.join(__dirname, '../dist')));

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
  console.log('app listening on port', port);
});
